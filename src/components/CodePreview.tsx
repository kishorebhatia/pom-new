import { useState } from 'react';
import { FiCode, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GeneratedComponent, StructuredRequirement } from '../store/prdStore';

interface CodePreviewProps {
  component: GeneratedComponent;
  requirements: StructuredRequirement[];
}

const CodePreview: React.FC<CodePreviewProps> = ({ component, requirements }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'test' | 'requirements'>('code');
  
  // Get the requirements that this component implements
  const implementedRequirements = requirements.filter(req => 
    component.requirementIds.includes(req.id)
  );
  
  // Determine the language for syntax highlighting
  const getLanguage = () => {
    if (component.name.endsWith('.tsx') || component.name.endsWith('.ts')) {
      return 'typescript';
    } else if (component.name.endsWith('.jsx') || component.name.endsWith('.js')) {
      return 'javascript';
    } else if (component.name.endsWith('.css')) {
      return 'css';
    } else if (component.name.endsWith('.html')) {
      return 'html';
    }
    return 'typescript'; // Default to TypeScript
  };
  
  return (
    <div>
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'code'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiCode className="inline mr-1" /> Code
        </button>
        
        {component.testCode && (
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'test'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiFileText className="inline mr-1" /> Tests
          </button>
        )}
        
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'requirements'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiCheckCircle className="inline mr-1" /> Requirements ({implementedRequirements.length})
        </button>
      </div>
      
      {activeTab === 'code' && (
        <div>
          <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-md flex justify-between items-center">
            <span>{component.name}</span>
          </div>
          <SyntaxHighlighter
            language={getLanguage()}
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            showLineNumbers
          >
            {component.code}
          </SyntaxHighlighter>
        </div>
      )}
      
      {activeTab === 'test' && component.testCode && (
        <div>
          <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-md">
            <span>Test: {component.name.replace(/\.(tsx|ts|jsx|js)$/, '.test.$1')}</span>
          </div>
          <SyntaxHighlighter
            language={getLanguage()}
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            showLineNumbers
          >
            {component.testCode}
          </SyntaxHighlighter>
        </div>
      )}
      
      {activeTab === 'requirements' && (
        <div className="space-y-3">
          {implementedRequirements.length > 0 ? (
            implementedRequirements.map(req => (
              <div key={req.id} className="border rounded-md p-3">
                <div className="flex items-start">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                    req.category === 'functional' ? 'bg-blue-100 text-blue-800' :
                    req.category === 'ui' ? 'bg-purple-100 text-purple-800' :
                    req.category === 'data' ? 'bg-green-100 text-green-800' :
                    req.category === 'performance' ? 'bg-yellow-100 text-yellow-800' :
                    req.category === 'security' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {req.category}
                  </span>
                  <div>
                    <p className="font-medium">{req.description}</p>
                    <div className="flex mt-1 text-xs">
                      <span className={`mr-3 ${
                        req.priority === 'high' ? 'text-red-600' :
                        req.priority === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        Priority: {req.priority}
                      </span>
                      <span className={`${
                        req.status === 'pending' ? 'text-gray-600' :
                        req.status === 'analyzed' ? 'text-blue-600' :
                        req.status === 'implemented' ? 'text-green-600' :
                        'text-purple-600'
                      }`}>
                        Status: {req.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No requirements are explicitly linked to this component.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodePreview; 