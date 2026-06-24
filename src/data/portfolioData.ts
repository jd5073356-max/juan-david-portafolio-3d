export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  linkLabel: string; // texto del botón de acción (p.ej. "Ver demo", "Ver código")
  status: string;    // estado honesto del proyecto (p.ej. "En producción")
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
    link: 'https://github.com/jd5073356-max/max-system-public',
    linkLabel: 'Ver código',
    status: 'Infra en producción',
    color: '#00ffcc'
  },
  {
    id: 'aetheria',
    title: 'AutoFlow Studios',
    description: 'Agencia de automatización con IA y generación de leads B2B. Diseño y ejecución de pipelines de cold outreach automatizados con n8n (+20k correos con personalización IA), clasificación y scoring de leads.',
    tags: ['n8n', 'Claude API', 'OpenAI API', 'Node.js', 'AWS EC2', 'Google Workspace'],
    link: 'https://github.com/jd5073356-max',
    linkLabel: 'Ver GitHub',
    status: 'En operación',
    color: '#ff3366'
  },
  {
    id: 'chronos',
    title: 'Código-Beta / Casa de Software',
    description: 'Software complejo a medida para medianas empresas (20–200 empleados): backends escalables, multi-tenancy, dashboards de administración robustos y estrictas revisiones cruzadas de código antes de producción.',
    tags: ['Next.js 15', 'React', 'FastAPI', 'tRPC', 'Drizzle ORM', 'PostgreSQL'],
    link: 'https://github.com/jd5073356-max',
    linkLabel: 'Ver GitHub',
    status: 'En operación',
    color: '#3399ff'
  },
  {
    id: 'athena',
    title: 'Athena (Gestión Escolar)',
    description: 'Sistema web de gestión escolar en producción para una institución educativa: panel del rector con múltiples módulos administrativos, gestión documental y de usuarios. Desplegado y operando en Google Cloud Run.',
    tags: ['Django', 'Python', 'Oracle DB', 'Google Cloud Run', 'OCI', 'HTML/CSS'],
    link: 'https://github.com/jd5073356-max/athena-ceis',
    linkLabel: 'Ver código',
    status: 'En producción',
    color: '#ffd166'
  },
  {
    id: 'aula',
    title: 'Aula Inclusiva',
    description: 'Plataforma web de educación inclusiva: los docentes arman actividades a partir de plantillas editables (estilo Canva), con ajustes de presentación por tipo de discapacidad (cognitiva, motriz, TEA) y seguimiento del progreso de cada estudiante.',
    tags: ['Next.js', 'React', 'Accesibilidad', 'PostgreSQL', 'Roles', 'Plantillas'],
    link: 'https://github.com/jd5073356-max',
    linkLabel: 'Ver GitHub',
    status: 'En diseño',
    color: '#06d6a0'
  },
  {
    id: 'nexguard',
    title: 'NexGuard',
    description: 'Plataforma SaaS de monitoreo de activos y ciberseguridad: escaneo de seguridad, gestión de hallazgos y dashboard de alertas en tiempo real, con validación estricta de ownership antes de cada escaneo.',
    tags: ['Next.js 15', 'tRPC', 'Drizzle ORM', 'Supabase', 'Recharts', 'Docker'],
    link: 'https://github.com/jd5073356-max/nexguard',
    linkLabel: 'Ver repositorio',
    status: 'En desarrollo',
    color: '#fb5607'
  },
  {
    id: 'neural',
    title: 'Neural-Sync',
    description: 'SaaS de analítica predictiva: subes un Excel/CSV y obtienes pronósticos de ventas, predicción de churn y detección de anomalías en dashboards interactivos, con consultas en lenguaje natural.',
    tags: ['Next.js 15', 'FastAPI', 'Celery', 'scikit-learn', 'Prophet', 'Supabase'],
    link: 'https://github.com/jd5073356-max/neural-sync',
    linkLabel: 'Ver repositorio',
    status: 'En desarrollo',
    color: '#8338ec'
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
