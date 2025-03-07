import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { usePrdStore } from '../store/prdStore';
import { generateProjectFiles } from '../core/webcontainer/projectFileGenerator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ExportPage = () => {
  const navigate = useNavigate();
  const { components, appName, appDescription, techStack } = usePrdStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have components to export
  useState(() => {
    if (components.length === 0) {
      navigate('/generate');
    }
  });

  const handleExport = async () => {
    if (components.length === 0) return;
    
    setIsExporting(true);
    setExportSuccess(false);
    setError(null);
    
    try {
      // Generate project files
      const files = generateProjectFiles(components, appName, appDescription, techStack);
      
      // Create a zip file
      const zip = new JSZip();
      
      // Helper function to recursively add files to the zip
      const addFilesToZip = (fileTree: any, currentPath: string = '') => {
        Object.entries(fileTree).forEach(([name, entry]: [string, any]) => {
          const path = currentPath ? `${currentPath}/${name}` : name;
          
          if (entry.file) {
            zip.file(path, entry.file.contents);
          } else if (entry.directory) {
            addFilesToZip(entry.directory, path);
          }
        });
      };
      
      // Add files to the zip
      addFilesToZip(files);
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the zip file
      saveAs(content, `${appName.toLowerCase().replace(/\s+/g, '-')}.zip`);
      
      setExportSuccess(true);
    } catch (err) {
      console.error('Failed to export project:', err);
      setError('Failed to export project. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Export Project</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">App Name</p>
              <p className="bg-gray-50 p-2 rounded">{appName}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
              <p className="bg-gray-50 p-2 rounded text-sm">{appDescription}</p>
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
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Components</p>
              <p className="bg-gray-50 p-2 rounded">{components.length} components</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Export Options</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Download as ZIP</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download the complete project as a ZIP file, including all source code, configuration files, and documentation.
              </p>
              
              <button
                onClick={handleExport}
                disabled={isExporting || components.length === 0}
                className="btn btn-primary w-full flex justify-center items-center"
              >
                {isExporting ? (
                  <>
                    <FiDownload className="animate-pulse mr-2" /> Exporting...
                  </>
                ) : (
                  <>
                    <FiDownload className="mr-2" /> Export Project
                  </>
                )}
              </button>
            </div>
            
            {exportSuccess && (
              <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center">
                <FiCheck className="mr-2" /> Project exported successfully!
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
                <FiAlertTriangle className="mr-2" /> {error}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Included Files</h2>
        
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium">Source Code</h3>
            <p className="text-sm text-gray-600">
              All React components, pages, and utility functions.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium">Configuration Files</h3>
            <p className="text-sm text-gray-600">
              package.json, tsconfig.json, vite.config.js, and other configuration files.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium">Documentation</h3>
            <p className="text-sm text-gray-600">
              README.md with project information, setup instructions, and usage guidelines.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium">Tests</h3>
            <p className="text-sm text-gray-600">
              Unit tests for components to ensure functionality.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">1. Extract the ZIP file</h3>
            <p className="text-sm text-gray-600">
              Extract the downloaded ZIP file to a directory on your computer.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">2. Install dependencies</h3>
            <p className="text-sm text-gray-600">
              Open a terminal in the extracted directory and run <code className="bg-gray-200 px-1 py-0.5 rounded">npm install</code> or <code className="bg-gray-200 px-1 py-0.5 rounded">yarn install</code>.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">3. Start the development server</h3>
            <p className="text-sm text-gray-600">
              Run <code className="bg-gray-200 px-1 py-0.5 rounded">npm run dev</code> or <code className="bg-gray-200 px-1 py-0.5 rounded">yarn dev</code> to start the development server.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">4. Build for production</h3>
            <p className="text-sm text-gray-600">
              When you're ready to deploy, run <code className="bg-gray-200 px-1 py-0.5 rounded">npm run build</code> or <code className="bg-gray-200 px-1 py-0.5 rounded">yarn build</code> to create a production build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage; 