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
          I’m open to backend software engineering and forward deployed engineer roles. Email is the fastest way to reach me.
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
              <span className="row-icon" style={{ background: '#0a66c2' }} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" /></svg>
              </span>
              <span className="row-title">LinkedIn</span>
              <span className="row-value">/in/matthewmagno</span>
            </a>
          </li>
          <li>
            <a className="row" href={profile.github} target="_blank" rel="noreferrer">
              <span className="row-icon" style={{ background: 'var(--label)', color: 'var(--surface)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" /></svg>
              </span>
              <span className="row-title">GitHub</span>
              <span className="row-value">MatthewMagno</span>
            </a>
          </li>
          <li>
            <a className="row" href={profile.resume} target="_blank" rel="noreferrer">
              <span className="row-icon" style={{ background: '#ff3b30' }} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h6" /></svg>
              </span>
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
