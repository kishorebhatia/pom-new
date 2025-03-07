import { StructuredRequirement } from '../../store/prdStore';
import { extractTextFromPdf } from '../parser/pdfParser';

interface AnalysisResult {
  appName: string;
  appDescription: string;
  techStack: string[];
  requirements: StructuredRequirement[];
}

/**
 * Analyzes a PRD document and extracts structured requirements
 * @param text The text content of the PRD document
 * @returns Analysis result with app metadata and requirements
 */
export async function analyzePrdDocument(text: string): Promise<AnalysisResult> {
  // In a real implementation, this would use NLP or LLM to analyze the document
  // For this demo, we'll use a simplified approach to extract requirements
  
  // Extract potential app name and description
  const appName = extractAppName(text) || 'My App';
  const appDescription = extractAppDescription(text) || 'A React application generated from PRD requirements';
  
  // Determine appropriate tech stack
  const techStack = determineTechStack(text);
  
  // Extract requirements
  const requirements = extractRequirements(text);
  
  return {
    appName,
    appDescription,
    techStack,
    requirements,
  };
}

/**
 * Extracts the app name from the PRD text
 */
function extractAppName(text: string): string | null {
  // Look for common patterns that might indicate an app name
  const namePatterns = [
    /App(?:lication)? Name:?\s*([^\n]+)/i,
    /Project Name:?\s*([^\n]+)/i,
    /Title:?\s*([^\n]+)/i,
    /Product:?\s*([^\n]+)/i,
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no explicit name is found, try to extract from the first few lines
  const firstLines = text.split('\n').slice(0, 5).join(' ');
  const potentialName = firstLines.match(/^(?:The )?([\w\s]{3,30}?)(?:App|Application|System|Platform)?$/i);
  
  return potentialName ? potentialName[1].trim() : null;
}

/**
 * Extracts the app description from the PRD text
 */
function extractAppDescription(text: string): string | null {
  // Look for common patterns that might indicate an app description
  const descriptionPatterns = [
    /Description:?\s*([^\n]+(?:\n[^\n]+){0,3})/i,
    /Overview:?\s*([^\n]+(?:\n[^\n]+){0,3})/i,
    /Summary:?\s*([^\n]+(?:\n[^\n]+){0,3})/i,
    /Introduction:?\s*([^\n]+(?:\n[^\n]+){0,3})/i,
  ];
  
  for (const pattern of descriptionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\n/g, ' ');
    }
  }
  
  return null;
}

/**
 * Determines the appropriate tech stack based on the PRD content
 */
function determineTechStack(text: string): string[] {
  const techStack = ['React', 'TypeScript', 'Tailwind CSS'];
  
  // Check for specific technologies mentioned in the PRD
  if (text.match(/mobile|ios|android|responsive/i)) {
    techStack.push('React Native');
  }
  
  if (text.match(/api|rest|graphql|backend|server/i)) {
    techStack.push('Node.js');
    techStack.push('Express');
  }
  
  if (text.match(/database|data\s*store|storage|persist/i)) {
    if (text.match(/sql|relational/i)) {
      techStack.push('PostgreSQL');
    } else {
      techStack.push('MongoDB');
    }
  }
  
  if (text.match(/auth|login|user\s*account|permission|role/i)) {
    techStack.push('Auth0');
  }
  
  if (text.match(/test|jest|cypress|selenium/i)) {
    techStack.push('Jest');
    techStack.push('React Testing Library');
  }
  
  return techStack;
}

/**
 * Extracts requirements from the PRD text
 */
function extractRequirements(text: string): StructuredRequirement[] {
  const requirements: StructuredRequirement[] = [];
  
  // Split the text into sections
  const sections = text.split(/\n(?:#{1,3}|\d+\.|\*)\s+/);
  
  // Process each section to identify potential requirements
  sections.forEach((section, index) => {
    if (section.length < 10) return; // Skip very short sections
    
    // Check if the section contains requirement-like content
    if (
      section.match(/shall|should|must|need|require|feature|function|capability/i) ||
      section.match(/user can|user should|system will|application will/i)
    ) {
      // Determine the category based on content
      let category = 'functional';
      if (section.match(/ui|ux|interface|design|layout|color|style|theme|responsive/i)) {
        category = 'ui';
      } else if (section.match(/data|database|storage|persist|save|load|retrieve/i)) {
        category = 'data';
      } else if (section.match(/performance|speed|fast|optimize|efficient|response time/i)) {
        category = 'performance';
      } else if (section.match(/security|auth|login|permission|role|protect|encrypt/i)) {
        category = 'security';
      }
      
      // Determine priority based on language
      let priority: 'high' | 'medium' | 'low' = 'medium';
      if (section.match(/critical|crucial|essential|highest|must|urgent|important/i)) {
        priority = 'high';
      } else if (section.match(/optional|nice to have|if possible|could|may|low/i)) {
        priority = 'low';
      }
      
      // Extract the main description
      let description = section.split(/\n/)[0].trim();
      if (description.length > 100) {
        description = description.substring(0, 97) + '...';
      }
      
      // Create the requirement
      requirements.push({
        id: `req-${index + 1}`,
        category,
        description,
        priority,
        status: 'pending',
      });
    }
  });
  
  // If no requirements were found, create some default ones
  if (requirements.length === 0) {
    requirements.push(
      {
        id: 'req-1',
        category: 'functional',
        description: 'The application should allow users to view content',
        priority: 'high',
        status: 'pending',
      },
      {
        id: 'req-2',
        category: 'ui',
        description: 'The application should have a responsive design',
        priority: 'medium',
        status: 'pending',
      },
      {
        id: 'req-3',
        category: 'data',
        description: 'The application should store user preferences',
        priority: 'low',
        status: 'pending',
      }
    );
  }
  
  return requirements;
} 