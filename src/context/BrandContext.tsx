import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import type { BrandProject, Message } from '../types';
import { 
  generateBranding, 
  getAIResponse, 
  saveProject, 
  getProjects, 
  deleteProject as deleteProjectService,
  generateId,
  generateContextSummary,
  isAIInitialized
} from '../services/brandingService';

interface BrandContextType {
  projects: BrandProject[];
  currentProject: BrandProject | null;
  isLoading: boolean;
  isGenerating: boolean;
  aiReady: boolean;
  createProject: (name: string, description: string) => Promise<void>;
  selectProject: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  generateBrandingForProject: () => Promise<void>;
  deleteProject: (id: string) => void;
  clearCurrentProject: () => void;
  updateProject: (project: BrandProject) => void;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<BrandProject[]>(() => getProjects());
  const [currentProject, setCurrentProject] = useState<BrandProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReady] = useState(isAIInitialized());
  
  // Track conversation state to avoid repetition
  const conversationPhase = useRef<'values' | 'audience' | 'style' | 'complete'>('values');
  const askedTopics = useRef<Set<string>>(new Set());

  const createProject = useCallback(async (name: string, description: string) => {
    setIsLoading(true);
    try {
      // Reset conversation state
      conversationPhase.current = 'values';
      askedTopics.current = new Set();
      
      const newProject: BrandProject = {
        id: generateId(),
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        messages: [
          {
            id: generateId(),
            role: 'assistant',
            content: `¡Hola! Soy BrandGen AI, tu asistente de branding. Cuéntame más sobre ${name}. ¿Cuál es la misión de tu empresa y qué valores quieres transmitir a tus clientes?`,
            timestamp: new Date(),
          },
        ],
      };
      
      saveProject(newProject);
      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      // Reset conversation state when selecting project
      conversationPhase.current = 'values';
      askedTopics.current = new Set();
      setCurrentProject(project);
    }
  }, [projects]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentProject) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedProject = {
      ...currentProject,
      messages: [...currentProject.messages, userMessage],
      updatedAt: new Date(),
    };

    setCurrentProject(updatedProject);
    saveProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

    setIsLoading(true);
    try {
      // Generate context summary from conversation for smart responses
      const chatMessages = updatedProject.messages.map(m => ({ role: m.role, content: m.content }));
      const response = await getAIResponse(chatMessages);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      const finalProject = {
        ...updatedProject,
        messages: [...updatedProject.messages, assistantMessage],
      };

      setCurrentProject(finalProject);
      saveProject(finalProject);
      setProjects(prev => prev.map(p => p.id === finalProject.id ? finalProject : p));
      
      // Check if we have enough info to suggest generation
      const userMessagesCount = finalProject.messages.filter(m => m.role === 'user').length;
      if (userMessagesCount >= 3) {
        conversationPhase.current = 'complete';
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const generateBrandingForProject = useCallback(async () => {
    if (!currentProject) return;

    setIsGenerating(true);
    try {
      // Generate context summary from chat for better branding
      const chatMessages = currentProject.messages.map(m => ({ role: m.role, content: m.content }));
      const chatContext = generateContextSummary(chatMessages);
      
      console.log('🎯 Generating branding with context:', {
        brandName: currentProject.name,
        description: currentProject.description,
        chatContextLength: chatContext.length,
      });

      const branding = await generateBranding(
        currentProject.name,
        currentProject.description,
        undefined, // industry
        undefined, // targetAudience
        chatContext // Pass chat context
      );

      const updatedProject: BrandProject = {
        ...currentProject,
        status: 'completed',
        branding,
        messages: [
          ...currentProject.messages,
          {
            id: generateId(),
            role: 'assistant',
            content: `¡He generado tu branding completo con 5 propuestas únicas! Cada propuesta incluye un logo profesional, paleta de 6 colores, 2 tipografías y 6 iconos concordantes. Explora las diferentes propuestas y elige la que mejor represente tu marca.`,
            timestamp: new Date(),
          },
        ],
        updatedAt: new Date(),
      };

      setCurrentProject(updatedProject);
      saveProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      
      console.log('✅ Branding generation complete:', {
        proposalsCount: branding.proposals.length,
        hasLogo: !!branding.logo,
        colorsCount: branding.colors.length,
        iconsCount: branding.icons.length,
      });
    } catch (error) {
      console.error('❌ Error generating branding:', error);
      // Add error message
      const errorProject: BrandProject = {
        ...currentProject,
        messages: [
          ...currentProject.messages,
          {
            id: generateId(),
            role: 'assistant',
            content: `Lo siento, hubo un error al generar el branding. Por favor verifica tu API Key en Ajustes y vuelve a intentar.`,
            timestamp: new Date(),
          },
        ],
      };
      setCurrentProject(errorProject);
      saveProject(errorProject);
    } finally {
      setIsGenerating(false);
    }
  }, [currentProject]);

  const deleteProject = useCallback((id: string) => {
    deleteProjectService(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const clearCurrentProject = useCallback(() => {
    conversationPhase.current = 'values';
    askedTopics.current = new Set();
    setCurrentProject(null);
  }, []);

  const updateProject = useCallback((project: BrandProject) => {
    setCurrentProject(project);
    saveProject(project);
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
  }, []);

  return (
    <BrandContext.Provider
      value={{
        projects,
        currentProject,
        isLoading,
        isGenerating,
        aiReady,
        createProject,
        selectProject,
        sendMessage,
        generateBrandingForProject,
        deleteProject,
        clearCurrentProject,
        updateProject,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
