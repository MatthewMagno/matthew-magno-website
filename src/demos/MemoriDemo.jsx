import React, { useState } from 'react';
import { PhoneFrame, Stack, useStack } from './Phone.jsx';

const photo = (name) => `./demo/memori-${name}.jpg`;

const SLIPS = [
  { id: 's1', title: 'Try the new ramen place', tags: ['$$'], by: 'Mia' },
  { id: 's2', title: 'Ceramics class downtown', tags: ['two hours', 'wheel'], by: 'you' },
  { id: 's3', title: 'Drive out to the lookout', tags: ['free', 'outdoors'], by: 'Mia' },
  { id: 's4', title: 'Rainy-day bookshop crawl', tags: ['cozy'], by: 'you' },
  { id: 's5', title: 'The rooftop tacos place', tags: ['$$', 'Friday'], by: 'Mia' },
];

const MEMORIES = [
  { id: 'm6', no: 6, img: photo('pier'), caption: 'the pier, freezing', month: 'August', date: 'Aug 30' },
  { id: 'm5', no: 5, img: photo('ramen'), caption: 'ramen, 11pm', month: 'August', date: 'Aug 14' },
  { id: 'm4', no: 4, img: photo('trees'), caption: 'the long walk', month: 'July', date: 'Jul 26' },
  { id: 'm3', no: 3, img: photo('flowers'), caption: 'flower market haul', month: 'July', date: 'Jul 12' },
  { id: 'm2', no: 2, img: photo('road'), caption: 'back roads home', month: 'July', date: 'Jul 3' },
];

export default function MemoriDemo() {
  const nav = useStack('home');
  const [tab, setTab] = useState('ideas');
  const [slips, setSlips] = useState(SLIPS);
  const [upNext, setUpNext] = useState(null);
  const [memories, setMemories] = useState(MEMORIES);
  const [pulled, setPulled] = useState(false);

  const restart = () => {
    setTab('ideas');
    setSlips(SLIPS);
    setUpNext(null);
    setMemories(MEMORIES);
    setPulled(false);
    nav.reset();
  };

  const top = nav.stack.filter((e) => !e.leaving).at(-1);
  const darkStatus = top?.name === 'pull';

  const seal = ({ img, caption }) => {
    const no = Math.max(...memories.map((m) => m.no)) + 1;
    const memory = { id: `m${no}`, no, img, caption: caption || upNext.title.toLowerCase(), month: 'October', date: 'Oct 21' };
    setMemories((m) => [memory, ...m]);
    setSlips((s) => s.filter((x) => x.id !== upNext.id));
    setUpNext(null);
    nav.pop();
    setTimeout(() => nav.push('sealed', 'fade', { memory }), 380);
  };

  const render = (entry) => {
    switch (entry.name) {
      case 'home':
        return (
          <div className="mem-screen">
            {tab === 'ideas' ? (
              <Ideas
                slips={slips}
                upNext={upNext}
                hintPull={!pulled}
                onAdd={(title) => setSlips((s) => [{ id: `s${Date.now()}`, title, tags: [], by: 'you', fresh: true }, ...s])}
                onPull={() => {
                  setPulled(true);
                  nav.push('pull', 'fade');
                }}
                onSeal={() => nav.push('seal', 'sheet')}
              />
            ) : (
              <Log memories={memories} onOpen={(m) => nav.push('print', 'push', { memory: m })} />
            )}
            <TabBar tab={tab} onTab={setTab} />
          </div>
        );
      case 'pull':
        return (
          <Pull
            slips={slips.filter((s) => s.id !== upNext?.id)}
            onKeep={(slip) => {
              setUpNext(slip);
              setTab('ideas');
              nav.pop();
            }}
            onClose={nav.pop}
          />
        );
      case 'seal':
        return <Seal slip={upNext} onCancel={nav.pop} onSeal={seal} />;
      case 'sealed':
        return (
          <Sealed
            memory={entry.props.memory}
            onLog={() => {
              setTab('log');
              nav.reset();
            }}
            onIdeas={() => {
              setTab('ideas');
              nav.reset();
            }}
          />
        );
      case 'print':
        return <Print memory={entry.props.memory} onBack={nav.pop} />;
      default:
        return null;
    }
  };

  return (
    <PhoneFrame label="Memori demo" onRestart={restart} darkStatus={darkStatus}>
      <div className="demo demo-mem">
        <Stack stack={nav.stack} render={render} />
      </div>
    </PhoneFrame>
  );
}

function Ideas({ slips, upNext, hintPull, onAdd, onPull, onSeal }) {
  const [draft, setDraft] = useState('');
  const waiting = slips.filter((s) => s.id !== upNext?.id);

  return (
    <>
      <div className="mem-scroll">
        <header className="mem-head">
          <img src="./icons/memori.png" alt="" />
          <div>
            <span className="mem-kicker">You &amp; Mia</span>
            <h1>{waiting.length} ideas waiting</h1>
          </div>
        </header>

        {upNext ? (
          <div className="mem-hero">
            <span className="mem-stamp">Up next</span>
            <h2>{upNext.title}</h2>
            <p>Mia’s been told. Have a good one.</p>
            <button className="mem-cta-light hint" onClick={onSeal}>We went, seal it</button>
          </div>
        ) : (
          <div className="mem-hero">
            <span className="mem-stamp">Free tonight?</span>
            <h2>Too many ideas? Pick one.</h2>
            <p>One pull picks a slip at random. On a phone, you shake it.</p>
            <button className={`mem-cta-light ${hintPull ? 'hint' : ''}`} onClick={onPull}>Pull one</button>
          </div>
        )}

        <ul className="mem-slips">
          {waiting.map((s) => (
            <li key={s.id} className={`mem-slip ${s.fresh ? 'is-fresh' : ''}`}>
              <span className="mem-slip-title">{s.title}</span>
              <span className="mem-slip-meta">
                {s.tags.map((t) => (
                  <span key={t} className="mem-tag">{t}</span>
                ))}
                <span className={s.fresh ? 'mem-now' : ''}>{s.fresh ? 'you, just now' : s.by}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form
        className="mem-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) onAdd(draft.trim());
          setDraft('');
        }}
      >
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Toss in an idea…" aria-label="New idea" />
        <button aria-label="Add idea" disabled={!draft.trim()}>
          <svg viewBox="0 0 20 20"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </form>
    </>
  );
}

function Log({ memories, onOpen }) {
  const months = [];
  memories.forEach((m) => {
    const last = months[months.length - 1];
    if (last && last.month === m.month) last.items.push(m);
    else months.push({ month: m.month, items: [m] });
  });

  return (
    <div className="mem-scroll">
      <header className="mem-head mem-head-log">
        <div>
          <span className="mem-kicker">The log</span>
          <h1>{memories.length} dates in</h1>
        </div>
      </header>
      {months.map((g) => (
        <section key={g.month} className="mem-month">
          <h2>{g.month}, {g.items.length} sealed</h2>
          <div className="mem-grid">
            {g.items.map((m, i) => (
              <button key={m.id} className={`mem-print ${i === 0 && g.month === 'October' ? 'is-fresh' : ''}`} onClick={() => onOpen(m)} style={{ '--r': `${i % 2 ? 1.4 : -1.2}deg` }}>
                <img src={m.img} alt="" />
                <span className="mem-caption">{m.caption}</span>
                <span className="mem-no">Nº {m.no}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TabBar({ tab, onTab }) {
  return (
    <nav className="mem-tabbar">
      <button className={tab === 'ideas' ? 'is-on' : ''} onClick={() => onTab('ideas')}>
        <svg viewBox="0 0 20 20"><path d="M10 2.5a5.5 5.5 0 0 0-3.2 10c.5.4.7.9.7 1.5h5c0-.6.2-1.1.7-1.5a5.5 5.5 0 0 0-3.2-10zM8 16.5h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        Ideas
      </button>
      <button className={tab === 'log' ? 'is-on' : ''} onClick={() => onTab('log')}>
        <svg viewBox="0 0 20 20"><rect x="4" y="2.5" width="12" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M7 6.5h6M7 9.5h6M7 12.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        Log
      </button>
    </nav>
  );
}

function Pull({ slips, onKeep, onClose }) {
  const pick = (except) => {
    const pool = slips.filter((s) => s.id !== except);
    return pool[Math.floor(Math.random() * pool.length)] ?? slips[0];
  };
  const [slip, setSlip] = useState(() => pick());
  const [n, setN] = useState(0);

  return (
    <div className="mem-pull">
      <button className="mem-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      <span className="mem-pull-kicker">The pull</span>
      {slip ? (
        <div className="mem-pulled" key={n}>
          <span className="mem-pulled-title">{slip.title}</span>
          <span className="mem-slip-meta">
            {slip.tags.map((t) => (
              <span key={t} className="mem-tag">{t}</span>
            ))}
          </span>
        </div>
      ) : (
        <p className="mem-pull-empty">The list is empty. Toss in an idea first.</p>
      )}
      <p className="mem-pull-hint">Shake to pull another</p>
      <div className="mem-pull-actions">
        <button className="mem-ghost" onClick={() => { setSlip(pick(slip?.id)); setN(n + 1); }}>Pull again</button>
        {slip && <button className="mem-cta-light hint" onClick={() => onKeep(slip)}>That’s the one</button>}
      </div>
    </div>
  );
}

const PICKS = ['tacos', 'pier', 'road'];

function Seal({ slip, onCancel, onSeal }) {
  const [img, setImg] = useState(null);
  const [caption, setCaption] = useState('');
  const next = () => {
    const i = img ? (PICKS.indexOf(img.split('memori-')[1].replace('.jpg', '')) + 1) % PICKS.length : 0;
    setImg(photo(PICKS[i]));
  };

  return (
    <div className="mem-sheet">
      <button className="mem-close mem-close-dark" onClick={onCancel} aria-label="Cancel">
        <svg viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      <span className="mem-stamp">Make it a memory</span>
      <div className="mem-polaroid mem-polaroid-edit">
        <span className="mem-tape" />
        <button className={`mem-photo-slot ${img ? 'has-photo' : 'hint'}`} onClick={next}>
          {img ? <img src={img} alt="" /> : <span>+ Add a photo</span>}
        </button>
        <input
          className="mem-caption-input"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={slip ? slip.title.toLowerCase() : 'add a note…'}
          aria-label="Caption"
        />
        <span className="mem-date">Oct 21 · tap to change</span>
      </div>
      <button className={`mem-cta ${img ? 'hint' : ''}`} disabled={!img} onClick={() => onSeal({ img, caption })}>
        Seal it into the log
      </button>
      <p className="mem-sheet-foot">{img ? 'Tap the photo to try another.' : 'Add at least one photo to seal this one in.'}</p>
    </div>
  );
}

function Sealed({ memory, onLog, onIdeas }) {
  return (
    <div className="mem-sealed">
      <div className="mem-polaroid mem-polaroid-drop">
        <span className="mem-tape" />
        <img src={memory.img} alt="" />
        <span className="mem-caption">{memory.caption}</span>
        <span className="mem-no">Nº {memory.no}</span>
      </div>
      <span className="mem-stamp">Sealed into the log</span>
      <h2>{memory.no} dates and counting</h2>
      <p>It’s waiting in Mia’s log too.</p>
      <button className="mem-cta hint" onClick={onLog}>See it on the timeline</button>
      <button className="mem-text-btn" onClick={onIdeas}>Back to your ideas</button>
    </div>
  );
}

function Print({ memory, onBack }) {
  return (
    <div className="mem-screen mem-print-screen">
      <button className="mem-back" onClick={onBack}>
        <svg viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        The log
      </button>
      <span className="mem-stamp">Sealed · {memory.date}</span>
      <div className="mem-polaroid">
        <span className="mem-tape" />
        <img src={memory.img} alt="" />
        <span className="mem-caption">{memory.caption}</span>
        <span className="mem-no">Nº {memory.no}</span>
      </div>
      <p className="mem-print-foot">You &amp; Mia</p>
    </div>
  );
}
