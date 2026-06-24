import './style.css';
import { SceneManager } from './scene/SceneManager';
import { projectsData, skillsData } from './data/portfolioData';
import { AudioSystem } from './audio/AudioSystem';

// Instantiate procedural Audio system
const audioSystem = new AudioSystem();

// Inject HTML structure into #app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <!-- Preloader Screen -->
  <div id="preloader">
    <div class="loader-ring"></div>
    <p class="loader-text">Abriendo Brecha Tridimensional...</p>
  </div>

  <div id="scene-container"></div>

  <!-- Ambient and Palette Control Hub -->
  <div class="controls-bar interactive">
    <button class="control-btn active" id="btn-theme-quantum" data-theme="quantum">🌌 Quantum</button>
    <button class="control-btn" id="btn-theme-helios" data-theme="helios">🔥 Helios</button>
    <button class="control-btn" id="btn-theme-abyss" data-theme="abyss">🌊 Abyss</button>
    <div style="width: 1px; height: 16px; background: var(--border-color); margin: 0 4px;"></div>
    <button class="control-btn" id="btn-audio-toggle">🔊 Activar Audio</button>
  </div>
  
  <div id="ui-overlay">
    <!-- Section 1: Hero -->
    <section id="hero">
      <div class="hero-content interactive">
        <div class="badge">Founder @ AutoFlow Studios · Creador de MAX</div>
        <h1>Juan David Herrera Redondo</h1>
        <p class="subtitle" style="font-weight: 600; color: var(--accent-cyan); font-size: 1.25rem; margin-bottom: 0.8rem; font-family: var(--font-display);">Full-Stack Developer & AI Automation Engineer</p>
        <p class="subtitle" style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.8rem; color: var(--text-secondary);">
          Hace dos años veía tutoriales de código sin entender la mitad. Hoy desarrollo software a medida, opero una agencia de automatización con IA y construyo infraestructura de agentes autónomos que ya está corriendo en producción. Mi enfoque no es acumular prototipos: es construir sistemas con lógica de negocio real y llevarlos a funcionar.
        </p>
        
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <a href="#projects" class="cta-button" id="hero-cta-btn" style="margin-bottom: 0.5rem;">
            Explorar Proyectos
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </a>
          
          <div class="social-links" style="margin-top: 0; margin-bottom: 0.5rem;">
            <a href="https://github.com/jd5073356-max" target="_blank" class="social-icon-btn" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/juan-david-herrera-redondo" target="_blank" class="social-icon-btn" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Projects -->
    <section id="projects">
      <div class="section-title-wrapper">
        <h2 class="section-title">Proyectos Destacados</h2>
        <p class="section-desc">Interactúa con los elementos 3D del fondo para explorar los detalles técnicos de cada uno.</p>
      </div>
      
      <!-- Active Floating Project Card details -->
      <div id="project-details" class="projects-detail-panel interactive">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          <h3 id="project-title" style="font-family: var(--font-display); font-size: 1.8rem; margin: 0; color: var(--accent-cyan); transition: color 0.3s ease;">Pasa el cursor sobre un proyecto</h3>
          <span id="project-status" style="display: none; font-family: var(--font-display); font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 0.25rem 0.65rem; border-radius: 100px; border: 1px solid transparent;"></span>
        </div>
        <p id="project-desc" style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; transition: color 0.3s ease;">Selecciona uno de los módulos geométricos tridimensionales en la pantalla para revelar su información, arquitectura y tecnologías utilizadas.</p>
        <div id="project-tags" class="project-tags"></div>
        <a id="project-link" target="_blank" rel="noopener noreferrer" style="display: none; align-self: flex-start; margin-top: 1.1rem; align-items: center; gap: 0.5rem; font-family: var(--font-display); font-weight: 600; font-size: 0.9rem; text-decoration: none; padding: 0.6rem 1.2rem; border-radius: 10px; border: 1px solid transparent; transition: transform 0.3s ease, box-shadow 0.3s ease;"></a>
      </div>
    </section>

    <!-- Section 3: Skills -->
    <section id="skills">
      <div class="skills-container interactive">
        <h2 class="section-title" style="background: linear-gradient(135deg, #ffffff 40%, var(--accent-cyan) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Constelación Técnica</h2>
        <p class="subtitle" style="margin-bottom: 1.2rem; font-size: 0.95rem;">Usa tu cursor sobre las estrellas de la constelación 3D para ver los niveles de competencia en detalle.</p>
        <div class="skills-list" id="skills-list">
          <!-- populated dynamically -->
        </div>
      </div>
    </section>

    <!-- Section 4: Contact -->
    <section id="contact">
      <div class="contact-card interactive">
        <h2 class="section-title" style="background: linear-gradient(135deg, #ffffff 40%, var(--accent-pink) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Contacto Interdimensional</h2>
        <p class="subtitle" style="margin-bottom: 1.5rem; font-size: 0.95rem;">¿Tienes un proyecto en mente? Envíame un mensaje y observa cómo el pozo de gravedad interactúa con tus datos.</p>
        <form class="contact-form" id="contact-form">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input type="text" id="name" required placeholder="Tu nombre" />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" required placeholder="tu@correo.com" />
          </div>
          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea id="message" rows="4" required placeholder="Escribe aquí tu mensaje..."></textarea>
          </div>
          <button type="submit" class="submit-btn">Enviar Mensaje</button>
        </form>
      </div>
    </section>
  </div>

  <!-- Side Navigation Bar -->
  <div class="side-nav interactive">
    <div class="nav-dot active" data-section="0" data-label="Inicio"></div>
    <div class="nav-dot" data-section="1" data-label="Proyectos"></div>
    <div class="nav-dot" data-section="2" data-label="Habilidades"></div>
    <div class="nav-dot" data-section="3" data-label="Contacto"></div>
  </div>
`;

// Initialize Three.js SceneManager
const sceneContainer = document.getElementById('scene-container') as HTMLDivElement;
const sceneManager = new SceneManager(sceneContainer);

// Handle Preloader fade-out once Scene is loaded
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1200); // Allow smooth dramatic entrance
  }
});

// Setup Theme Switcher Controls
const themeButtons = document.querySelectorAll<HTMLButtonElement>('.controls-bar button[data-theme]');
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme') as 'quantum' | 'helios' | 'abyss';
    
    // UI Active state
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Body class switcher
    document.body.classList.remove('theme-helios', 'theme-abyss');
    if (theme !== 'quantum') {
      document.body.classList.add(`theme-${theme}`);
    }

    // 3D Scene Theme switcher
    sceneManager.changeTheme(theme);

    // Audio Feedback
    audioSystem.playChime(theme === 'quantum' ? 440 : theme === 'helios' ? 320 : 600, 0.4);
  });
});

// Setup Audio Switcher Control
const audioToggleBtn = document.getElementById('btn-audio-toggle') as HTMLButtonElement;
if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    const isMuted = audioSystem.toggleMute();
    
    if (isMuted) {
      audioToggleBtn.classList.remove('active');
      audioToggleBtn.innerHTML = '🔊 Activar Audio';
    } else {
      audioToggleBtn.classList.add('active');
      audioToggleBtn.innerHTML = '🔇 Silenciar';
      // Play a cute welcoming note
      audioSystem.playChime(520, 0.8);
    }
  });
}

// Populate Skills Section dynamically
const skillsListContainer = document.getElementById('skills-list')!;
skillsListContainer.innerHTML = skillsData.map(skill => `
  <div class="skill-bar-wrapper" data-skill-name="${skill.name}" style="opacity: 0.85; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
    <div class="skill-header">
      <span style="font-weight: 500;">${skill.name}</span>
      <span style="color: ${skill.color}; font-weight: 600;">${skill.level * 20}%</span>
    </div>
    <div class="skill-bar-bg">
      <div class="skill-bar-fill" data-level="${skill.level * 20}" style="background-color: ${skill.color}; width: 0%;"></div>
    </div>
  </div>
`).join('');

// Track current section and handle active states
const navDots = document.querySelectorAll('.nav-dot');
const skillBars = document.querySelectorAll('.skill-bar-wrapper');

const updateActiveNav = () => {
  const scrollY = window.scrollY;
  const height = window.innerHeight;
  const activeIndex = Math.min(Math.round(scrollY / height), 3);

  navDots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Always animate skill bars once initialized or visible
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const fillBar = bar as HTMLDivElement;
    const level = fillBar.getAttribute('data-level');
    if (level && fillBar.style.width === '0%') {
      fillBar.style.width = `${level}%`;
    }
  });
};

window.addEventListener('scroll', updateActiveNav);
// Initial run to set dots and load bar animations
setTimeout(updateActiveNav, 100);

// Smooth navigation clicks
navDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const sectionIndex = parseInt(dot.getAttribute('data-section') || '0', 10);
    window.scrollTo({
      top: sectionIndex * window.innerHeight,
      behavior: 'smooth'
    });
    // Tiny navigation audio feedback
    audioSystem.playChime(350 + sectionIndex * 100, 0.4);
  });
});

// Smooth scroll for hero CTA button
const ctaBtn = document.getElementById('hero-cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
    audioSystem.playChime(400, 0.5);
  });
}

// 3D Scene Interactions: Projects Hover callback
const projectDetails = document.getElementById('project-details')!;
const projectTitle = document.getElementById('project-title')!;
const projectDesc = document.getElementById('project-desc')!;
const projectTags = document.getElementById('project-tags')!;
const projectStatus = document.getElementById('project-status')!;
const projectLink = document.getElementById('project-link') as HTMLAnchorElement;
let lastHoveredProject: number | null = null;

sceneManager.onProjectHover = (index: number | null) => {
  if (index !== null) {
    if (lastHoveredProject !== index) {
      // Audio cue on project change
      audioSystem.playChime(440 + index * 120, 0.3);
      lastHoveredProject = index;
    }
    const project = projectsData[index];
    projectTitle.textContent = project.title;
    projectTitle.style.color = project.color;
    projectDesc.textContent = project.description;
    projectTags.innerHTML = project.tags.map(tag => `
      <span class="tag" style="border-color: ${project.color}44; color: ${project.color}; box-shadow: 0 0 5px ${project.color}11;">
        ${tag}
      </span>
    `).join('');

    // Status badge (honest project state)
    projectStatus.textContent = project.status;
    projectStatus.style.display = 'inline-block';
    projectStatus.style.color = project.color;
    projectStatus.style.borderColor = `${project.color}66`;
    projectStatus.style.background = `${project.color}14`;

    // Clickable action button (demo / repo) — lets visitors verify it's real
    projectLink.href = project.link;
    projectLink.style.display = 'inline-flex';
    projectLink.style.color = project.color;
    projectLink.style.borderColor = `${project.color}66`;
    projectLink.style.background = `${project.color}11`;
    projectLink.innerHTML = `${project.linkLabel}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>`;

    projectDetails.classList.add('visible');
    projectDetails.style.borderColor = project.color;
    projectDetails.style.boxShadow = `0 15px 40px ${project.color}15`;
  } else {
    lastHoveredProject = null;
  }
};

// 3D Scene Interactions: Skills Hover callback
let lastHoveredSkill: string | null = null;
sceneManager.onSkillHover = (name: string | null) => {
  if (name !== null && lastHoveredSkill !== name) {
    // Light sci-fi frequency sound
    audioSystem.playChime(800, 0.2);
    lastHoveredSkill = name;
  } else if (name === null) {
    lastHoveredSkill = null;
  }

  skillBars.forEach(bar => {
    const wrapper = bar as HTMLDivElement;
    const skillName = wrapper.getAttribute('data-skill-name');
    
    if (name === null) {
      // Restore normal state
      wrapper.style.opacity = '0.85';
      wrapper.style.transform = 'scale(1)';
      const fill = wrapper.querySelector('.skill-bar-fill') as HTMLDivElement;
      if (fill) {
        fill.style.boxShadow = 'none';
      }
    } else if (skillName === name) {
      // Highlight hovered skill
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'scale(1.05) translateX(8px)';
      const fill = wrapper.querySelector('.skill-bar-fill') as HTMLDivElement;
      if (fill) {
        fill.style.boxShadow = `0 0 12px ${fill.style.backgroundColor}`;
      }
    } else {
      // Dim other skills
      wrapper.style.opacity = '0.25';
      wrapper.style.transform = 'scale(0.97)';
      const fill = wrapper.querySelector('.skill-bar-fill') as HTMLDivElement;
      if (fill) {
        fill.style.boxShadow = 'none';
      }
    }
  });
};

// Form Interactive feedback and submission
function setupContactForm() {
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  if (!contactForm) return;

  const inputs = contactForm.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      sceneManager.triggerContactAbsorb(true);
      // Gravity collapse tension audio cue
      audioSystem.playGravityBend(true);
    });
    input.addEventListener('blur', () => {
      sceneManager.triggerContactAbsorb(false);
      // Release tension audio cue
      audioSystem.playGravityBend(false);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const card = document.querySelector('.contact-card') as HTMLDivElement;
    if (card) {
      const originalContent = card.innerHTML;
      
      // Trigger intense gravitational collapse
      sceneManager.triggerContactAbsorb(true);
      // Play wormhole warp sound effect
      audioSystem.playWormhole();
      
      card.style.transform = 'scale(0.95)';
      card.style.opacity = '0.5';
      card.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
      
      setTimeout(() => {
        sceneManager.triggerContactAbsorb(false);
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
        card.innerHTML = `
          <div style="text-align: center; padding: 2rem 0; animation: fadeIn 0.8s ease forwards;">
            <div style="font-size: 4rem; margin-bottom: 1.5rem; animation: pulse 2s infinite;">✉️🚀</div>
            <h2 class="section-title" style="background: linear-gradient(135deg, #00ffcc 0%, #3399ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">¡Mensaje Transmitido!</h2>
            <p class="subtitle" style="margin-top: 1rem; font-size: 0.95rem;">Tu transmisión ha cruzado el horizonte de sucesos con éxito. Responderé tan pronto como mi transceptor reciba tu señal.</p>
            <button id="reset-form-btn" class="cta-button" style="margin-top: 1rem; padding: 0.7rem 1.5rem; font-size: 0.9rem;">Enviar otra señal</button>
          </div>
        `;
        
        const resetBtn = document.getElementById('reset-form-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            card.innerHTML = originalContent;
            // Re-attach event listeners
            setupContactForm();
          });
        }
      }, 1200);
    }
  });
}

setupContactForm();
