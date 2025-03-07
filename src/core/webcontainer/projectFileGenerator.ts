import { FileSystemTree } from '@webcontainer/api';
import { GeneratedComponent } from '../../store/prdStore';

/**
 * Generates a file system tree for the WebContainer
 * @param components The generated components
 * @param appName The name of the application
 * @param appDescription The description of the application
 * @param techStack The technology stack
 * @returns The file system tree
 */
export function generateProjectFiles(
  components: GeneratedComponent[],
  appName: string,
  appDescription: string,
  techStack: string[]
): FileSystemTree {
  const files: FileSystemTree = {
    'package.json': {
      file: {
        contents: generatePackageJson(appName, appDescription),
      },
    },
    'README.md': {
      file: {
        contents: generateReadme(appName, appDescription, techStack),
      },
    },
    'index.html': {
      file: {
        contents: generateIndexHtml(appName),
      },
    },
    'vite.config.js': {
      file: {
        contents: generateViteConfig(),
      },
    },
    'tsconfig.json': {
      file: {
        contents: generateTsConfig(),
      },
    },
    'src': {
      directory: {
        'main.tsx': {
          file: {
            contents: generateMainTsx(),
          },
        },
      },
    },
    'public': {
      directory: {
        'favicon.ico': {
          file: {
            contents: '', // Binary content would go here in a real implementation
          },
        },
      },
    },
  };

  // Add component files to the tree
  components.forEach(component => {
    const path = component.name;
    const directories = path.split('/');
    const fileName = directories.pop() || '';
    
    // Create directory structure
    let currentDir: any = files;
    directories.forEach(dir => {
      if (dir === 'src') return; // Skip src as it's already created
      
      if (!currentDir['src']) {
        currentDir['src'] = { directory: {} };
      }
      
      currentDir = currentDir['src'].directory;
      
      if (!currentDir[dir]) {
        currentDir[dir] = { directory: {} };
      }
      
      currentDir = currentDir[dir].directory;
    });
    
    // Add the file
    currentDir[fileName] = {
      file: {
        contents: component.code,
      },
    };
    
    // Add test file if it exists
    if (component.testCode) {
      const testFileName = fileName.replace(/\.(tsx|ts|jsx|js)$/, '.test.$1');
      currentDir[testFileName] = {
        file: {
          contents: component.testCode,
        },
      };
    }
  });

  return files;
}

/**
 * Generates package.json content
 */
function generatePackageJson(appName: string, appDescription: string): string {
  return JSON.stringify(
    {
      name: appName.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.1.0',
      type: 'module',
      description: appDescription,
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        test: 'vitest run',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.20.0',
      },
      devDependencies: {
        '@types/react': '^18.2.39',
        '@types/react-dom': '^18.2.17',
        '@vitejs/plugin-react': '^4.2.0',
        typescript: '^5.3.2',
        vite: '^5.0.2',
        vitest: '^0.34.6',
      },
    },
    null,
    2
  );
}

/**
 * Generates README.md content
 */
function generateReadme(
  appName: string,
  appDescription: string,
  techStack: string[]
): string {
  return `# ${appName}

${appDescription}

## Technology Stack

${techStack.map(tech => `- ${tech}`).join('\n')}

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
\`\`\`

## Project Structure

\`\`\`
src/
├── components/        # React components
├── pages/             # Application pages
├── styles/            # CSS styles
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
\`\`\`

## Available Scripts

- \`npm run dev\`: Start the development server
- \`npm run build\`: Build the application for production
- \`npm run preview\`: Preview the production build
- \`npm run test\`: Run tests
`;
}

/**
 * Generates index.html content
 */
function generateIndexHtml(appName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Generates vite.config.js content
 */
function generateViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
`;
}

/**
 * Generates tsconfig.json content
 */
function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    },
    null,
    2
  );
}

/**
 * Generates main.tsx content
 */
function generateMainTsx(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
} 