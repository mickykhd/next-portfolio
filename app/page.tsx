import { profile } from "@/data/profile";
import { AnimatedHero } from "@/app/components/AnimatedHero";
import { Navbar } from "@/app/components/Navbar";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { TiltCard } from "@/app/components/TiltCard";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  const {
    personal,
    about,
    skills,
    experience,
    projects,
    education,
    certifications,
    profiles,
  } = profile;

  const navLinks = [
    { label: "About", href: "#about", index: "01." },
    { label: "Skills", href: "#skills", index: "02." },
    { label: "Projects", href: "#projects", index: "03." },
    { label: "Experience", href: "#experience", index: "04." },
    { label: "Education", href: "#education", index: "05." },
    { label: "Contact", href: "#contact", index: "06." },
  ];

  return (
    <div className="portfolio-container">
      <Navbar links={navLinks} email={personal.email} />

      <div className="main-content">
        <AnimatedHero
          name={`${personal.name}.`}
          tagline="I build things for the web."
          highlightWord="web"
          description={about}
          ctaButtons={
            <>
              <a href={`mailto:${personal.email}`} className="btn-primary">
                Get In Touch
              </a>
              <a href={profiles.github.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                GitHub
              </a>
              <a href={profiles.linkedin.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </>
          }
        />

        <ScrollReveal>
          <section className="section" id="skills">
            <div className="section-header">
              <span className="section-number">02.</span>
              <h2 className="section-title">Skills & Expertise</h2>
              <div className="section-line" />
            </div>
            <div className="skills-grid">
              {Object.entries(skills).map(([category, stack]) => (
                <div className="skill-card" key={category}>
                  <div className="skill-card-title">{category}</div>
                  <ul className="skills-list">
                    {stack.map((item) => (
                      <li className="skill-tag" key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="projects">
            <div className="section-header">
              <span className="section-number">03.</span>
              <h2 className="section-title">Projects</h2>
              <div className="section-line" />
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <TiltCard key={project.name} className="project-card">
                  <div className="project-card-header">
                    <svg className="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    <div className="project-links">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="experience">
            <div className="section-header">
              <span className="section-number">04.</span>
              <h2 className="section-title">Experience</h2>
              <div className="section-line" />
            </div>
            <div className="experience-list">
              {experience.map((job) => (
                <div className="experience-item" key={job.company}>
                  <div className="experience-duration">{job.duration}</div>
                  <h3 className="experience-role">{job.role}</h3>
                  <div className="experience-company">
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noopener noreferrer">{job.company}</a>
                    ) : (
                      job.company
                    )}
                  </div>
                  <ul className="experience-highlights">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="education">
            <div className="section-header">
              <span className="section-number">05.</span>
              <h2 className="section-title">Education & Certifications</h2>
              <div className="section-line" />
            </div>
            <div className="education-grid">
              {education.map((entry) => (
                <div className="education-card" key={entry.institution}>
                  <h3>{entry.institution}</h3>
                  <p>{entry.degree}</p>
                  <span className="cgpa-badge">CGPA: {entry.cgpa}</span>
                </div>
              ))}
            </div>
            <div className="cert-list">
              {certifications.map((cert) => (
                <div className="cert-item" key={cert}>{cert}</div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section contact-section" id="contact">
            <div className="contact-card">
              <span className="section-number" style={{ fontSize: "0.8rem" }}>06.</span>
              <h2>Let&apos;s Work Together</h2>
              <p>
                I&apos;m currently open to frontend-focused roles and collaboration opportunities.
                Whether you have a question or just want to say hi, my inbox is always open.
              </p>
              <a href={`mailto:${personal.email}`} className="btn-primary">
                Say Hello
              </a>
            </div>
            <div className="contact-links">
              <a href={profiles.github.url} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                GitHub
              </a>
              <a href={profiles.linkedin.url} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
              <a href={`mailto:${personal.email}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email
              </a>
            </div>
          </section>
        </ScrollReveal>
      </div>

      <Footer name={personal.name} />
    </div>
  );
}