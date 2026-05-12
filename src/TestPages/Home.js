import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const featuredProjects = [
  {
    title: 'Money Calculator API + UI',
    description:
      'A full-stack utility for calculating markup percentages, built as a practical tool to support small business pricing decisions.',
    tags: ['React', 'REST API', 'Full-Stack'],
    link: '/money'
  },
  {
    title: 'Recruiter-Ready Portfolio Experience',
    description:
      'This website was redesigned to communicate my technical strengths, product mindset, and impact in less than 60 seconds.',
    tags: ['UI/UX', 'Branding', 'Storytelling']
  },
  {
    title: 'Future Build: AI Workflow Assistant',
    description:
      'An upcoming project focused on reducing repetitive workflows through LLM-powered automation and thoughtful human-in-the-loop controls.',
    tags: ['AI', 'Automation', 'Product Thinking']
  }
];

const skillGroups = [
  {
    category: 'Frontend',
    items: 'React, JavaScript (ES6+), HTML5, CSS3, Responsive Design'
  },
  {
    category: 'Backend',
    items: 'Node.js, REST API design, service integration'
  },
  {
    category: 'Engineering',
    items: 'Debugging, system thinking, rapid prototyping, cross-functional collaboration'
  }
];

function Home() {
  return (
    <div className="portfolio-page">
      <section className="hero-card">
        <p className="eyebrow">Open to software engineering opportunities</p>
        <h1>Hi, I&apos;m Matthew — I build useful, polished digital products.</h1>
        <p className="hero-summary">
          I enjoy turning complex ideas into intuitive experiences. My work blends clean implementation,
          practical business value, and relentless curiosity.
        </p>
        <div className="hero-cta">
          <a href="mailto:matthew@example.com" className="btn btn-primary">Contact Me</a>
          <a href="#projects" className="btn btn-secondary">View Work</a>
        </div>
      </section>

      <section id="projects" className="section-card">
        <div className="section-heading">
          <h2>Featured Work</h2>
          <p>Projects that show how I think, build, and deliver.</p>
        </div>
        <div className="project-grid">
          {featuredProjects.map((project) => (
            <article className="project-card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
              {project.link ? (
                <Link to={project.link} className="inline-link">Explore project →</Link>
              ) : (
                <span className="inline-link muted">Case study coming soon</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>What I Bring</h2>
          <p>I focus on impact, communication, and engineering quality.</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article className="skill-card" key={group.category}>
              <h3>{group.category}</h3>
              <p>{group.items}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
