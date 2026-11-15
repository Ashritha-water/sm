export type VisualKind =
  | "web"
  | "application"
  | "mobile"
  | "ai"
  | "rag"
  | "product"
  | "whatsapp"
  | "automation"
  | "integration"
  | "enterprise";

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  visual: VisualKind;
  accent: string;
  technologies: string[];
  capabilities: { title: string; text: string }[];
  outcomes: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    index: "01",
    title: "Website Design & Development",
    short: "Fast, accessible websites and web platforms built to convert.",
    summary:
      "We design and engineer websites and web platforms that load fast, rank well and are easy to run. Every build starts from your business goals and ends with a site your team can update with confidence.",
    visual: "web",
    accent: "#3B82F6",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    capabilities: [
      { title: "Corporate and product websites", text: "Editorial, brand-led sites with clear structure, strong performance and search-ready markup." },
      { title: "Web portals", text: "Customer, dealer and vendor portals with secure sign-in, role-based access and dashboards." },
      { title: "Content management", text: "Content models and admin tools so your team can publish without a developer." },
      { title: "Performance and SEO", text: "Core Web Vitals tuning, structured data, sitemaps and accessibility checks built in." },
    ],
    outcomes: ["Pages that load quickly on mobile networks", "Search-friendly structure and metadata", "A design system that scales with new pages"],
  },
  {
    slug: "enterprise-applications",
    index: "02",
    title: "Enterprise Application Development",
    short: "Business-critical applications with clean, modular architecture.",
    summary:
      "We build the internal and customer-facing applications that run your operations: secure, modular and designed to grow with new teams, regions and workflows.",
    visual: "application",
    accent: "#6366F1",
    technologies: ["Angular", "React", "TypeScript", "NestJS", "PostgreSQL", "Redis", "Docker"],
    capabilities: [
      { title: "Modular architecture", text: "Domain-driven modules with clear boundaries, so features ship without breaking each other." },
      { title: "Roles and permissions", text: "Fine-grained access control, audit trails and approval flows for regulated work." },
      { title: "Reporting and dashboards", text: "Operational views and exports that give managers the numbers they need." },
      { title: "Modernisation", text: "Step-by-step migration of legacy systems to maintainable, well-tested code." },
    ],
    outcomes: ["One source of truth for operations", "Faster delivery of new features", "Secure, auditable workflows"],
  },
  {
    slug: "mobile-apps",
    index: "03",
    title: "Mobile Application Development",
    short: "Mobile apps for iOS and Android, connected to your systems.",
    summary:
      "We design and build mobile applications for customers, field teams and partners, backed by reliable APIs, offline-friendly data handling and secure authentication.",
    visual: "mobile",
    accent: "#22D3EE",
    technologies: ["TypeScript", "Node.js", "REST APIs", "GraphQL", "PostgreSQL", "AWS"],
    capabilities: [
      { title: "Customer apps", text: "Ordering, booking, account and loyalty experiences with a polished interface." },
      { title: "Field and workforce apps", text: "Task, inspection and sales apps that keep working with patchy connectivity." },
      { title: "Mobile backends", text: "APIs, notifications and sync services designed for mobile clients." },
      { title: "Release management", text: "Store submissions, staged rollouts and crash monitoring after launch." },
    ],
    outcomes: ["Apps your users keep opening", "Reliable sync with your back office", "A clear path from first release to scale"],
  },
  {
    slug: "artificial-intelligence",
    index: "04",
    title: "Artificial Intelligence Solutions",
    short: "Practical AI that solves specific business problems.",
    summary:
      "We identify where AI creates measurable value in your business, then build it into your products and processes, from classification and extraction to intelligent assistants and agents.",
    visual: "ai",
    accent: "#8B5CF6",
    technologies: ["LLMs", "AI Agents", "Vector Databases", "Node.js", "PostgreSQL", "AWS"],
    capabilities: [
      { title: "Use-case discovery", text: "We map your workflows and pick the AI opportunities with clear returns." },
      { title: "Document intelligence", text: "Extraction, classification and summarisation of invoices, forms and reports." },
      { title: "AI assistants and agents", text: "Assistants that answer questions and agents that complete multi-step tasks with tools." },
      { title: "Evaluation and guardrails", text: "Test sets, quality metrics and safety checks before anything reaches users." },
    ],
    outcomes: ["AI tied to real business metrics", "Human review where it matters", "Systems that are measured, not guessed"],
  },
  {
    slug: "generative-ai-rag",
    index: "05",
    title: "Generative AI & RAG Systems",
    short: "Answers grounded in your own documents and data.",
    summary:
      "Retrieval Augmented Generation connects large language models to your knowledge, so answers come from your policies, manuals and records, with sources your team can check.",
    visual: "rag",
    accent: "#A78BFA",
    technologies: ["LLMs", "RAG", "Vector Databases", "PostgreSQL", "Redis", "Node.js"],
    capabilities: [
      { title: "Knowledge ingestion", text: "Pipelines that clean, chunk and embed documents from drives, wikis and databases." },
      { title: "Retrieval design", text: "Hybrid search, re-ranking and metadata filters tuned for accuracy." },
      { title: "Cited answers", text: "Responses that show the source passages, so users can verify them." },
      { title: "Access control", text: "Retrieval that respects who is allowed to see which documents." },
    ],
    outcomes: ["Fewer repeated questions to experts", "Answers with traceable sources", "Knowledge that stays current as documents change"],
  },
  {
    slug: "saas-product-development",
    index: "06",
    title: "Custom Software & SaaS Products",
    short: "From first prototype to a multi-tenant SaaS product.",
    summary:
      "We partner with founders and product teams to shape, build and scale software products, moving from validated prototype to a secure, multi-tenant platform.",
    visual: "product",
    accent: "#60A5FA",
    technologies: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL", "Redis", "AWS", "CI/CD"],
    capabilities: [
      { title: "Product discovery", text: "User research, scope definition and clickable prototypes before heavy investment." },
      { title: "MVP engineering", text: "A focused first release built on foundations that will not need a rewrite." },
      { title: "Multi-tenancy and billing", text: "Tenant isolation, subscriptions, usage metering and admin consoles." },
      { title: "Scale and reliability", text: "Monitoring, automated testing and infrastructure that grows with demand." },
    ],
    outcomes: ["A product in users' hands sooner", "Architecture ready for growth", "Clear ownership of your code and IP"],
  },
  {
    slug: "whatsapp-business-api",
    index: "07",
    title: "WhatsApp Business API Solutions",
    short: "Customer messaging, automation and campaigns on WhatsApp.",
    summary:
      "As a Meta Tech Provider, we help businesses get onto the WhatsApp Business Platform and build messaging that customers welcome: notifications, support, automated journeys and campaigns, connected to your CRM.",
    visual: "whatsapp",
    accent: "#2DD4BF",
    technologies: ["WhatsApp Business Platform", "Node.js", "REST APIs", "PostgreSQL", "Redis", "Kafka"],
    capabilities: [
      { title: "Onboarding assistance", text: "Help with business verification, phone number setup and account configuration." },
      { title: "Templates and campaigns", text: "Template creation, approval workflows and opt-in based campaign management." },
      { title: "Automation and chatbots", text: "Guided flows and AI-assisted replies for orders, bookings and support." },
      { title: "Team inbox and CRM", text: "A shared inbox for agents, with conversations synced to your CRM." },
    ],
    outcomes: ["Faster responses to customers", "Automated, opt-in customer journeys", "Messaging data in one place"],
  },
  {
    slug: "business-automation",
    index: "08",
    title: "Business Automation & Workflow Engineering",
    short: "Repetitive work turned into reliable, monitored workflows.",
    summary:
      "We map how work actually flows through your teams, then automate the repetitive steps: approvals, data entry, notifications and hand-offs, with monitoring so nothing fails silently.",
    visual: "automation",
    accent: "#38BDF8",
    technologies: ["Node.js", "NestJS", "Kafka", "Redis", "PostgreSQL", "Docker"],
    capabilities: [
      { title: "Process mapping", text: "We document current workflows and find the steps worth automating first." },
      { title: "Workflow engines", text: "Event-driven flows with retries, approvals and clear audit history." },
      { title: "Intelligent steps", text: "AI for reading documents, routing requests and drafting responses." },
      { title: "Monitoring", text: "Dashboards and alerts that show what ran, what failed and why." },
    ],
    outcomes: ["Hours of manual work removed each week", "Fewer errors from re-keying data", "Processes you can see and measure"],
  },
  {
    slug: "api-integrations",
    index: "09",
    title: "API Development & System Integrations",
    short: "Clean APIs that connect the systems you already use.",
    summary:
      "We design and build APIs and integrations that let your applications, partners and third-party platforms exchange data reliably, securely and in real time.",
    visual: "integration",
    accent: "#818CF8",
    technologies: ["REST APIs", "GraphQL", "gRPC", "Kafka", "Node.js", "Express", "Redis"],
    capabilities: [
      { title: "API design", text: "Versioned, documented APIs with consistent conventions and authentication." },
      { title: "Third-party integrations", text: "Payment, logistics, accounting, CRM and messaging platforms connected cleanly." },
      { title: "Event streaming", text: "Real-time data flows between services with Kafka and message queues." },
      { title: "Gateways and security", text: "Rate limiting, key management and observability for every endpoint." },
    ],
    outcomes: ["Systems that share data without manual exports", "Partners onboarded faster", "Integrations that are monitored and documented"],
  },
  {
    slug: "cloud-enterprise",
    index: "10",
    title: "Cloud & Enterprise Technology Solutions",
    short: "ERP, CRM and cloud infrastructure that works as one.",
    summary:
      "We connect ERP, CRM and operational systems on dependable cloud infrastructure, with automated deployments, backups and security practices suited to enterprise workloads.",
    visual: "enterprise",
    accent: "#3B82F6",
    technologies: ["AWS", "Docker", "Linux", "CI/CD", "PostgreSQL", "Kafka", "REST APIs"],
    capabilities: [
      { title: "ERP and CRM solutions", text: "Implementation, customisation and integration of business systems around your processes." },
      { title: "Cloud architecture", text: "Secure, cost-aware environments on AWS with infrastructure defined as code." },
      { title: "DevOps and CI/CD", text: "Automated build, test and deployment pipelines with safe rollbacks." },
      { title: "Operations", text: "Monitoring, backups, patching and incident response for production systems." },
    ],
    outcomes: ["Business systems that share one view of data", "Predictable, automated releases", "Infrastructure that is secure and observable"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
