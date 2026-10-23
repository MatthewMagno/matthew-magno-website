import React, { useEffect, useRef, useState } from 'react';

// What I do away from a keyboard, each with the photos that go with it.
const PURSUITS = [
  {
    title: 'Running',
    text: 'I run long distances, including the San Francisco Marathon, which starts in the dark outside the Ferry Building.',
    photos: [
      { src: './about/marathon-start.jpg', alt: 'Matthew and two friends in race bibs at the marathon start at night', caption: 'Start line, before sunrise' },
      { src: './about/marathon-run.jpg', alt: 'Matthew running in the San Francisco Marathon past a crowd of spectators', caption: 'Somewhere past the crowds' },
    ],
  },
  {
    title: 'Hiking',
    text: 'My favorite trips are multi-day treks. In Peru that meant climbing a high pass in the Andes, dropping into cloud forest and crossing a river in a cable car.',
    photos: [
      { src: './about/trek-pass.jpg', alt: 'Hikers climbing a rocky trail above a long valley under low clouds', caption: 'Up to the pass' },
      { src: './about/trek-forest.jpg', alt: 'Matthew with trekking poles, small against a wall of dense green forest', caption: 'Into the cloud forest' },
      { src: './about/trek-cable.jpg', alt: 'Matthew and a friend laughing in a hanging cable car over a rushing river', caption: 'The way across the river' },
    ],
  },
  {
    title: 'Photography',
    text: 'I bring a camera everywhere I go. These are a few favorites from my trips.',
    link: { label: 'More on Instagram', href: 'https://www.instagram.com/matthew.magno/' },
    photos: [
      { src: './about/photo-torres-del-paine.jpg', alt: 'A lone figure at a lake below the granite towers of Torres del Paine, lit orange at sunrise', caption: 'Torres del Paine, Patagonia' },
      { src: './about/photo-dolomites.jpg', alt: 'Four hikers on a grassy ridge below jagged grey peaks', caption: 'The Dolomites, Italy' },
      { src: './about/photo-tokyo.jpg', alt: 'A quiet Tokyo street at dusk, seen from above, with one person walking', caption: 'Tokyo' },
      { src: './about/photo-sequoia.jpg', alt: 'A person sitting at the base of a giant sequoia in a sunlit forest', caption: 'Giant sequoias, California' },
      { src: './about/photo-mexico-city.jpg', alt: 'Brightly painted boats lined up along a canal in Xochimilco', caption: 'Xochimilco, Mexico City' },
      { src: './about/photo-patagonia-glacier.jpg', alt: 'Hikers crossing dark rocks beside a grey glacial lake under heavy cloud', caption: 'On the W Trek, Patagonia' },
    ],
  },
];

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

      <Pursuits />
    </section>
  );
}

// One pursuit at a time, picked from a segmented control, with its photos in a strip that scrolls sideways.
function Pursuits() {
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const stripRef = useRef(null);
  const p = PURSUITS[active];

  const updateEdges = () => {
    const el = stripRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [active]);

  const step = (dir) => {
    const el = stripRef.current;
    const card = el?.querySelector('figure');
    if (!card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: 'smooth' });
  };

  return (
    <div className="pursuits">
      <div className="segmented" role="tablist" aria-label="Outside work">
        {PURSUITS.map((item, i) => (
          <button
            key={item.title}
            role="tab"
            id={`pursuit-tab-${i}`}
            aria-selected={i === active}
            aria-controls="pursuit-panel"
            className={i === active ? 'is-active' : undefined}
            onClick={() => setActive(i)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="pursuit" id="pursuit-panel" role="tabpanel" aria-labelledby={`pursuit-tab-${active}`}>
        <div className="pursuit-text">
          <p>{p.text}</p>
          {p.link && (
            <a className="pursuit-link" href={p.link.href} target="_blank" rel="noreferrer">
              {p.link.label}
            </a>
          )}
        </div>

        <div className="pursuit-carousel">
          <div className="pursuit-photos" ref={stripRef} onScroll={updateEdges}>
            {p.photos.map((ph) => (
              <figure key={ph.src}>
                <img src={ph.src} alt={ph.alt} loading="lazy" />
                <figcaption>{ph.caption}</figcaption>
              </figure>
            ))}
          </div>
          {!(edges.start && edges.end) && (
            <div className="pursuit-arrows">
              <button aria-label="Previous photos" onClick={() => step(-1)} disabled={edges.start}>
                ‹
              </button>
              <button aria-label="Next photos" onClick={() => step(1)} disabled={edges.end}>
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
