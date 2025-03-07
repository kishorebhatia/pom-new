import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiLink, FiX } from 'react-icons/fi';
import { usePrdStore } from '../store/prdStore';

const UploadPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPrdDocument } = usePrdStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsLoading(true);
    setError(null);
    
    try {
      // Store the file in the global state
      setPrdDocument({
        type: 'file',
        name: file.name,
        content: file,
        text: await file.text(),
      });
      
      // Navigate to the analyze page
      navigate('/analyze');
    } catch (err) {
      setError('Failed to process the file. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setPrdDocument]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt', '.md'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the document from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type') || '';
      const content = await response.text();
      
      // Store the document in the global state
      setPrdDocument({
        type: 'url',
        name: url.split('/').pop() || 'document',
        url,
        content: null,
        text: content,
      });
      
      // Navigate to the analyze page
      navigate('/analyze');
    } catch (err) {
      setError('Failed to fetch the document from the URL. Please check the URL and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setPrdDocument(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload PRD Document</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiFile className="mr-2" /> Upload File
          </h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop a PRD file here, or click to select a file
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, TXT, MD, JSON
            </p>
          </div>
          
          {acceptedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <FiFile className="text-gray-500 mr-2" />
                <span className="text-sm truncate max-w-xs">
                  {acceptedFiles[0].name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
        
        {/* URL Input */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiLink className="mr-2" /> Provide URL
          </h2>
          
          <form onSubmit={handleUrlSubmit}>
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Document URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Loading...' : 'Fetch Document'}
            </button>
          </form>
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Supported Document Types</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
              PDF
            </span>
            <span>PDF documents with text content (not scanned images)</span>
          </li>
          <li className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
              TXT
            </span>
            <span>Plain text files</span>
          </li>
          <li className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
              MD
            </span>
            <span>Markdown files</span>
          </li>
          <li className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
              JSON
            </span>
            <span>JSON files with structured requirements</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage; 