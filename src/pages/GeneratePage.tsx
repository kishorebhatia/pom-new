import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiRefreshCw, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { usePrdStore, StructuredRequirement, GeneratedComponent } from '../store/prdStore';
import { generateCode } from '../core/generator/codeGenerator';
import CodePreview from '../components/CodePreview';

const GeneratePage = () => {
  const navigate = useNavigate();
  const { 
    requirements, 
    components, 
    setComponents, 
    appName, 
    appDescription, 
    techStack,
    currentIteration,
    setCurrentIteration
  } = usePrdStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<{
    totalRequirements: number;
    coveredRequirements: number;
    coverage: number;
    missingRequirements: string[];
  }>({
    totalRequirements: 0,
    coveredRequirements: 0,
    coverage: 0,
    missingRequirements: [],
  });

  // Check if we have requirements to generate code from
  useEffect(() => {
    if (requirements.length === 0) {
      navigate('/analyze');
    }
  }, [requirements, navigate]);

  // Validate requirements coverage when components change
  useEffect(() => {
    if (components.length > 0) {
      validateRequirementsCoverage();
    }
  }, [components]);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Increment the iteration counter
      const newIteration = currentIteration + 1;
      setCurrentIteration(newIteration);
      
      // Call the code generator
      const generatedComponents = await generateCode(
        requirements,
        appName,
        appDescription,
        techStack,
        newIteration,
        components // Pass existing components for iteration
      );
      
      // Update the store with the generated components
      setComponents(generatedComponents);
      
      // Select the first component
      if (generatedComponents.length > 0) {
        setSelectedComponent(generatedComponents[0].id);
      }
    } catch (err) {
      setError('Failed to generate code. Please try again or adjust the requirements.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const validateRequirementsCoverage = () => {
    // Get all requirement IDs that are covered by components
    const coveredRequirementIds = new Set<string>();
    components.forEach(component => {
      component.requirementIds.forEach(id => {
        coveredRequirementIds.add(id);
      });
    });
    
    // Calculate coverage
    const totalRequirements = requirements.length;
    const coveredRequirements = coveredRequirementIds.size;
    const coverage = totalRequirements > 0 ? (coveredRequirements / totalRequirements) * 100 : 0;
    
    // Find missing requirements
    const missingRequirements = requirements
      .filter(req => !coveredRequirementIds.has(req.id))
      .map(req => req.description);
    
    setValidationResults({
      totalRequirements,
      coveredRequirements,
      coverage,
      missingRequirements,
    });
  };

  const handleContinue = () => {
    navigate('/preview');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Generate Code</h1>
      
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Generation Settings</h2>
            
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
                <p className="text-sm font-medium text-gray-700 mb-1">Requirements</p>
                <p className="bg-gray-50 p-2 rounded">{requirements.length} requirements</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Current Iteration</p>
                <p className="bg-gray-50 p-2 rounded">{currentIteration} of 3</p>
              </div>
              
              <button
                onClick={handleGenerateCode}
                disabled={isGenerating || currentIteration >= 3}
                className="btn btn-primary w-full flex justify-center items-center"
              >
                {isGenerating ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" /> Generating...
                  </>
                ) : (
                  <>
                    <FiCode className="mr-2" /> 
                    {currentIteration === 0 ? 'Generate Code' : 'Regenerate Code'}
                  </>
                )}
              </button>
              
              {currentIteration >= 3 && (
                <p className="text-sm text-amber-600">
                  Maximum iterations reached. You can continue to preview or go back to adjust requirements.
                </p>
              )}
              
              <button
                onClick={handleContinue}
                disabled={components.length === 0}
                className="btn btn-secondary w-full"
              >
                Continue to Preview
              </button>
            </div>
          </div>
          
          {components.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Requirements Coverage</span>
                  <span className={`text-sm font-bold ${
                    validationResults.coverage >= 90 ? 'text-green-600' :
                    validationResults.coverage >= 70 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {validationResults.coverage.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      validationResults.coverage >= 90 ? 'bg-green-600' :
                      validationResults.coverage >= 70 ? 'bg-amber-500' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${validationResults.coverage}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>{validationResults.coveredRequirements} of {validationResults.totalRequirements} requirements covered</span>
                </div>
                
                {validationResults.missingRequirements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-amber-700 mb-2">Missing Requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                      {validationResults.missingRequirements.slice(0, 3).map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                      {validationResults.missingRequirements.length > 3 && (
                        <li>...and {validationResults.missingRequirements.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
              <FiAlertTriangle className="mr-2" /> {error}
            </div>
          )}
          
          {components.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16">
              <FiCode className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Code Generated Yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Click the "Generate Code" button to create components based on your requirements.
              </p>
              <button
                onClick={handleGenerateCode}
                disabled={isGenerating}
                className="btn btn-primary"
              >
                {isGenerating ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Generated Components</h2>
                <span className="text-sm text-gray-500">
                  {components.length} components
                </span>
              </div>
              
              <div className="flex mb-4 overflow-x-auto pb-2">
                {components.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => setSelectedComponent(component.id)}
                    className={`px-3 py-2 mr-2 rounded-md text-sm whitespace-nowrap ${
                      selectedComponent === component.id
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {component.name}
                  </button>
                ))}
              </div>
              
              {selectedComponent && (
                <div>
                  <div className="border-t border-gray-200 pt-4">
                    <CodePreview 
                      component={components.find(c => c.id === selectedComponent)!} 
                      requirements={requirements}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage; 