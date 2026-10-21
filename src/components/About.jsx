import React from 'react';

const FACTS = [
  { label: 'Based in', value: 'San Francisco' },
  { label: 'Studied', value: 'Chemical engineering, Texas A&M' },
  { label: 'Day job', value: 'Software Engineer II, JPMorganChase' },
  { label: 'Certified', value: 'AWS Cloud Practitioner' },
  { label: 'Research', value: 'Aggie Research Scholar, 2019' },
  { label: 'Building now', value: 'Reservations' },
];

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">About</h2>
      </div>

      <div className="about">
        <div className="about-story">
          <p>
            I studied chemical engineering at Texas A&M, spent two years in research labs (one of them on
            what 17th-century sailors ate), and interned at a chemical plant, a creamery and a bank. The
            bank is where I wrote my first production code, and that’s what stuck.
          </p>
          <p>
            Now I work on lending software at JPMorganChase, where I like the unglamorous wins: an index
            in the right place, a vendor dependency replaced by something my team owns, a sprint that
            doesn’t stall on a sign-off.
          </p>
          <p>
            Outside work I build apps to make my own life more productive: one for splitting trip costs with
            friends, one for planning dates, one that keeps every booking in a single place. I design and
            build each one end to end, and lately that means putting AI agents to work with real
            guardrails around them.
          </p>
        </div>

        <ul className="list facts" aria-label="Quick facts">
          {FACTS.map((f) => (
            <li className="row" key={f.label}>
              <span className="row-title">{f.label}</span>
              <span className="row-value">{f.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
