import React, { useEffect, useState } from 'react';
import { profile } from '../data.js';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-card glass">
        <h2 id="contact-title">Let’s talk.</h2>
        <p>
          I’m open to software engineering roles, especially on mobile and AI products. Email is the
          fastest way to reach me.
        </p>

        <div className="contact-actions">
          <button className={`button button-filled morph ${copied ? 'is-done' : ''}`} onClick={copyEmail}>
            <span className="morph-idle">{profile.email}</span>
            <span className="morph-done" aria-hidden={!copied}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </span>
          </button>
          <a className="button button-glass glass" href={`mailto:${profile.email}`}>Open in Mail</a>
        </div>

        <ul className="list contact-links">
          <li>
            <a className="row" href={profile.linkedin} target="_blank" rel="noreferrer">
              <span className="row-icon" style={{ background: '#0a66c2' }} aria-hidden="true">in</span>
              <span className="row-title">LinkedIn</span>
              <span className="row-value">/in/matthewmagno</span>
            </a>
          </li>
          <li>
            <a className="row" href={profile.github} target="_blank" rel="noreferrer">
              <span className="row-icon" style={{ background: 'var(--label)', color: 'var(--surface)' }} aria-hidden="true">gh</span>
              <span className="row-title">GitHub</span>
              <span className="row-value">MatthewMagno</span>
            </a>
          </li>
          <li>
            <a className="row" href={profile.resume} target="_blank" rel="noreferrer">
              <span className="row-icon" style={{ background: '#ff3b30' }} aria-hidden="true">pdf</span>
              <span className="row-title">Résumé</span>
              <span className="row-value">PDF, 1 page</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="visually-hidden" role="status" aria-live="polite">
        {copied ? 'Email copied to clipboard' : ''}
      </div>
    </section>
  );
}
