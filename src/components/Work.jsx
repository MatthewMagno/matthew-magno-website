import React, { useEffect, useRef, useState } from 'react';
import { fields, school, toolbox, work } from '../data.js';

const fieldColor = (name) => fields.find((f) => f.name === name)?.color ?? 'var(--tint)';

export default function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title">Work</h2>
        <p>Software, research labs, a chemical plant, product development and a startup’s marketing team. I’ve learned something different from each.</p>
      </div>

      <h3 className="work-subhead">Experience</h3>
      <ol className="timeline">
        {work.map((entry) => <TimelineEntry key={entry.org} entry={entry} />)}
      </ol>

      <div className="work-columns">
        <div>
          <h3 className="work-subhead">Education</h3>
          <div className="edu-grid">
            {school.map((s) => (
              <div key={s.org} className="edu-card">
                <Mono entry={s} />
                <div>
                  <p className="edu-org">{s.org}</p>
                  {s.roles.map((r) => (
                    <p key={r.title} className="edu-role">
                      {r.title}
                      {r.dates && <span>{r.dates}</span>}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="work-subhead" id="toolbox">Toolbox</h3>
          <div className="tool-grid">
            {toolbox.map((row) => (
              <div key={row.group} className="tool-card">
                <p>{row.group}</p>
                <ul className="chips chips-quiet">
                  {row.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Every job on a timeline ---------- */

function TimelineEntry({ entry }) {
  const [open, setOpen] = useState(false);
  const color = fieldColor(entry.field);
  // The year the job started, from its earliest role.
  const year = entry.roles.at(-1).dates.match(/\d{4}/)?.[0] ?? '';
  const id = `tl-${entry.org.replace(/\W+/g, '-').toLowerCase()}`;
  const [ref, seen] = useSeen();

  return (
    <li ref={ref} className={`tl-item ${open ? 'is-open' : ''} ${seen ? 'is-seen' : ''}`} style={{ '--c': color }}>
      <span className="tl-year">{year}</span>
      <span className="tl-dot" aria-hidden="true" />
      <article className="tl-card">
        <h4 className="tl-heading">
          <button className="tl-head" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id}>
            <Mono entry={entry} />
            <span className="tl-head-text">
              <span className="tl-org">{entry.org}</span>
              <span className="tl-sub">{[entry.roles[0].title, entry.place].join(' · ')}</span>
            </span>
            <span className="field-pill">{entry.field}</span>
            <Chevron open={open} />
          </button>
        </h4>

        {/* Closed bodies stay in the DOM so the height can animate; inert hides them from focus. */}
        <div className="tl-body" id={id} {...(!open && { inert: '', 'aria-hidden': true })}>
          <div className="tl-body-inner">
            {entry.roles.map((r) => (
              <div key={`${r.title}-${r.dates}-${r.team ?? ''}`} className="tl-role">
                <p className="tl-role-title">
                  {r.title}
                  <span>{[r.team, r.dates].filter(Boolean).join(' · ')}</span>
                </p>
                {r.points.length > 0 && (
                  <ul className="tl-points">
                    {r.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </article>
    </li>
  );
}

// True once the element has scrolled into view; it stays true so it fades in only once.
function useSeen() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, seen];
}

// The company's logo, or its initial on its tint when there's no logo.
function Mono({ entry }) {
  return (
    <span className={`mono ${entry.logo ? 'has-logo' : ''}`} style={{ background: entry.tint }} aria-hidden="true">
      {entry.logo ? <img src={entry.logo} alt="" width="36" height="36" /> : entry.org[0]}
    </span>
  );
}

function Chevron({ open }) {
  return (
    <svg className={`more-chevron ${open ? 'is-open' : ''}`} viewBox="0 0 12 8" width="11" height="8" aria-hidden="true">
      <path d="M1.5 1.5 6 6l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
