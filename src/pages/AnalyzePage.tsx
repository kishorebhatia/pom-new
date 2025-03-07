import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiCheckCircle, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { usePrdStore, StructuredRequirement } from '../store/prdStore';
import { analyzePrdDocument } from '../core/analyzer/prdAnalyzer';

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { prdDocument, requirements, setRequirements, updateRequirement, setAppMetadata } = usePrdStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');

  // Check if we have a PRD document to analyze
  useEffect(() => {
    if (!prdDocument) {
      navigate('/upload');
    } else if (requirements.length === 0) {
      // Auto-analyze when first loading with a document
      handleAnalyze();
    }
  }, [prdDocument, navigate, requirements.length]);

  const handleAnalyze = async () => {
    if (!prdDocument) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Call the analyzer function
      const result = await analyzePrdDocument(prdDocument.text);
      
      // Update the store with the extracted requirements
      setRequirements(result.requirements);
      
      // Set app metadata
      setAppName(result.appName);
      setAppDescription(result.appDescription);
      setAppMetadata(result.appName, result.appDescription, result.techStack);
    } catch (err) {
      setError('Failed to analyze the document. Please try again or adjust the document content.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddRequirement = () => {
    const newRequirement: StructuredRequirement = {
      id: `req-${Date.now()}`,
      category: 'custom',
      description: 'New requirement',
      priority: 'medium',
      status: 'pending',
    };
    
    setRequirements([...requirements, newRequirement]);
    setEditingRequirement(newRequirement.id);
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(requirements.filter(req => req.id !== id));
  };

  const handleUpdateRequirement = (id: string, field: keyof StructuredRequirement, value: any) => {
    updateRequirement(id, { [field]: value });
  };

  const handleSaveMetadata = () => {
    setAppMetadata(appName, appDescription, []);
  };

  const handleContinue = () => {
    navigate('/generate');
  };

  const renderRequirementEditor = (requirement: StructuredRequirement) => {
    const isEditing = editingRequirement === requirement.id;
    
    return (
      <div key={requirement.id} className="border rounded-md p-4 mb-3 bg-white">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={requirement.category}
                onChange={(e) => handleUpdateRequirement(requirement.id, 'category', e.target.value)}
                className="input"
              >
                <option value="functional">Functional</option>
                <option value="ui">UI/UX</option>
                <option value="data">Data</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={requirement.description}
                onChange={(e) => handleUpdateRequirement(requirement.id, 'description', e.target.value)}
                className="input min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={requirement.priority}
                  onChange={(e) => handleUpdateRequirement(
                    requirement.id, 
                    'priority', 
                    e.target.value as 'high' | 'medium' | 'low'
                  )}
                  className="input"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={requirement.status}
                  onChange={(e) => handleUpdateRequirement(
                    requirement.id, 
                    'status', 
                    e.target.value as 'pending' | 'analyzed' | 'implemented' | 'tested'
                  )}
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="analyzed">Analyzed</option>
                  <option value="implemented">Implemented</option>
                  <option value="tested">Tested</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setEditingRequirement(null)}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  requirement.category === 'functional' ? 'bg-blue-100 text-blue-800' :
                  requirement.category === 'ui' ? 'bg-purple-100 text-purple-800' :
                  requirement.category === 'data' ? 'bg-green-100 text-green-800' :
                  requirement.category === 'performance' ? 'bg-yellow-100 text-yellow-800' :
                  requirement.category === 'security' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                } mb-2`}>
                  {requirement.category}
                </span>
                <h3 className="font-medium">{requirement.description}</h3>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingRequirement(requirement.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDeleteRequirement(requirement.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <div className="flex mt-3 text-sm">
              <span className={`mr-4 ${
                requirement.priority === 'high' ? 'text-red-600' :
                requirement.priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                Priority: {requirement.priority}
              </span>
              <span className={`${
                requirement.status === 'pending' ? 'text-gray-600' :
                requirement.status === 'analyzed' ? 'text-blue-600' :
                requirement.status === 'implemented' ? 'text-green-600' :
                'text-purple-600'
              }`}>
                Status: {requirement.status}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analyze PRD Document</h1>
      
      {prdDocument && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md flex items-center">
          <FiFileText className="text-gray-500 mr-3" />
          <div>
            <h2 className="font-medium">{prdDocument.name}</h2>
            <p className="text-sm text-gray-500">
              {prdDocument.type === 'file' ? 'Uploaded file' : 'From URL'}
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">App Metadata</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-1">
                App Name
              </label>
              <input
                type="text"
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="input"
                placeholder="My App"
              />
            </div>
            
            <div>
              <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700 mb-1">
                App Description
              </label>
              <textarea
                id="appDescription"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                className="input min-h-[100px]"
                placeholder="A brief description of your application"
              />
            </div>
            
            <button
              onClick={handleSaveMetadata}
              className="btn btn-primary"
            >
              Save Metadata
            </button>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Analysis Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !prdDocument}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
            </button>
            
            <div className="text-sm text-gray-600">
              <p>The analyzer will:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Extract requirements from the PRD document</li>
                <li>Categorize requirements by type</li>
                <li>Assign priority levels</li>
                <li>Suggest app name and description</li>
                <li>Determine appropriate tech stack</li>
              </ul>
            </div>
            
            <button
              onClick={handleContinue}
              disabled={requirements.length === 0}
              className="btn btn-secondary w-full flex justify-center items-center"
            >
              Continue to Code Generation
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Requirements ({requirements.length})</h2>
          <button
            onClick={handleAddRequirement}
            className="btn btn-outline flex items-center"
          >
            <FiPlus className="mr-1" /> Add Requirement
          </button>
        </div>
        
        {requirements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {isAnalyzing ? (
              <p>Analyzing document and extracting requirements...</p>
            ) : (
              <p>No requirements found. Click "Analyze Document" to extract requirements.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {requirements.map(renderRequirementEditor)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage; 