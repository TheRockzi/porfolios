import axios from 'axios';
import { format } from 'date-fns';

export interface SystemActivity {
  timestamp: string;
  value: number;
  port?: number;
  product?: string;
  version?: string;
  vulns?: Record<string, any>;
}

export interface ThreatData {
  timestamp: string;
  count: number;
  type: string;
  domain?: string;
  score?: number;
  malicious?: boolean;
}

export interface ScanProgress {
  progress: number;
  status: string;
  details?: string;
}

const logError = (message: string, error: unknown) => {
  if (error instanceof Error) {
    console.error(message, error.message);
  } else {
    console.error(message, 'Unknown error occurred');
  }
};

export const performScan = async (
  scanType: string, 
  config: Record<string, any>,
  onProgress: (progress: ScanProgress) => void
): Promise<void> => {
  try {
    const totalSteps = getScanSteps(scanType, config);
    let currentStep = 0;

    const updateProgress = (status: string, details?: string) => {
      currentStep++;
      const progress = Math.round((currentStep / totalSteps) * 100);
      onProgress({ progress, status, details });
    };

    // Initial setup
    updateProgress('Inicializando escaneo...', 'Configurando entorno de escaneo');
    await delay(500);

    // Validación del objetivo
    updateProgress('Validando objetivo...', `Objetivo: ${config.target}`);
    
    // Construir la consulta de Shodan basada en el tipo de escaneo y configuración
    let shodanQuery = '';
    switch (scanType) {
      case 'quick':
        shodanQuery = `hostname:${config.target} port:22,80,443`;
        break;
      case 'full':
        shodanQuery = `hostname:${config.target}`;
        break;
      case 'ports':
        const portRange = {
          'common': '1-1024',
          'extended': '1-10000',
          'full': '1-65535'
        }[config.portRange];
        shodanQuery = `hostname:${config.target} port:${portRange}`;
        if (config.scanType !== 'both') {
          shodanQuery += ` transport:${config.scanType}`;
        }
        break;
      case 'web':
        shodanQuery = `http.host:${config.target}`;
        if (config.scanTypes !== 'all') {
          shodanQuery += ` vuln:${config.scanTypes}`;
        }
        break;
      case 'malware':
        shodanQuery = `hostname:${config.target} malware:*`;
        break;
    }

    // Consulta a Shodan
    updateProgress('Consultando Shodan...', 'Obteniendo información del host');
    try {
      const shodanResponse = await axios.get('/api/proxy', {
        params: {
          endpoint: 'activity',
          target: config.target,
          query: shodanQuery
        }
      });

      if (shodanResponse.data.matches) {
        // Procesar puertos encontrados
        const ports = shodanResponse.data.matches
          .map((match: any) => match.port)
          .filter((port: number, index: number, self: number[]) => self.indexOf(port) === index);

        updateProgress('Analizando puertos...', `Puertos abiertos detectados: ${ports.join(', ')}`);

        // Procesar servicios y vulnerabilidades
        shodanResponse.data.matches.forEach((match: any) => {
          if (match.product) {
            updateProgress(
              'Detección de servicios',
              `Puerto ${match.port}: ${match.product}${match.version ? ` (v${match.version})` : ''}`
            );
          }
          if (match.vulns) {
            Object.entries(match.vulns).forEach(([vuln, details]: [string, any]) => {
              updateProgress(
                'Vulnerabilidad detectada',
                `${vuln}: ${details.summary} (CVSS: ${details.cvss})`
              );
            });
          }
        });
      }
    } catch (error) {
      updateProgress('Error en escaneo Shodan', 'No se pudo obtener datos de Shodan');
    }

    // Consulta a URLScan para análisis web
    if (['web', 'full', 'malware'].includes(scanType)) {
      updateProgress('Consultando URLScan...', 'Analizando presencia web');
      try {
        const urlscanResponse = await axios.get('/api/proxy', {
          params: {
            endpoint: 'threats',
            target: config.target
          }
        });

        if (urlscanResponse.data.results) {
          urlscanResponse.data.results.forEach((result: any) => {
            if (result.page) {
              updateProgress(
                'Análisis web',
                `Dominio: ${result.page.domain}`
              );
            }
            if (result.stats) {
              updateProgress(
                'Estadísticas de seguridad',
                `Indicadores maliciosos: ${result.stats.malicious || 0}, Sospechosos: ${result.stats.suspicious || 0}`
              );
            }
            if (result.verdicts?.overall) {
              const verdict = result.verdicts.overall;
              updateProgress(
                'Veredicto de seguridad',
                `Puntuación general: ${verdict.score}, Malicioso: ${verdict.malicious ? 'Sí' : 'No'}`
              );
            }
          });
        }
      } catch (error) {
        updateProgress('Error en URLScan', 'No se pudo obtener datos de URLScan');
      }
    }

    // Evaluación de riesgos basada en la configuración
    if (scanType === 'full' || config.intensity === 'high') {
      updateProgress('Realizando evaluación de riesgos...', 'Analizando datos recopilados');
      await delay(500);
    }

    // Reporte final
    updateProgress('Generando reporte final...', 'Compilando hallazgos');
    await delay(500);

    updateProgress('Escaneo completado', 'Todas las tareas de análisis han finalizado. Revisa los hallazgos anteriores.');
  } catch (error) {
    logError('Error en el escaneo:', error);
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getScanSteps = (scanType: string, config: Record<string, any>): number => {
  switch (scanType) {
    case 'quick':
      return config.intensity === 'high' ? 10 : 8;
    case 'full':
      return config.depth * 3 + 6;
    case 'ports':
      return config.portRange === 'full' ? 20 : 
             config.portRange === 'extended' ? 15 : 10;
    case 'web':
      return config.scanTypes === 'all' ? 18 : 12;
    case 'malware':
      return config.engineType === 'deep' ? 15 : 8;
    default:
      return 8;
  }
};

export const fetchRecentScans = async () => {
  try {
    const response = await axios.get('/api/proxy?endpoint=scans');
    return typeof response.data.total === 'number' ? response.data.total : 0;
  } catch (error) {
    logError('Error al obtener datos de escaneos:', error);
    return 0;
  }
};

export const fetchDataSources = async () => {
  try {
    const response = await axios.get('/api/proxy?endpoint=sources');
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    logError('Error al obtener fuentes de datos:', error);
    return 0;
  }
};

export const fetchSystemActivity = async (): Promise<SystemActivity[]> => {
  try {
    const response = await axios.get('/api/proxy?endpoint=activity');
    
    if (!Array.isArray(response.data.matches)) {
      return [];
    }

    return response.data.matches.map((match: any) => ({
      timestamp: typeof match.timestamp === 'string' ? match.timestamp : format(new Date(), 'HH:mm'),
      value: typeof match.value === 'number' ? match.value : 0,
      port: match.port,
      product: match.product,
      version: match.version,
      vulns: match.vulns
    }));
  } catch (error) {
    logError('Error al obtener actividad del sistema:', error);
    return [];
  }
};

export const fetchThreatData = async (): Promise<ThreatData[]> => {
  try {
    const response = await axios.get('/api/proxy?endpoint=threats');
    
    if (!Array.isArray(response.data.results)) {
      return [];
    }

    return response.data.results.map((result: any) => ({
      timestamp: result.timestamp || format(new Date(), 'HH:mm'),
      count: typeof result.count === 'number' ? result.count : 0,
      type: 'malicious',
      domain: result.page?.domain,
      score: result.verdicts?.overall?.score,
      malicious: result.verdicts?.overall?.malicious
    }));
  } catch (error) {
    logError('Error al obtener datos de amenazas:', error);
    return [];
  }
};