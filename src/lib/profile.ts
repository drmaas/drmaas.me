/** Shared profile copy for home hero and resume. Update here once. */
// Resume content sourced from the LinkedIn Profile PDF.
// Update resume-only blocks when the LinkedIn profile changes.

export const profileTagline =
  "Software Shepherd · Agentic AI · AWS · Cloudflare";

export const profileIntro =
  "I've been deep in the agentic AI space — building and orchestrating coding agents (Claude Code, Cursor, Codex) and authoring the primitives that power them: MCP servers, plugins, skills, hooks, and subagents.";

/** Target length for HTML meta descriptions (search snippets). */
export const metaDescriptionMaxLength = 160;

/** Trim copy to a word boundary for `meta name="description"`. */
export function trimToMetaDescription(
  text: string,
  maxLength: number = metaDescriptionMaxLength,
): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) {
    return normalized;
  }
  const slice = normalized.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace <= 0) {
    return slice;
  }
  return slice.slice(0, lastSpace);
}

export function profileHomeDocumentTitle(fullName: string): string {
  return `${fullName} — ${profileTagline}`;
}

export function profileHomeMetaDescription(): string {
  return trimToMetaDescription(profileIntro);
}

const profileAboutSuffix =
  " I'm particularly interested in composable agent architectures and how agentic tooling changes the way developers ship software.";

export const profileAbout = profileIntro + profileAboutSuffix;

export const profileHeroSkills = [
  "Agentic AI",
  "Application Architecture",
  "Cloudflare",
  "MCP Servers",
  "System Design",
  "TypeScript",
] as const;

export interface SubRole {
  title: string;
  bullets: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  location?: string;
  dates: string;
  bullets?: string[];
  description?: string;
  subRoles?: SubRole[];
}

export interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

export const resumeStrengths: string[] = [
  "AI Engineering",
  "Domain Driven Design",
  "Application Architecture",
  "Data Modeling",
  "Agile Development",
  "System Design",
  "Knowing the right tool for the right job",
  "Problem-solving abilities",
  "Creativity and flexibility",
  "Adapting to change, learning new skills",
  "Web design principles and design patterns",
  "Independence & self-motivation",
  "Continuous integration / deployment",
  "Software quality & performance testing",
  "Communicating and coordinating across diverse groups",
];

// Contact links shown in the resume header. `href` is rendered as a clickable
// link — use `mailto:` for email or the full `https://` URL for sites.
export const resumeContact: ContactItem[] = [
  {
    label: "Email",
    value: "drmaas@gmail.com",
    href: "mailto:drmaas@gmail.com",
  },
  {
    label: "Location",
    value: "Greater Minneapolis-St. Paul Area",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/daniel-r-maas",
    href: "https://www.linkedin.com/in/daniel-r-maas",
  },
  {
    label: "Consulting",
    value: "maas.build",
    href: "https://maas.build",
  },
  {
    label: "Website",
    value: "drmaas.me",
    href: "https://drmaas.me",
  },
  {
    label: "GitHub",
    value: "github.com/drmaas",
    href: "https://github.com/drmaas",
  },
];

// Stack / technologies. Technical strengths (DDD, architecture, etc.) live
// in the `strengths` array above to avoid duplicating them here.
export const resumeSkills: string[] = [
  "Agentic AI",
  "MCP Servers",
  "Claude Code",
  "Cursor",
  "Codex",
  "Mastra.ai",
  "LangChain",
  "LangGraph",
  "AWS Bedrock",
  "Next.js",
  "Node.js",
  "AWS",
  "Cloudflare",
  "Terraform",
  "gRPC",
  "Microservices",
  "Kafka",
  "Postgres",
  "Cassandra",
  "MongoDB",
  "Elasticsearch",
  "Java",
  "Kotlin",
  "Python",
  "Go",
  "TypeScript",
  "Groovy",
  "SQL",
  "C",
  "Spring Boot",
  "Micronaut",
  "Gradle",
  "Ratpack",
  "Git",
];

export const resumeExperience: ExperienceEntry[] = [
  {
    title: "Principal Engineer — Web Platforms",
    company: "Salesforce",
    location: "Minnesota, United States",
    dates: "Jan 2023 – Present",
    bullets: [
      "Designing and deploying agentic coding workflows using Claude Code, Cursor, and Codex — including MCP server authoring, plugin/skill/hook composition, and subagent orchestration",
      "Building multi-agent automation pipelines with Mastra.ai, LangChain/LangGraph, and AWS Bedrock AgentCore; integrating Slack Bolt bots with the OpenAI SDK for workflow automation",
      "Designed website telemetry platform for salesforce.com scaling to 10K RPS",
      "Designed authentication and authorization servers using OpenID Connect (OIDC)",
      "Designed lead generation apps to capture marketing signals across Salesforce sites",
    ],
  },
  {
    title: "Founder and CEO, Maas Technologies LLC",
    company: "Self-Employed",
    location: "North America",
    dates: "Jan 2015 – Present",
    description:
      "I help growing companies build backend systems that scale — without the fires. As an independent consultant at maas.build, I focus on system architecture and application design: the decisions that determine whether your product handles 10x growth or falls apart under it. I find the bottlenecks, fix the foundations, and make sure your engineering keeps pace with your ambitions.",
  },
  {
    title: "Principal Software Engineer — Financial Retail Systems",
    company: "Target",
    location: "Remote",
    dates: "Mar 2020 – Jan 2023",
    bullets: [
      "Oversaw all architecture, design, and technical decisions across 4 product teams and 30 engineers",
      "Rebuilding end-end B2B ecommerce giftcard site",
      "Rebuilt redcard application architecture",
      "Rebuilt bank account validation applications",
      "Redesigned new application statistics APIs",
      "Redesigned decision reporting applications",
      "Redesigned guest account forward cache with GraphQL",
    ],
  },
  {
    title: "Principal Software Engineer — Commerce",
    company: "Target",
    location: "Greater Minneapolis-St. Paul Area",
    dates: "Aug 2017 – Mar 2020",
    bullets: [
      "Redesigned shopping cart applications from monolith to microservices",
      "Designed platform and guest-facing omnichannel shopping cart/payment APIs",
      "Scaled shopping cart APIs to 20K RPS",
      "Built devops pipelines using Nomad and Terraform",
      "Grew the team from 3 to more than 10 engineers",
    ],
  },
  {
    title: "Lead Software Engineer",
    company: "Target",
    location: "Greater Minneapolis-St. Paul Area",
    dates: "Aug 2015 – Aug 2017",
    description: "Lead engineer responsible for API design and data modeling.",
  },
  {
    title: "Senior Consultant",
    company: "Object Partners, Inc.",
    location: "Consultant at Target",
    dates: "Dec 2014 – Aug 2015",
  },
  {
    title: "Senior Software Developer",
    company: "Capella Education Company",
    dates: "Apr 2013 – Dec 2014",
    bullets: [
      "Performed the lead application architect role for all campus and social products applications",
      "Led the development of applications, servlets, portlets, and RESTful web services for Capella's virtual campus using KnockoutJS, Spring MVC, Spring Boot, Hibernate, and JAX-RS",
      "Led the development of upgrade project from Liferay 6.0 to 6.1",
      "Led the development of refactoring of back-end code from Spring 2.x to 4.x, and SOAP to REST",
      "Wrote scripts and internal tools as needed using a variety of languages",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: "Oracle",
    dates: "Oct 2008 – Apr 2013",
    subRoles: [
      {
        title: "Senior Software Developer",
        bullets: [
          "Designed and implemented application frameworks for use across the Retail Global Business Unit, including batch, internationalization, and user interface components",
          "Built a web application to manage application security policies",
          "Wrote JSF Rich User Interface Components",
          "Designed static code analysis frameworks",
          "Built auditing and automatic code-fixing tools",
        ],
      },
      {
        title: "Build and Tools Engineer",
        bullets: [
          "Designed and implemented a new build process using Groovy for next-generation applications — building, auditing, testing, and deployment automated without custom build scripts",
          "Project manager for installer development for the 13.2 release of retail software; coordinated development and testing of 25+ product installers",
          "Created strategy for implementing new security standards in installers and their conversion from OAS to Weblogic",
          "Developed a suite of Weblogic configuration and deployment scripts using Jython and installers to install products into Weblogic",
          "Automated the integration of metrics collection software with installers",
          "Maintained and assisted with the design of a large-scale continuous integration build system using CruiseControl — thousands of builds and deployments per month",
          "Designed automated processes for generating release candidates",
          "Designed a tool that automated the creation and removal of build projects based on templates",
          "Part of a team designing and implementing a new build system using Hudson, including deployment processes and other automation",
          "Performed administration, configuration, and troubleshooting of applications running in Weblogic",
        ],
      },
    ],
  },
  {
    title: "Parks and Recreation Commission Member",
    company: "City of Maplewood",
    dates: "2010 – 2012",
    description: "Made policy recommendations for the City Council.",
  },
  {
    title: "Information Technology Architecture Analyst",
    company: "UnitedHealth Group",
    dates: "Nov 2006 – Oct 2008",
    bullets: [
      "Designed a web application using Java and Tomcat allowing users to perform automated build and database tasks, utilizing Apache, Spring, XML, JavaScript, HTML, CSS, and Axis2",
      "Performed J2EE-compliant WebSphere 5.1 through 6.1 application environment setup, configuration, and deployment",
      "Helped design application deployment workflow and scripts using Mercury IT Governance software",
      "Created Ant build scripts to seamlessly build and stage web applications through Subversion and AnthillPro",
      "Designed Perl and shell scripts to improve DB2 8 through 9 database extract, transform, and load functionality across environments",
      "Planned and coordinated the move of software applications and databases to managed services environments",
      "Researched and implemented data monitoring solutions for Tuxedo 8.1",
      "Worked with other team members to maintain AIX server integrity",
      "Designed a Microsoft SharePoint site for the application team",
    ],
  },
  {
    title: "Traveller — Europe",
    company: "Gap Period",
    dates: "Jun 2006 – Sep 2006",
    description:
      "I travelled across Europe for 3 months — as far west as Ireland, and as far east as Hungary. I spent a lot of time reflecting, and met a lot of great people.",
  },
  {
    title: "Software Engineer",
    company: "Aero Systems Engineering",
    dates: "Jun 2004 – Jun 2006",
    bullets: [
      "Designed, tested, and deployed a graphing application in C/C++ that presented real-time monitoring data for turbine engine test runs",
      "Designed and documented an automated procedure for installing Linux for the company's engine test cell servers",
      "Performed debugging and troubleshooting of software problems associated with turbine engine testing",
      "Designed and implemented detailed test plans for moving the system software and analog hardware devices from HP-UX to a Linux platform",
      "Programmed data acquisition cards that fed data into the engine test run-time environment",
    ],
  },
  {
    title: "Consultant",
    company: "University of Wisconsin",
    dates: "Jun 2003 – May 2004",
    bullets: [
      "Served as a consultant and assistant to all computer-aided engineering laboratories on the UW-Madison Engineering Campus, serving thousands of students and faculty",
      "Solved IT problems including in-office and remote hardware/software issues, maintaining printers and computer equipment, and setting up email",
      "Gave engineering program software tutorials to middle-school students",
    ],
  },
  {
    title: "Computer Engineering Intern",
    company: "IBM Corporation",
    dates: "Jun 2002 – Dec 2002",
    bullets: [
      "Led the design and implementation of digital logic to improve hard disk performance in large-scale servers using VHDL",
      "Created test cases in VHDL for the Fibre Channel and SCSI Hard Disk Controllers",
      "Extensively simulated and tested processor logic using ModelSim and analog lab tools",
      "Performed post-fabrication validation using digital oscilloscopes",
    ],
  },
];

export const resumeEducation = [
  {
    degree: "MS, Software Engineering",
    school: "University of Minnesota-Twin Cities",
    dates: "2011 – 2013",
  },
  {
    degree: "B.S., Computer Engineering and Computer Science",
    school: "University of Wisconsin-Madison",
    dates: "1999 – 2004",
  },
];

export const resumeCertifications = [
  "AWS Certified Solutions Architect – Associate",
  "Retrieval Augmented Generation (RAG)",
];

export const resumePublications = [
  "Method and system for centralized checkout process",
  "Reddit Architecture and Extension Proposal",
];

export const resumeLanguages = [
  { name: "French", level: "Elementary" },
  { name: "Python", level: null },
  { name: "Kotlin", level: null },
  { name: "TypeScript", level: null },
  { name: "Java", level: null },
  { name: "Groovy", level: null },
  { name: "Go", level: null },
  { name: "JavaScript", level: null },
  { name: "SQL", level: null },
  { name: "C", level: null },
];

export const resumeHobbies = "Reading, Coding, Hiking, Biking, Swimming, Yoga";
