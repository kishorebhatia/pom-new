import { create } from 'zustand';

export type PrdDocumentType = 'file' | 'url';

export interface PrdDocument {
  type: PrdDocumentType;
  name: string;
  url?: string;
  content: File | null;
  text: string;
}

export interface StructuredRequirement {
  id: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'analyzed' | 'implemented' | 'tested';
}

export interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  requirementIds: string[];
  testCode?: string;
}

export interface PrdStore {
  // Document state
  prdDocument: PrdDocument | null;
  setPrdDocument: (document: PrdDocument | null) => void;
  
  // Extracted requirements
  requirements: StructuredRequirement[];
  setRequirements: (requirements: StructuredRequirement[]) => void;
  updateRequirement: (id: string, updates: Partial<StructuredRequirement>) => void;
  
  // Generated components
  components: GeneratedComponent[];
  setComponents: (components: GeneratedComponent[]) => void;
  updateComponent: (id: string, updates: Partial<GeneratedComponent>) => void;
  
  // App metadata
  appName: string;
  appDescription: string;
  techStack: string[];
  setAppMetadata: (name: string, description: string, techStack: string[]) => void;
  
  // Generation iterations
  currentIteration: number;
  setCurrentIteration: (iteration: number) => void;
  
  // Reset store
  reset: () => void;
}

export const usePrdStore = create<PrdStore>((set) => ({
  // Document state
  prdDocument: null,
  setPrdDocument: (document) => set({ prdDocument: document }),
  
  // Extracted requirements
  requirements: [],
  setRequirements: (requirements) => set({ requirements }),
  updateRequirement: (id, updates) => set((state) => ({
    requirements: state.requirements.map((req) => 
      req.id === id ? { ...req, ...updates } : req
    ),
  })),
  
  // Generated components
  components: [],
  setComponents: (components) => set({ components }),
  updateComponent: (id, updates) => set((state) => ({
    components: state.components.map((comp) => 
      comp.id === id ? { ...comp, ...updates } : comp
    ),
  })),
  
  // App metadata
  appName: '',
  appDescription: '',
  techStack: [],
  setAppMetadata: (appName, appDescription, techStack) => 
    set({ appName, appDescription, techStack }),
  
  // Generation iterations
  currentIteration: 0,
  setCurrentIteration: (currentIteration) => set({ currentIteration }),
  
  // Reset store
  reset: () => set({
    prdDocument: null,
    requirements: [],
    components: [],
    appName: '',
    appDescription: '',
    techStack: [],
    currentIteration: 0,
  }),
})); 