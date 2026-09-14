import { profile } from "@/data/profile";
import { AnimatedHero } from "@/app/components/AnimatedHero";
import { Navbar } from "@/app/components/Navbar";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { TiltCard } from "@/app/components/TiltCard";
import { ContactForm } from "@/app/components/ContactForm";
import { ProjectScreenshot } from "@/app/components/ProjectScreenshot";
import { Footer } from "@/app/components/Footer";
import { Terminal } from "@/app/components/Terminal";
import { CommandPalette } from "@/app/components/CommandPalette";
import { CopyEmail } from "@/app/components/CopyEmail";
import { JsonResume } from "@/app/components/JsonResume";
import { Magnetic } from "@/app/components/Magnetic";
import { ScrambleText } from "@/app/components/ScrambleText";
import { SnakeGame } from "@/app/components/SnakeGame";

export default function Home() {
  const {
    personal,
    about,
    skills,
    aiWorkflow,
    experience,
    projects,
    education,
    certifications,
    profiles,
  } = profile;

  const navLinks = [
    { label: "about", href: "#about", index: "01" },
    { label: "skills", href: "#skills", index: "02" },
    { label: "playground", href: "#playground", index: "03" },
    { label: "arcade", href: "#arcade", index: "04" },
    { label: "ai_stack", href: "#ai-workflow", index: "05" },
    { label: "projects", href: "#projects", index: "06" },
    { label: "experience", href: "#experience", index: "07" },
    { label: "contact", href: "#contact", index: "08" },
  ];

  return (
    <div className="portfolio-container">
      <Navbar links={navLinks} />
      <CommandPalette />

      <div className="main-content">
        <AnimatedHero
          name={`${personal.name}.`}
          tagline="Full Stack dev. Linux ♥ AI-native shipper."
          highlightWord="AI-native"
          description={about}
          marqueeItems={[
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "Linux",
            "Neovim",
            "tmux",
            "Claude Code",
            "Codex",
            "OpenCode",
            "MCP",
            "Docker",
            "Git",
            "Fedora",
            "Ubuntu",
          ]}
          ctaButtons={
            <>
              <Magnetic>
                <a href="#contact" className="btn-primary btn-compact">
                  Get In Touch
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profiles.github.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  GitHub
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profiles.linkedin.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              </Magnetic>
            </>
          }
        />

        <ScrollReveal>
          <section className="section playground-section" id="playground">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title"><ScrambleText text="./playground --interactive" trigger="hover" /></h2>
              <div className="section-line" />
            </div>
            <p className="ai-workflow-intro">
              Don&apos;t just read about me — interrogate me. It&apos;s a real
              little shell: try <code>neofetch</code>, <code>whoami</code>, or{" "}
              <code>sudo make hire-me</code>.
            </p>
            <Terminal />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="arcade">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title"><ScrambleText text="./snake --play" trigger="hover" /></h2>
              <div className="section-line" />
            </div>
            <p className="ai-workflow-intro">
              Every terminal needs a snake. Eat, grow, don&apos;t die —
              speed ramps up every 10 points. Or just type <code>snake</code> in
              the playground above.
            </p>
            <SnakeGame />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="skills">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title"><ScrambleText text="cat skills.txt" trigger="hover" /></h2>
              <div className="section-line" />
            </div>
            <div className="skills-grid">
              {Object.entries(skills).map(([category, stack]) => (
                <div className="skill-card" key={category}>
                  <div className="skill-card-title">
                    {
                      (
                        {
                          frontend: "ls frontend/",
                          backend: "ls backend/",
                          aiTools: "ls ai-tools/",
                          tools: "ls devops/",
                        } as Record<string, string>
                      )[category] ?? `ls ${category}/`
                    }
                  </div>
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
          <section className="section" id="ai-workflow">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-title"><ScrambleText text="cat ai_stack.md" trigger="hover" /></h2>
              <div className="section-line" />
            </div>
            <p className="ai-workflow-intro">
              I build AI-natively — agents for scaffolding and refactors, MCP for
              grounded context, and strict human review before every merge.
            </p>
            <div className="skills-grid">
              {aiWorkflow.map((tool) => (
                <div className="skill-card" key={tool.name}>
                  <div className="skill-card-title">{tool.name}</div>
                  <p className="ai-tool-detail">{tool.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="projects">
            <div className="section-header">
              <span className="section-number">06</span>
              <h2 className="section-title"><ScrambleText text="git log --projects" trigger="hover" /></h2>
              <div className="section-line" />
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <TiltCard key={project.name} className="project-card">
                  <div className="project-preview">
                    <div className="project-browser-bar">
                      <span className="browser-dot" />
                      <span className="browser-dot" />
                      <span className="browser-dot" />
                      <span className="browser-url">
                        {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                    </div>
                    <ProjectScreenshot url={project.liveUrl} name={project.name} />
                  </div>
                  <div className="project-card-body">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-card-footer">
                      <div className="project-tech">
                        {project.tech.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-visit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="section" id="experience">
            <div className="section-header">
              <span className="section-number">07</span>
              <h2 className="section-title"><ScrambleText text="git log --career" trigger="hover" /></h2>
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
              <span className="section-number">08</span>
              <h2 className="section-title"><ScrambleText text="cat education.log" trigger="hover" /></h2>
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
            <div className="section-header" style={{ justifyContent: "center" }}>
              <span className="section-number">09</span>
              <h2 className="section-title"><ScrambleText text="ping --me" trigger="hover" /></h2>
              <div className="section-line" />
            </div>
            <div className="contact-layout">
              <div className="contact-info">
                <p>
                  I&apos;m currently open to frontend-focused roles and collaboration opportunities.
                  Whether you have a question or just want to say hi, reach out and I&apos;ll get back to you.
                </p>
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
                <div className="nerd-actions">
                  <CopyEmail email={personal.email} />
                  <JsonResume />
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </ScrollReveal>
      </div>

      <Footer name={personal.name} />
    </div>
  );
}