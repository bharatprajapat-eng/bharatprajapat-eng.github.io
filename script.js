// Engineering Hub Scripts for Bharat Prajapat

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('bp_theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlEl.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('bp_theme', newTheme);
    });
  }

  // 3. Mobile Navigation Menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 4. Active Nav Item Highlighting based on current page
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navItems = document.querySelectorAll('.nav-link');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const cleanHref = href.replace(/\/$/, '').replace(/\.html$/, '');

    if (
      (currentPath === '/' && (cleanHref === '/' || cleanHref === 'index' || cleanHref === '')) ||
      (currentPath !== '/' && cleanHref !== '/' && currentPath.endsWith(cleanHref))
    ) {
      item.classList.add('active');
    }
  });

  // 5. Interactive Terminal Simulator
  const termForm = document.getElementById('termForm');
  const termInput = document.getElementById('termInput');
  const termOutput = document.getElementById('termOutput');
  const termClear = document.getElementById('termClear');
  const pillBtns = document.querySelectorAll('.pill-btn');

  const commandResponses = {
    help: `Available commands:
  • <span class="cmd-highlight">skills</span>       - List core technical competencies across cloud & platforms
  • <span class="cmd-highlight">journey</span>      - View career milestone timeline
  • <span class="cmd-highlight">cases</span>        - Deep-dive architectural case studies
  • <span class="cmd-highlight">projects</span>     - Open-source repositories and agent workflows
  • <span class="cmd-highlight">contact</span>      - Direct contact details & social profiles
  • <span class="cmd-highlight">principles</span>   - Engineering philosophy and architecture tenets
  • <span class="cmd-highlight">clear</span>        - Clear console output`,

    skills: `Technical Arsenal:
  • <strong>Cloud & Hybrid:</strong> Azure, Google Cloud (GCP), AWS, Cloudflare (Workers/KV/Tunnels), VMware vSphere
  • <strong>Kubernetes & Containers:</strong> AKS, GKE, EKS, Docker, KEDA, PDBs, Helm, Argo CD GitOps
  • <strong>IaC & Platforms:</strong> Reusable Terraform Modules, Foundation Repos, ARM Templates, Bash, Python
  • <strong>CI/CD & Security:</strong> GitHub Actions, Azure DevOps, Universal CI (500+ Svcs), Workload Identity Federation
  • <strong>AI & Agents:</strong> AI Coding Agents, Augment Cosmos, Zendesk/Slack PR Loops, CrewAI, Azure OpenAI
  • <strong>Observability:</strong> Datadog, OpenTelemetry Operator, Jaeger Distributed Tracing, Elasticsearch/Kibana`,

    journey: `Career Milestones:
  • <strong>Nov 2024–Present:</strong> Pearl Technology — Enterprise Platform Modernization (Azure & GCP, 500+ Services CI/CD, GKE, AlloyDB)
  • <strong>July 2023–Oct 2024:</strong> PSK Technology — Healthcare Validation Platform (AKS, Python Microservices, GitHub Actions, ELK)
  • <strong>Jan 2022–June 2023:</strong> The Global Logica — Multi-Vendor E-Commerce (Monolith to Kubernetes Microservices, Elasticsearch)
  • <strong>March 2019–Dec 2021:</strong> Mandatly — Compliance SaaS (Azure DevOps, AKS, Edge Ingestion with Cloudflare Workers/KV)
  • <strong>Concurrent:</strong> Freelance Architect (TeraCar Distributed Tracing, AI App on AKS/Azure OpenAI, AWS ECS/EKS)
  • <strong>2014–2019:</strong> Early Career & Education (Full-Stack Dev, Ionic/Angular, Diploma in Computer Engineering)`,

    cases: `Selected Architecture Case Studies:
  1. <strong>Universal CI/CD & AI-Assisted DevOps Support:</strong> Standardized 500+ microservices; AI agent prepares PRs with human Slack sign-off.
  2. <strong>Azure-to-GCP Enterprise Modernization:</strong> AKS to GKE, Workload Identity Federation (no static JSON keys), AlloyDB continuous replication via DMS.
  3. <strong>Edge-Assisted Consent Ingestion:</strong> Cloudflare Workers & KV buffer millions of consent events, offloading backend database I/O.
  4. <strong>Commerce Monolith Decomposition:</strong> Separated catalog browsing from transactional orders/checkout into Kubernetes with HPA.
  5. <strong>500+ NGINX Ingress to Gateway API:</strong> AI-assisted classification and candidate HTTPRoute generation with semantic linting.
  6. <strong>Distributed Tracing for TeraCar:</strong> OpenTelemetry & Jaeger isolated an unindexed query in a downstream dependency.`,

    projects: `Featured Projects & Public Source:
  • <strong>bharatprajapat-eng.github.io</strong>: Public portfolio & architecture showcase source on GitHub.
  • <strong>Architecture Case Studies</strong>: Type <span class="cmd-highlight">cases</span> or visit /case-studies to explore 6 in-depth multi-cloud systems.`,

    contact: `Contact Information:
  • <strong>Email:</strong> bharat.p2311@gmail.com
  • <strong>GitHub:</strong> https://github.com/bharatprajapat-eng
  • <strong>Website:</strong> https://bharatprajapat-eng.github.io
  • <strong>Location:</strong> Surat, Gujarat, India (Open to Remote / Global Consulting)`,

    principles: `Engineering Tenets:
  1. Start with the real problem before choosing a technology.
  2. Scale the application architecture, not just the machines.
  3. Cost and reliability must be first-class citizens in design.
  4. Standardize primitives before attempting automation.
  5. Prove an idea with a working POC before scaling it.
  6. Make AI accountable to engineering controls and human review.
  7. Respect operational ownership across cross-functional teams.`,

    sudo: `Permission denied: You already have full platform access! 😉`,
    whoami: `visitor@guest (Welcome to Bharat Prajapat's Architecture Hub)`
  };

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line';
    cmdLine.innerHTML = `<span class="term-prompt">visitor@guest:~$</span> <span class="term-typed">${escapeHtml(cmd)}</span>`;
    termOutput.appendChild(cmdLine);

    const outputLine = document.createElement('div');
    outputLine.className = 'term-output';

    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      return;
    } else if (commandResponses[cmd]) {
      outputLine.innerHTML = commandResponses[cmd];
    } else {
      outputLine.innerHTML = `command not found: <code>${escapeHtml(cmd)}</code>. Type <span class="cmd-highlight">help</span> to list available commands.`;
    }

    termOutput.appendChild(outputLine);
    termOutput.scrollTop = termOutput.scrollHeight;
  };

  if (termForm && termInput) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      termInput.value = '';
      handleCommand(val);
    });
  }

  if (termClear) {
    termClear.addEventListener('click', () => {
      termOutput.innerHTML = '';
    });
  }

  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
