import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiCode, FiTerminal, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { usePrdStore } from '../store/prdStore';
import { setupWebContainer } from '../core/webcontainer/webContainerSetup';
import { generateProjectFiles } from '../core/webcontainer/projectFileGenerator';

const PreviewPage = () => {
  const navigate = useNavigate();
  const { components, appName, appDescription, techStack } = usePrdStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal'>('preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webContainerRef = useRef<any>(null);

  // Check if we have components to preview
  useEffect(() => {
    if (components.length === 0) {
      navigate('/generate');
    }
  }, [components, navigate]);

  // Initialize WebContainer
  useEffect(() => {
    const initWebContainer = async () => {
      if (components.length === 0) return;
      
      setIsLoading(true);
      setError(null);
      setLogs([]);
      
      try {
        // Generate project files
        const files = generateProjectFiles(components, appName, appDescription, techStack);
        
        // Set up WebContainer
        const { webContainer, iframe } = await setupWebContainer(files);
        webContainerRef.current = webContainer;
        
        // Listen for console logs
        webContainer.on('console', (message: any) => {
          const logMessage = `[${message.type}] ${message.message}`;
          setLogs(prevLogs => [...prevLogs, logMessage]);
        });
        
        // Mount iframe
        if (iframeRef.current && iframe) {
          iframeRef.current.src = iframe.src;
        }
      } catch (err) {
        console.error('Failed to initialize WebContainer:', err);
        setError('Failed to initialize preview environment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initWebContainer();
  }, [components, appName, appDescription, techStack]);

  const handleRefresh = async () => {
    if (!webContainerRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Restart the dev server
      await webContainerRef.current.spawn('npm', ['run', 'dev']);
      
      // Clear logs
      setLogs([]);
    } catch (err) {
      console.error('Failed to refresh preview:', err);
      setError('Failed to refresh preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/export');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Preview Application</h1>
      
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">App Info</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">App Name</p>
                <p className="bg-gray-50 p-2 rounded">{appName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Components</p>
                <p className="bg-gray-50 p-2 rounded">{components.length} components</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <span key={index} className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading || !webContainerRef.current}
                className="btn btn-outline w-full flex justify-center items-center"
              >
                <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Preview
              </button>
              
              <button
                onClick={handleContinue}
                className="btn btn-primary w-full"
              >
                Continue to Export
              </button>
            </div>
          </div>
          
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Components</h2>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {components.map((component) => (
                <div key={component.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{component.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {component.requirementIds.length} requirements
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="card">
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'preview'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiPlay className="inline mr-1" /> Preview
              </button>
              
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'terminal'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiTerminal className="inline mr-1" /> Terminal
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <FiAlertTriangle className="mr-2" /> {error}
              </div>
            )}
            
            {activeTab === 'preview' && (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <FiRefreshCw className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-2" />
                      <p>Loading preview...</p>
                    </div>
                  </div>
                )}
                <div className="border rounded-md overflow-hidden" style={{ height: '600px' }}>
                  <iframe
                    ref={iframeRef}
                    title="App Preview"
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'terminal' && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto" style={{ height: '600px' }}>
                {logs.length === 0 ? (
                  <div className="text-gray-500 italic">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage; 