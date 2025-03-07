# PRD App Builder

An autonomous app builder agent that processes PRD (Product Requirements Document) documents and generates functioning React code.

## Features

### 1. PDF/Text Handling
- Accept PRD documents from URLs or local file paths
- Parse PDFs using pdf-parse and extract structured content
- Process text files directly
- Convert unstructured PRD content into a structured format

### 2. Code Generation & Iteration
- Analyze the PRD requirements to determine the appropriate tech stack
- Generate React-based code that meets the specified requirements
- Implement a feedback loop to compare generated code against PRD requirements
- Support multiple iterations with self-correction capabilities
- Use TypeScript for type safety

### 3. Testing & Validation
- Implement basic unit tests for the generated components
- Include a validation system that checks for PRD requirement coverage
- Generate test cases based on the user flow in the PRD
- Provide error reports and suggested fixes

### 4. WebContainer Deployment
- Use WebContainers API to create a browser-based preview environment
- Implement a local server setup for running the generated application
- Add real-time code editing capabilities within the preview
- Include a debug console to monitor application behavior

### 5. Export & Download
- Package all generated code into a downloadable zip file
- Include proper project structure with package.json, README, etc.
- Add documentation explaining the implementation details
- Provide a direct download link for the complete codebase

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kishorebhatia/pom-new.git
cd prd-app-builder

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## Usage

1. Upload a PRD document (PDF or text) or provide a URL
2. The system will analyze the document and extract requirements
3. Review the extracted requirements and make any necessary adjustments
4. Generate the application code based on the requirements
5. Preview the application in the built-in WebContainer environment
6. Make iterations and refinements as needed
7. Download the complete codebase when satisfied

## Project Structure

```
prd-app-builder/
├── src/
│   ├── components/        # React components
│   ├── core/              # Core functionality
│   │   ├── parser/        # PRD document parsing
│   │   ├── analyzer/      # Requirements analysis
│   │   ├── generator/     # Code generation
│   │   ├── validator/     # Validation and testing
│   │   └── webcontainer/  # WebContainer integration
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Application pages
│   ├── store/             # State management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── public/                # Static assets
├── tests/                 # Test files
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore file
├── index.html             # HTML entry point
├── package.json           # Project dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## License

MIT 
