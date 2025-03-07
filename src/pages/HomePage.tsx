import { Link } from 'react-router-dom';
import { FiUpload, FiCode, FiEye, FiDownload } from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: <FiUpload className="w-8 h-8 text-primary-500" />,
      title: 'Upload PRD',
      description: 'Upload your Product Requirements Document (PDF or text) or provide a URL.',
      link: '/upload',
    },
    {
      icon: <FiCode className="w-8 h-8 text-primary-500" />,
      title: 'Generate Code',
      description: 'Our AI analyzes your PRD and generates React code that meets your requirements.',
      link: '/generate',
    },
    {
      icon: <FiEye className="w-8 h-8 text-primary-500" />,
      title: 'Preview App',
      description: 'Preview your generated application in a browser-based environment.',
      link: '/preview',
    },
    {
      icon: <FiDownload className="w-8 h-8 text-primary-500" />,
      title: 'Export Code',
      description: 'Download the complete codebase as a zip file with all necessary files.',
      link: '/export',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PRD App Builder
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          An autonomous app builder agent that processes PRD documents and generates functioning React code.
        </p>
        <div className="mt-8">
          <Link to="/upload" className="btn btn-primary text-lg px-6 py-3">
            Get Started
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {features.map((feature, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-4">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link to={feature.link} className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-4">
          <li className="flex">
            <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <div>
              <h3 className="font-semibold">Upload your PRD document</h3>
              <p className="text-gray-600">Upload a PDF or text file containing your product requirements, or provide a URL.</p>
            </div>
          </li>
          <li className="flex">
            <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <div>
              <h3 className="font-semibold">Review extracted requirements</h3>
              <p className="text-gray-600">Our system analyzes your document and extracts structured requirements.</p>
            </div>
          </li>
          <li className="flex">
            <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <div>
              <h3 className="font-semibold">Generate application code</h3>
              <p className="text-gray-600">Based on the requirements, we generate React code that implements your application.</p>
            </div>
          </li>
          <li className="flex">
            <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
            <div>
              <h3 className="font-semibold">Preview and refine</h3>
              <p className="text-gray-600">Preview your application in a browser-based environment and make refinements.</p>
            </div>
          </li>
          <li className="flex">
            <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</span>
            <div>
              <h3 className="font-semibold">Export the complete codebase</h3>
              <p className="text-gray-600">Download the full codebase as a zip file, ready for deployment.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage; 