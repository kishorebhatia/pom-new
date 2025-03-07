import { StructuredRequirement, GeneratedComponent } from '../../store/prdStore';

/**
 * Generates React components based on the requirements
 * @param requirements The structured requirements
 * @param appName The name of the application
 * @param appDescription The description of the application
 * @param techStack The technology stack
 * @param iteration The current iteration number
 * @param existingComponents Existing components from previous iterations
 * @returns Array of generated components
 */
export async function generateCode(
  requirements: StructuredRequirement[],
  appName: string,
  appDescription: string,
  techStack: string[],
  iteration: number,
  existingComponents: GeneratedComponent[] = []
): Promise<GeneratedComponent[]> {
  // In a real implementation, this would use an LLM to generate code
  // For this demo, we'll use predefined templates
  
  // Group requirements by category
  const requirementsByCategory: Record<string, StructuredRequirement[]> = {};
  requirements.forEach(req => {
    if (!requirementsByCategory[req.category]) {
      requirementsByCategory[req.category] = [];
    }
    requirementsByCategory[req.category].push(req);
  });
  
  const components: GeneratedComponent[] = [];
  
  // Generate app component
  components.push(generateAppComponent(appName, appDescription, requirements));
  
  // Generate components based on requirement categories
  if (requirementsByCategory.functional) {
    components.push(...generateFunctionalComponents(requirementsByCategory.functional, iteration));
  }
  
  if (requirementsByCategory.ui) {
    components.push(...generateUIComponents(requirementsByCategory.ui, iteration));
  }
  
  if (requirementsByCategory.data) {
    components.push(...generateDataComponents(requirementsByCategory.data, iteration));
  }
  
  // Generate tests for components
  components.forEach(component => {
    component.testCode = generateTestForComponent(component, requirements);
  });
  
  // If this is not the first iteration, improve components based on previous iterations
  if (iteration > 1 && existingComponents.length > 0) {
    return improveComponents(components, existingComponents, iteration);
  }
  
  return components;
}

/**
 * Generates the main App component
 */
function generateAppComponent(
  appName: string,
  appDescription: string,
  requirements: StructuredRequirement[]
): GeneratedComponent {
  const requirementIds = requirements
    .filter(req => req.category === 'functional' || req.category === 'ui')
    .map(req => req.id);
  
  const code = `import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import './App.css';

/**
 * ${appName}
 * ${appDescription}
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Header appName="${appName}" />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;`;

  return {
    id: 'app-component',
    name: 'App.tsx',
    code,
    requirementIds,
  };
}

/**
 * Generates components for functional requirements
 */
function generateFunctionalComponents(
  requirements: StructuredRequirement[],
  iteration: number
): GeneratedComponent[] {
  const components: GeneratedComponent[] = [];
  
  // Generate HomePage component
  const homePageRequirements = requirements.filter(req => 
    req.description.toLowerCase().includes('home') || 
    req.description.toLowerCase().includes('landing') ||
    req.description.toLowerCase().includes('main')
  );
  
  const homePageRequirementIds = homePageRequirements.length > 0 
    ? homePageRequirements.map(req => req.id)
    : [requirements[0].id]; // Use the first requirement if none specifically mention home
  
  const homePageCode = `import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import '../styles/HomePage.css';

/**
 * Home page component
 */
const HomePage = () => {
  const features = [
    {
      title: 'Feature 1',
      description: 'Description of feature 1',
      icon: '🚀',
    },
    {
      title: 'Feature 2',
      description: 'Description of feature 2',
      icon: '⚡',
    },
    {
      title: 'Feature 3',
      description: 'Description of feature 3',
      icon: '🔍',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to Our Application</h1>
        <p>A modern application built with React</p>
        <button className="cta-button">Get Started</button>
      </section>
      
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>
      
      <section className="call-to-action">
        <h2>Ready to start?</h2>
        <p>Join thousands of users today</p>
        <Link to="/signup" className="cta-button">Sign Up Now</Link>
      </section>
    </div>
  );
};

export default HomePage;`;

  components.push({
    id: 'home-page',
    name: 'pages/HomePage.tsx',
    code: homePageCode,
    requirementIds: homePageRequirementIds,
  });
  
  // Generate AboutPage component
  const aboutPageCode = `import React from 'react';
import '../styles/AboutPage.css';

/**
 * About page component
 */
const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-section">
        <h1>About Us</h1>
        <p>
          We are a dedicated team focused on creating high-quality applications
          that solve real-world problems.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide intuitive, efficient, and beautiful software
          that enhances productivity and improves user experience.
        </p>
        
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="avatar">👩‍💻</div>
            <h3>Jane Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <div className="avatar">👨‍💻</div>
            <h3>John Smith</h3>
            <p>CTO</p>
          </div>
          <div className="team-member">
            <div className="avatar">👩‍🎨</div>
            <h3>Emily Johnson</h3>
            <p>Lead Designer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;`;

  components.push({
    id: 'about-page',
    name: 'pages/AboutPage.tsx',
    code: aboutPageCode,
    requirementIds: [],
  });
  
  // Generate Header component
  const headerCode = `import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

interface HeaderProps {
  appName: string;
}

/**
 * Header component with navigation
 */
const Header: React.FC<HeaderProps> = ({ appName }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">{appName}</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="login-button">Log In</button>
        <button className="signup-button">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;`;

  components.push({
    id: 'header-component',
    name: 'components/Header.tsx',
    code: headerCode,
    requirementIds: [],
  });
  
  // Generate Footer component
  const footerCode = `import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

/**
 * Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/docs">Documentation</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;`;

  components.push({
    id: 'footer-component',
    name: 'components/Footer.tsx',
    code: footerCode,
    requirementIds: [],
  });
  
  return components;
}

/**
 * Generates components for UI requirements
 */
function generateUIComponents(
  requirements: StructuredRequirement[],
  iteration: number
): GeneratedComponent[] {
  const components: GeneratedComponent[] = [];
  
  // Generate FeatureCard component
  const featureCardCode = `import React from 'react';
import '../styles/FeatureCard.css';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

/**
 * Feature card component for displaying features
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default FeatureCard;`;

  components.push({
    id: 'feature-card',
    name: 'components/FeatureCard.tsx',
    code: featureCardCode,
    requirementIds: requirements.filter(req => 
      req.description.toLowerCase().includes('card') || 
      req.description.toLowerCase().includes('display')
    ).map(req => req.id),
  });
  
  // Generate Button component
  const buttonCode = `import React from 'react';
import '../styles/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable button component
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      className={\`button \${variant} \${size} \${className}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`;

  components.push({
    id: 'button-component',
    name: 'components/Button.tsx',
    code: buttonCode,
    requirementIds: requirements.filter(req => 
      req.description.toLowerCase().includes('button') || 
      req.description.toLowerCase().includes('click')
    ).map(req => req.id),
  });
  
  // Generate CSS files
  const appCssCode = `/* App.css */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Global styles */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --text-color: #333333;
  --background-color: #ffffff;
  --light-gray: #f5f5f5;
  --dark-gray: #666666;
  --border-radius: 4px;
  --box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.cta-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #2980b9;
  text-decoration: none;
}`;

  components.push({
    id: 'app-css',
    name: 'App.css',
    code: appCssCode,
    requirementIds: requirements.filter(req => 
      req.description.toLowerCase().includes('style') || 
      req.description.toLowerCase().includes('css') ||
      req.description.toLowerCase().includes('design')
    ).map(req => req.id),
  });
  
  return components;
}

/**
 * Generates components for data requirements
 */
function generateDataComponents(
  requirements: StructuredRequirement[],
  iteration: number
): GeneratedComponent[] {
  const components: GeneratedComponent[] = [];
  
  // Generate a data service
  const dataServiceCode = `import { useState, useEffect } from 'react';

/**
 * Interface for a data item
 */
export interface DataItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

/**
 * Hook for fetching and managing data
 */
export function useDataService() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockData: DataItem[] = [
        {
          id: '1',
          title: 'Item 1',
          description: 'Description for item 1',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Item 2',
          description: 'Description for item 2',
          createdAt: new Date(),
        },
        {
          id: '3',
          title: 'Item 3',
          description: 'Description for item 3',
          createdAt: new Date(),
        },
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(mockData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const addItem = async (title: string, description: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      const newItem: DataItem = {
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an item
  const updateItem = async (id: string, updates: Partial<DataItem>) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      
      return true;
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      return true;
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial mount
  useEffect(() => {
    fetchData();
  }, []);

  return {
    items,
    loading,
    error,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
  };
}`;

  components.push({
    id: 'data-service',
    name: 'hooks/useDataService.ts',
    code: dataServiceCode,
    requirementIds: requirements.map(req => req.id),
  });
  
  return components;
}

/**
 * Generates a test for a component
 */
function generateTestForComponent(
  component: GeneratedComponent,
  requirements: StructuredRequirement[]
): string {
  // Extract component name without extension
  const componentName = component.name.split('/').pop()?.split('.')[0] || '';
  
  // Basic test template
  return `import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ${componentName} from './${componentName}';

describe('${componentName} Component', () => {
  test('renders correctly', () => {
    render(
      <BrowserRouter>
        <${componentName} />
      </BrowserRouter>
    );
    
    // Add assertions based on component content
    // This is a basic test that just checks if the component renders
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });
  
  // Add more tests based on component functionality
});`;
}

/**
 * Improves components based on previous iterations
 */
function improveComponents(
  newComponents: GeneratedComponent[],
  existingComponents: GeneratedComponent[],
  iteration: number
): GeneratedComponent[] {
  // In a real implementation, this would analyze the existing components
  // and make improvements based on the iteration number
  
  // For this demo, we'll just add a comment to indicate the iteration
  return newComponents.map(component => {
    // Find matching component from previous iteration
    const existingComponent = existingComponents.find(c => c.id === component.id);
    
    if (existingComponent) {
      // Add a comment to indicate the iteration
      const iterationComment = `\n\n// Iteration ${iteration} improvements:\n// - Improved code structure\n// - Enhanced performance\n// - Fixed bugs from previous iteration\n`;
      
      return {
        ...component,
        code: component.code + iterationComment,
      };
    }
    
    return component;
  });
} 