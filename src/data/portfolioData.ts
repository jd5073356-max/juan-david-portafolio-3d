export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  color: string; // Hex color for the 3D element and UI accent
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools';
  level: number; // 1-5
  color: string;
}

export const projectsData: Project[] = [
  {
    id: 'quantum',
    title: 'MAX (AI COO Autónomo)',
    description: 'Ecosistema de IA orquestado de forma autónoma que opera de manera continua sobre arquitectura de microservicios, delegando tareas a modelos especializados (Claude, DeepSeek R1, Kimi, GLM) según la complejidad.',
    tags: ['Node.js', 'Python', 'Docker', 'OpenRouter', 'Microservicios', 'MCP'],
    link: 'https://github.com/jd5073356-max',
    color: '#00ffcc'
  },
  {
    id: 'aetheria',
    title: 'AutoFlow Studios',
    description: 'Agencia de automatización con IA y generación de leads B2B. Diseño y ejecución de pipelines de cold outreach automatizados con n8n (+20k correos con personalización IA), clasificación y scoring de leads.',
    tags: ['n8n', 'Claude API', 'OpenAI API', 'Node.js', 'AWS EC2', 'Google Workspace'],
    link: 'https://github.com/jd5073356-max',
    color: '#ff3366'
  },
  {
    id: 'chronos',
    title: 'Código-Beta / Casa de Software',
    description: 'Software complejo a medida para medianas empresas (20–200 empleados): backends escalables, multi-tenancy, dashboards de administración robustos y estrictas revisiones cruzadas de código antes de producción.',
    tags: ['Next.js 15', 'React', 'FastAPI', 'tRPC', 'Drizzle ORM', 'PostgreSQL'],
    link: 'https://github.com/jd5073356-max',
    color: '#3399ff'
  },
  {
    id: 'hermes',
    title: 'Hermes Agent',
    description: 'Agente de IA autónomo open-source con memoria a largo plazo, uso de herramientas externas e integración directa con plataformas de mensajería como Discord y Telegram.',
    tags: ['TypeScript', 'Node.js', 'LLMs', 'Vector DB', 'Discord API', 'Telegram API'],
    link: 'https://github.com/jd5073356-max',
    color: '#ffaa00'
  }
];

export const skillsData: Skill[] = [
  // Frontend / UI
  { name: 'Next.js 15', category: 'frontend', level: 5, color: '#ffffff' },
  { name: 'React', category: 'frontend', level: 5, color: '#61dafb' },
  { name: 'TypeScript', category: 'frontend', level: 5, color: '#3178c6' },
  { name: 'Tailwind CSS', category: 'frontend', level: 5, color: '#38b2ac' },
  
  // Backend / Infra
  { name: 'FastAPI / Python', category: 'backend', level: 4, color: '#009688' },
  { name: 'Node.js', category: 'backend', level: 5, color: '#83cd29' },
  { name: 'PostgreSQL', category: 'backend', level: 4, color: '#336791' },
  { name: 'tRPC / Drizzle', category: 'backend', level: 4, color: '#ff3366' },
  
  // Automation / AI
  { name: 'n8n Automation', category: 'tools', level: 5, color: '#ff6c37' },
  { name: 'LLM Orchestration', category: 'tools', level: 5, color: '#00ffcc' },
  { name: 'Model Context Protocol (MCP)', category: 'tools', level: 5, color: '#bd34fe' },
  { name: 'Docker & AWS EC2', category: 'tools', level: 4, color: '#2496ed' }
];
