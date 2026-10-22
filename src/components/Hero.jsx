import React, { useEffect, useRef } from 'react';
import { profile } from '../data.js';

// The essentials a recruiter looks for, readable without scrolling.
const FACTS = [
  { label: 'Role', value: 'Software Engineer II', note: 'Commercial Real Estate Digital Experience' },
  { label: 'Focus', value: 'Backend', note: 'APIs, databases and performance' },
  { label: 'Side projects', value: '3 apps', note: '1 live on the App Store' },
  { label: 'Based in', value: 'San Francisco' },
];

export default function Hero() {
  const videoRef = useRef(null);

  // Play the 3D loop unless the visitor asked for reduced motion; then the poster frame stays.
  // Both files keep the background transparent, but each browser only honours one kind of alpha:
  // WebKit (Safari, and every iOS browser) reads it from HEVC, Chrome and Firefox from VP9 WebM.
  // Chrome on a Mac will also decode HEVC, just without the alpha, so pick by engine, not canPlayType.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const webkit = /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Android/.test(navigator.userAgent);
    video.src = webkit ? './me-3d.mov' : './me-3d.webm';
    video.play().catch(() => {});
  }, []);

  return (
    <header className="hero" id="top">
      <div className="silk" aria-hidden="true">
        <span className="silk-a" />
        <span className="silk-b" />
        <span className="silk-c" />
      </div>

      <div className="hero-inner">
        <h1 className="hero-title">
          <span className="reveal" style={{ '--i': 0 }}>Matthew</span>{' '}
          <span className="reveal" style={{ '--i': 1 }}>Magno</span>
        </h1>

        <div className="hero-row">
        <div className="hero-photo reveal" style={{ '--i': 1 }}>
          <video
            ref={videoRef}
            poster="./me-3d.png"
            muted
            loop
            playsInline
            aria-label="Animated 3D figure of Matthew holding a phone, waving and hopping"
          />
        </div>
        <div className="hero-text">
        <p className="hero-role reveal" style={{ '--i': 2 }}>Backend software engineer at JPMorganChase</p>
        <p className="hero-prev reveal" style={{ '--i': 2 }}>Previously at Wells Fargo, Tillamook and Chemours</p>

        <dl className="hero-facts reveal" style={{ '--i': 3 }}>
          {FACTS.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>
                <b>{f.value}</b>
                {f.note && <span>{f.note}</span>}
              </dd>
            </div>
          ))}
        </dl>

        <div className="hero-actions reveal" style={{ '--i': 4 }}>
          <a className="button button-filled" href={profile.resume} target="_blank" rel="noreferrer">View résumé</a>
          <a className="button button-glass glass" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="button button-glass glass" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="button button-glass glass" href={`mailto:${profile.email}`}>Email</a>
        </div>
        </div>
        </div>
      </div>
    </header>
  );
}
