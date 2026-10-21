import React, { useRef } from 'react';
import { apps } from '../data.js';
import ReservationsDemo from '../demos/ReservationsDemo.jsx';
import MemoriDemo from '../demos/MemoriDemo.jsx';
import SplitItDemo from '../demos/SplitItDemo.jsx';

const DEMOS = { reservations: ReservationsDemo, memori: MemoriDemo, splitit: SplitItDemo };

// Apple Wallet-style stack: every app shows its header; tap one to open or close it.
export default function WalletStack({ openIds, onToggle }) {
  // A demo stays mounted after its first open, so closing a card doesn't jump its height.
  const mounted = useRef(new Set());
  openIds.forEach((id) => mounted.current.add(id));

  return (
    <section className="section" id="apps" aria-labelledby="apps-title">
      <div className="section-head">
        <h2 id="apps-title">Apps I’ve built to improve my productivity</h2>
        <p>Each one started as a problem in my own life. Open a card and try the app right on the page.</p>
      </div>

      <div className="wallet">
        {apps.map((app) => {
          const open = openIds.has(app.id);
          const Demo = DEMOS[app.id];
          return (
            <article key={app.id} className={`pass ${open ? 'is-open' : ''}`} style={{ '--pass': app.color }}>
              <h3 className="pass-heading">
                <button
                  className="pass-header"
                  onClick={() => onToggle(app.id)}
                  aria-expanded={open}
                  aria-controls={`pass-${app.id}`}
                >
                  <img src={app.icon} alt="" width="48" height="48" />
                  <span className="pass-name">{app.name}</span>
                  <span className="pass-status">{app.status}</span>
                  <svg className="pass-chevron" viewBox="0 0 14 9" width="14" height="9" aria-hidden="true">
                    <path d="M1.5 1.5 7 7l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>

              {/* Closed bodies stay in the DOM so the height can animate; inert hides them from focus. */}
              <div className="pass-body" id={`pass-${app.id}`} {...(!open && { inert: '', 'aria-hidden': true })}>
                <div className="pass-body-inner">
                  <div className="pass-layout">
                    <div className="pass-info">
                      <p className="pass-tagline">{app.tagline}</p>

                      <dl className="pass-facts">
                        {app.facts.map((f) => (
                          <div key={f.label}>
                            <dt>{f.label}</dt>
                            <dd>{f.value}</dd>
                          </div>
                        ))}
                      </dl>

                      <ul className="pass-points">
                        {app.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>

                      <div className="pass-footer">
                        <ul className="chips" aria-label="Built with">
                          {app.stack.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                        {app.link && (
                          <a className="button button-light" href={app.link.href} target="_blank" rel="noreferrer">
                            {app.link.label}
                          </a>
                        )}
                      </div>
                    </div>
                    {Demo && mounted.current.has(app.id) && (
                      <div className="pass-demo">
                        <Demo />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
