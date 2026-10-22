import React from 'react';

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">About</h2>
      </div>

      <div className="about-story">
        <p>
          I’m a backend software engineer at JPMorganChase. I started in chemical engineering because I
          wanted to change the world, and moved to software because it lets me do that faster, and for
          more people.
        </p>
        <p>
          I work on commercial real estate lending software, where I like the unglamorous wins: an
          index in the right place, a vendor dependency replaced by something my team owns, a sprint
          that doesn’t stall on a sign-off.
        </p>
        <p>
          Outside work I build apps to make my own life more productive: one for splitting trip costs with
          friends, one for planning dates, one that keeps every booking in a single place. I design and
          build each one end to end, and lately that means putting AI agents to work with real
          guardrails around them.
        </p>
      </div>
    </section>
  );
}
