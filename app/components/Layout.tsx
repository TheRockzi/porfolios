'use client';

import { motion } from 'framer-motion';
import { 
  FiSearch, FiDatabase, FiGlobe, FiFileText, 
  FiClock, FiMonitor, FiMapPin, FiShield,
  FiRefreshCw, FiPlay, FiChevronDown,
  FiSettings, FiLogOut
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchRecentScans, fetchDataSources, fetchSystemActivity, fetchThreatData, performScan } from '../lib/api';
import { scanTypes } from '../lib/scanTypes';
import { ScanConfigModal } from './ScanConfigModal';
import { ScanProgress } from './ScanProgress';
import { ScanTerminal } from './ScanTerminal';
import type { ScanProgress as ScanProgressType } from '../lib/api';

interface LayoutProps {
  onLogout: () => void;
}

const menuItems = [
  { icon: FiSearch, label: 'OSINT Search' },
  { icon: FiDatabase, label: 'Data Sources' },
  { icon: FiGlobe, label: 'Social Analysis' },
  { icon: FiFileText, label: 'Metadata Analysis' },
  { icon: FiClock, label: 'History' },
  { icon: FiMonitor, label: 'Dark Web Monitor' },
  { icon: FiMapPin, label: 'Geolocation' },
];

export function Layout({ onLogout }: LayoutProps) {
  const [scansCount, setScansCount] = useState(0);
  const [sourcesCount, setSourcesCount] = useState(0);
  const [systemActivity, setSystemActivity] = useState([]);
  const [threatData, setThreatData] = useState([]);
  const [showScanTypes, setShowScanTypes] = useState(false);
  const [selectedScan, setSelectedScan] = useState(scanTypes[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgressType | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [scans, sources, activity, threats] = await Promise.all([
        fetchRecentScans(),
        fetchDataSources(),
        fetchSystemActivity(),
        fetchThreatData()
      ]);

      setScansCount(scans);
      setSourcesCount(sources);
      setSystemActivity(activity);
      setThreatData(threats);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleScanTypeSelect = (scanType: typeof scanTypes[0]) => {
    setSelectedScan(scanType);
    setShowScanTypes(false);
    setShowConfigModal(true);
  };

  const handleStartScan = async (config: Record<string, any>) => {
    setIsScanning(true);
    setScanLogs(prev => [...prev, `Starting ${selectedScan.label.toLowerCase()} scan...`]);
    setScanLogs(prev => [...prev, `Configuration: ${JSON.stringify(config, null, 2)}`]);
    
    try {
      await performScan(selectedScan.id, config, (progress) => {
        setScanProgress(progress);
        if (progress.details) {
          setScanLogs(prev => [...prev, progress.details]);
        }
      });
      setScanLogs(prev => [...prev, 'Scan completed successfully']);
    } catch (error) {
      console.error('Scan error:', error);
      setScanLogs(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`]);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-[280px] bg-black/40 backdrop-blur-md border-r border-white/10 p-4 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-8">
          <FiShield className="text-[#ff0000] text-2xl animate-pulse" />
          <div>
            <h1 className="text-xl font-semibold text-white title-glitch">KaliumOSINT</h1>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="OSINT Search"
            className="search-input"
          />
          <FiSearch className="absolute right-3 top-3 text-[#ff0000]/50" />
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map(({ icon: Icon, label }) => (
            <button key={label} className="sidebar-item group">
              <Icon className="text-xl group-hover:text-[#ff0000] transition-colors" />
              <span className="group-hover:text-[#ff0000] transition-colors">{label}</span>
            </button>
          ))}
        </nav>

        {/* Settings and Logout Buttons */}
        <div className="pt-4 border-t border-white/10 space-y-1">
          <button className="sidebar-item group">
            <FiSettings className="text-xl group-hover:text-[#ff0000] transition-colors" />
            <span className="group-hover:text-[#ff0000] transition-colors">Settings</span>
          </button>
          <button 
            onClick={onLogout}
            className="sidebar-item group"
          >
            <FiLogOut className="text-xl group-hover:text-[#ff0000] transition-colors" />
            <span className="group-hover:text-[#ff0000] transition-colors">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-500">Real-time OSINT monitoring</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button 
                className="scan-button group"
                onClick={() => setShowScanTypes(!showScanTypes)}
              >
                <span className="flex items-center gap-2">
                  <FiPlay className={`transition-transform duration-500 ${isScanning ? 'animate-pulse text-[#ff0000]' : ''}`} />
                  {selectedScan.label}
                  <FiChevronDown className={`transition-transform duration-300 ${showScanTypes ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {showScanTypes && (
                <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50">
                  {scanTypes.map((type) => (
                    <button
                      key={type.id}
                      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors first:rounded-t-lg last:rounded-b-lg flex flex-col"
                      onClick={() => handleScanTypeSelect(type)}
                    >
                      <span className="text-white font-medium">{type.label}</span>
                      <span className="text-sm text-gray-500">{type.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="new-scan-button group"
              onClick={fetchData}
            >
              <span className="flex items-center gap-2">
                <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                Refresh Data
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">Active Scans</h3>
              <FiSearch className="text-[#ff0000]" />
            </div>
            <div className="text-3xl font-semibold mb-2">{scansCount}</div>
            <div className="text-sm">
              <span className="text-[#ff0000]">Live</span>
              <span className="text-gray-500 ml-1">updates every 30s</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">Data Sources</h3>
              <FiDatabase className="text-[#00e5ff]" />
            </div>
            <div className="text-3xl font-semibold mb-2">{sourcesCount}</div>
            <div className="text-sm">
              <span className="text-[#00e5ff]">Active</span>
              <span className="text-gray-500 ml-1">data feeds</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">Threats Detected</h3>
              <FiShield className="text-[#ff1493]" />
            </div>
            <div className="text-3xl font-semibold mb-2">
              {threatData.reduce((acc: number, curr: any) => acc + curr.count, 0)}
            </div>
            <div className="text-sm">
              <span className="text-[#ff1493]">Active</span>
              <span className="text-gray-500 ml-1">threats</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">System Status</h3>
              <FiMonitor className="text-[#00e5ff]" />
            </div>
            <div className="text-3xl font-semibold mb-2">Online</div>
            <div className="text-sm">
              <span className="text-[#00e5ff]">100%</span>
              <span className="text-gray-500 ml-1">uptime</span>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div 
            className="chart-container"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">System Activity</h3>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-[#ff0000] transition-colors">
                  <FiSearch className="text-lg" />
                </button>
                <button className="text-gray-500 hover:text-[#ff0000] transition-colors">
                  <FiClock className="text-lg" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ background: '#141414', border: 'none' }}
                  itemStyle={{ color: '#ff0000' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ff0000" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            className="chart-container"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">Threat Detection</h3>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-[#00e5ff] transition-colors">
                  <FiSearch className="text-lg" />
                </button>
                <button className="text-gray-500 hover:text-[#00e5ff] transition-colors">
                  <FiClock className="text-lg" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ background: '#141414', border: 'none' }}
                  itemStyle={{ color: '#00e5ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#00e5ff" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Scan Terminal */}
          <ScanTerminal logs={scanLogs} />
        </div>
      </div>

      {/* Scan Configuration Modal */}
      <ScanConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        scanConfig={selectedScan}
        onStartScan={handleStartScan}
      />

      {/* Scan Progress Indicator */}
      {scanProgress && <ScanProgress progress={scanProgress} />}
    </div>
  );
}