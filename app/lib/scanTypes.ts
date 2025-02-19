export interface ScanConfig {
  id: string;
  label: string;
  description: string;
  configFields: ConfigField[];
}

interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'range';
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  required?: boolean;
  defaultValue?: string | number;
}

export const scanTypes: ScanConfig[] = [
  {
    id: 'quick',
    label: 'Quick Scan',
    description: 'Basic vulnerability scan',
    configFields: [
      {
        id: 'target',
        label: 'Target IP/Domain',
        type: 'text',
        placeholder: 'e.g., example.com or 192.168.1.1',
        required: true
      },
      {
        id: 'intensity',
        label: 'Scan Intensity',
        type: 'select',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ],
        defaultValue: 'medium'
      }
    ]
  },
  {
    id: 'full',
    label: 'Full Scan',
    description: 'Comprehensive security analysis',
    configFields: [
      {
        id: 'target',
        label: 'Target IP/Domain',
        type: 'text',
        placeholder: 'e.g., example.com or 192.168.1.1',
        required: true
      },
      {
        id: 'depth',
        label: 'Scan Depth',
        type: 'range',
        min: 1,
        max: 5,
        defaultValue: 3
      },
      {
        id: 'timeout',
        label: 'Timeout (seconds)',
        type: 'number',
        min: 30,
        max: 300,
        defaultValue: 60
      }
    ]
  },
  {
    id: 'ports',
    label: 'Port Scan',
    description: 'Network port enumeration',
    configFields: [
      {
        id: 'target',
        label: 'Target IP/Domain',
        type: 'text',
        placeholder: 'e.g., example.com or 192.168.1.1',
        required: true
      },
      {
        id: 'portRange',
        label: 'Port Range',
        type: 'select',
        options: [
          { value: 'common', label: 'Common Ports (1-1024)' },
          { value: 'extended', label: 'Extended (1-10000)' },
          { value: 'full', label: 'Full Range (1-65535)' }
        ],
        defaultValue: 'common'
      },
      {
        id: 'scanType',
        label: 'Scan Type',
        type: 'select',
        options: [
          { value: 'tcp', label: 'TCP' },
          { value: 'udp', label: 'UDP' },
          { value: 'both', label: 'TCP & UDP' }
        ],
        defaultValue: 'tcp'
      }
    ]
  },
  {
    id: 'web',
    label: 'Web Scan',
    description: 'Web application vulnerabilities',
    configFields: [
      {
        id: 'target',
        label: 'Target URL',
        type: 'text',
        placeholder: 'https://example.com',
        required: true
      },
      {
        id: 'crawlDepth',
        label: 'Crawl Depth',
        type: 'number',
        min: 1,
        max: 10,
        defaultValue: 3
      },
      {
        id: 'scanTypes',
        label: 'Scan Types',
        type: 'select',
        options: [
          { value: 'xss', label: 'XSS Vulnerabilities' },
          { value: 'sqli', label: 'SQL Injection' },
          { value: 'all', label: 'All Vulnerabilities' }
        ],
        defaultValue: 'all'
      }
    ]
  },
  {
    id: 'malware',
    label: 'Malware Scan',
    description: 'Malware detection scan',
    configFields: [
      {
        id: 'target',
        label: 'Target URL/File',
        type: 'text',
        placeholder: 'URL or file path',
        required: true
      },
      {
        id: 'engineType',
        label: 'Scan Engine',
        type: 'select',
        options: [
          { value: 'quick', label: 'Quick Scan' },
          { value: 'deep', label: 'Deep Analysis' },
          { value: 'heuristic', label: 'Heuristic Detection' }
        ],
        defaultValue: 'quick'
      }
    ]
  }
];