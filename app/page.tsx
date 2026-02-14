import Link from "next/link";
import { profile } from "@/data/profile";

export default function Home() {
  const {
    personal,
    about,
    skills,
    experience,
    projects,
    education,
    certifications,
    languages,
    profiles,
  } = profile;

  const heroHighlights = [
    { label: "Location", value: personal.location },
    { label: "Focus", value: personal.roles.slice(0, 2).join(" • ") },
    {
      label: "Languages",
      value: languages.map((lang) => lang.language).join(", "),
    },
  ];

  const contactLinks = [
    {
      label: "Email",
      href: `mailto:${personal.email}`,
      display: personal.email,
      description: "Direct collaboration inquiries",
    },
    {
      label: "LinkedIn",
      href: profiles.linkedin.url,
      display: "LinkedIn profile",
      description: "Professional network & endorsements",
    },
    {
      label: "GitHub",
      href: profiles.github.url,
      display: profiles.github.username,
      description: "Code samples & OSS spikes",
    },
  ];

  return (
    <main className="portfolio-shell" aria-label="Ashrumochan Badajena portfolio">
      <section className="intro-panel" aria-labelledby="intro-heading">
        <p className="eyebrow">{personal.roles.join(" · ")}</p>
        <h1 id="intro-heading">{personal.name}</h1>
        <p className="lede">{about}</p>

        <div className="hero-actions">
          <Link className="btn primary" href={`mailto:${personal.email}`}>
            Let&apos;s build together
          </Link>
          <Link className="btn ghost" href={profiles.linkedin.url} target="_blank">
            View LinkedIn
          </Link>
        </div>

        <dl className="hero-highlights">
          {heroHighlights.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <nav aria-label="Quick section navigation" className="quick-links">
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
      </section>

      <div className="content-stack">
        <section id="skills" aria-labelledby="skills-heading" className="panel">
          <div className="section-heading">
            <p className="eyebrow">Expertise</p>
            <h2 id="skills-heading">Frontend-led engineering</h2>
            <p>
              Modern MERN-stack delivery with an emphasis on scalable React
              architectures, robust routing, and type-safe APIs.
            </p>
          </div>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, stack]) => (
              <article key={category}>
                <h3>{category}</h3>
                <ul>
                  {stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-heading" className="panel">
          <div className="section-heading">
            <p className="eyebrow">Selected projects</p>
            <h2 id="projects-heading">Ship-ready builds</h2>
            <p>
              Product experiences crafted with real users in mind—each shipped
              with performance budgets and clean component abstractions.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <ul className="tech-list" aria-label="Tech stack">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text"
                >
                  Visit live project
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-heading" className="panel">
          <div className="section-heading">
            <p className="eyebrow">Experience</p>
            <h2 id="experience-heading">Impact snapshots</h2>
            <p>
              Leading frontend initiatives from discovery through delivery while
              partnering closely with design, backend, and product stakeholders.
            </p>
          </div>
          <div className="timeline">
            {experience.map((job) => (
              <article key={job.company} className="timeline-entry">
                <header>
                  <div>
                    <p className="eyebrow">{job.duration}</p>
                    <h3>{job.role}</h3>
                  </div>
                  {job.url ? (
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      {job.company}
                    </a>
                  ) : (
                    <span>{job.company}</span>
                  )}
                </header>
                <ul>
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="education" aria-labelledby="education-heading" className="panel">
          <div className="section-heading">
            <p className="eyebrow">Foundation</p>
            <h2 id="education-heading">Education & certifications</h2>
          </div>
          <div className="education-grid">
            {education.map((entry) => (
              <article key={entry.institution}>
                <h3>{entry.institution}</h3>
                <p>{entry.degree}</p>
                <p className="badge">CGPA: {entry.cgpa}</p>
              </article>
            ))}
          </div>
          <div className="certifications">
            <h3>Certifications</h3>
            <ul>
              {certifications.map((cert) => (
                <li key={cert}>{cert}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="panel contact-panel">
          <div className="section-heading">
            <p className="eyebrow">Let&apos;s collaborate</p>
            <h2 id="contact-heading">Available for frontend-focused roles</h2>
            <p>
              I partner with teams who care about developer experience, design
              systems, and measurable UX improvements.
            </p>
          </div>
          <div className="contact-links">
            {contactLinks.map((link) => (
              <article key={link.label}>
                <h3>{link.label}</h3>
                <p>{link.description}</p>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.display}
                </a>
              </article>
            ))}
            <article>
              <h3>Languages</h3>
              <ul className="chip-list">
                {languages.map((lang) => (
                  <li key={lang.language}>
                    {lang.language} · {lang.fluency}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
