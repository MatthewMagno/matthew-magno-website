import React, { useEffect, useRef, useState } from 'react';
import { fields, school, toolbox, work } from '../data.js';

const fieldColor = (name) => fields.find((f) => f.name === name)?.color ?? 'var(--tint)';
const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];

// Fires once when the element scrolls into view, for entrance animations.
function useSeen(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, seen];
}

export default function Work() {
  const [current, ...earlier] = work;

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title">Work</h2>
        <p>Software, research labs, a chemical plant, product development and a startup’s marketing team. I’ve learned something different from each.</p>
      </div>

      <NowCard entry={current} />
      <CareerArc />

      <h3 className="work-subhead">Before that</h3>
      <ol className="timeline">
        {earlier.map((entry) => <TimelineEntry key={entry.org} entry={entry} />)}
      </ol>

      <div className="work-columns">
        <div>
          <h3 className="work-subhead">Education</h3>
          <div className="edu-grid">
            {school.map((s) => (
              <div key={s.org} className="edu-card">
                <span className="mono" style={{ background: s.tint }} aria-hidden="true">{s.org[0]}</span>
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

/* ---------- Now: the current job, with its headline number ---------- */

function NowCard({ entry }) {
  const [ref, seen] = useSeen(0.35);
  const [all, setAll] = useState(false);
  const steps = [...entry.roles].reverse();
  const role = entry.roles[0];
  const points = entry.roles.flatMap((r) => r.points);
  const shown = all ? points : points.slice(0, 4);

  return (
    <article className={`now ${seen ? 'is-seen' : ''}`} ref={ref} style={{ '--c': fieldColor(entry.field) }}>
      <div className="now-top">
        <div className="now-intro">
          <p className="now-eyebrow">
            <span className="now-dot" aria-hidden="true" />
            Now · {entry.place}
          </p>
          <h3>{role.title}</h3>
          <p className="now-org">
            <span className="mono" style={{ background: entry.tint }} aria-hidden="true">J</span>
            {entry.org}
            <span className="field-pill">{entry.field}</span>
          </p>

          <ol className="steps" aria-label="Roles at JPMorganChase">
            {steps.map((r, i) => (
              <li key={r.title} className={i === steps.length - 1 ? 'is-current' : ''}>
                <span className="steps-dot" aria-hidden="true" />
                <span className="steps-title">{r.title}</span>
                <span className="steps-dates">{r.dates}</span>
              </li>
            ))}
          </ol>
        </div>

        <figure className="now-stat">
          <figcaption>
            <span className="now-stat-figure">59.5%</span>
            <span className="now-stat-label">faster loan-event processing</span>
            <span className="now-stat-caption">Average time for large loans (100+ tasks) on the commercial real estate lending platform, after a performance project I led.</span>
          </figcaption>
          <div className="now-bars" role="img" aria-label="Before: 86.4 seconds. After: 35 seconds.">
            <div className="now-bar-row">
              <span>Before</span>
              <span className="now-bar is-before" style={{ '--w': 1 }} />
              <b>86.4 s</b>
            </div>
            <div className="now-bar-row">
              <span>After</span>
              <span className="now-bar is-after" style={{ '--w': 35 / 86.4 }} />
              <b>35 s</b>
            </div>
          </div>
        </figure>
      </div>

      <ul className="now-points">
        {shown.map((p) => <li key={p}>{p}</li>)}
      </ul>
      {points.length > 4 && (
        <button className="more-btn" onClick={() => setAll(!all)} aria-expanded={all}>
          {all ? 'Show less' : `Show all ${points.length} highlights`}
          <Chevron open={all} />
        </button>
      )}
    </article>
  );
}

/* ---------- Five kinds of work, at a glance ---------- */

const START = 2019;
const END = 2027;
const NOW = [2026, 10];
const monthsFrom = ([y, m]) => (y - START) * 12 + (m - 1);
const yearOf = (d) => d[0];

function CareerArc() {
  const [ref, seen] = useSeen(0.4);
  const total = (END - START) * 12;
  const years = Array.from({ length: END - START }, (_, i) => START + i);

  // Spans in time order, packed into as few rows as fit without overlapping.
  const spans = fields
    .flatMap((f) => f.spans.map((sp) => ({ ...sp, field: f.name, color: f.color, a: monthsFrom(sp.from), b: monthsFrom(sp.to ?? NOW) + 1 })))
    .sort((x, y) => x.a - y.a);
  const rowEnds = [];
  spans.forEach((sp) => {
    let row = rowEnds.findIndex((end) => end <= sp.a);
    if (row < 0) row = rowEnds.push(0) - 1;
    rowEnds[row] = sp.b;
    sp.row = row;
  });

  const ordered = [...fields].sort((x, y) => monthsFrom(x.spans[0].from) - monthsFrom(y.spans[0].from));

  return (
    <figure className={`arc ${seen ? 'is-seen' : ''}`} ref={ref}>
      <figcaption>
        <span className="arc-title">{NUMBERS[fields.length - 1] ?? fields.length} kinds of work since {START}</span>
        <span className="arc-caption">Software is where I landed.</span>
      </figcaption>

      <div className="arc-strip" style={{ '--rows': rowEnds.length }} aria-hidden="true">
        {years.map((y) => (
          <span key={y} className="arc-year" style={{ left: `${(((y - START) * 12) / total) * 100}%` }}>{y}</span>
        ))}
        {spans.map((sp, i) => (
          <span
            key={sp.org}
            className={`arc-bar ${sp.to ? '' : 'is-current'}`}
            title={`${sp.org} · ${sp.field}`}
            style={{
              left: `${(sp.a / total) * 100}%`,
              width: `${((sp.b - sp.a) / total) * 100}%`,
              top: `calc(${sp.row} * 18px)`,
              '--c': sp.color,
              '--d': `${i * 80}ms`,
            }}
          />
        ))}
      </div>

      <ul className="arc-fields">
        {ordered.map((f) => {
          const from = Math.min(...f.spans.map((s) => yearOf(s.from)));
          const live = f.spans.some((s) => !s.to);
          const to = live ? 'now' : Math.max(...f.spans.map((s) => yearOf(s.to)));
          return (
            <li key={f.name} style={{ '--c': f.color }}>
              <span className="arc-field-name">{f.name}</span>
              <span className="arc-field-years">{from === to ? from : `${from} – ${to}`}</span>
              <span className="arc-field-orgs">{f.spans.map((s) => s.org).join(', ')}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/* ---------- Earlier jobs on a timeline ---------- */

function TimelineEntry({ entry }) {
  const [open, setOpen] = useState(false);
  const color = fieldColor(entry.field);
  const year = entry.roles[0].dates.match(/\d{4}/)?.[0] ?? '';
  const hidden = entry.roles.reduce((n, r) => n + Math.max(r.points.length - 1, 0), 0);
  const id = `tl-${entry.org.replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <li className="tl-item" style={{ '--c': color }}>
      <span className="tl-year">{year}</span>
      <span className="tl-dot" aria-hidden="true" />
      <article className="tl-card">
        <header className="tl-head">
          <span className="mono" style={{ background: entry.tint }} aria-hidden="true">{entry.org[0]}</span>
          <div className="tl-head-text">
            <h4>{entry.org}</h4>
            <p>{entry.place}</p>
          </div>
          <span className="field-pill">{entry.field}</span>
        </header>

        {entry.roles.map((r) => (
          <div key={`${r.title}-${r.dates}-${r.team ?? ''}`} className="tl-role">
            <p className="tl-role-title">
              {r.title}
              <span>{[r.team, r.dates].filter(Boolean).join(' · ')}</span>
            </p>
            <ul className="tl-points" id={`${id}-${r.dates}-${r.team ?? ''}`}>
              {(open ? r.points : r.points.slice(0, 1)).map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}

        {hidden > 0 && (
          <button className="more-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'Show less' : `${hidden} more`}
            <Chevron open={open} />
          </button>
        )}
      </article>
    </li>
  );
}

function Chevron({ open }) {
  return (
    <svg className={`more-chevron ${open ? 'is-open' : ''}`} viewBox="0 0 12 8" width="11" height="8" aria-hidden="true">
      <path d="M1.5 1.5 6 6l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
