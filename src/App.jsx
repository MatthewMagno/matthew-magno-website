import React, { useState } from 'react';
import ScrollIsland from './components/ScrollIsland.jsx';
import Hero from './components/Hero.jsx';
import WalletStack from './components/WalletStack.jsx';
import Work, { Education } from './components/Work.jsx';
import About from './components/About.jsx';

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'apps', label: 'Apps' },
  { id: 'education', label: 'Education' },
  { id: 'about', label: 'About' },
];

export default function App() {
  // Each app card opens and closes on its own; all start closed.
  const [openApps, setOpenApps] = useState(() => new Set());

  const toggleApp = (id) => {
    setOpenApps((open) => {
      const next = new Set(open);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  return (
    <>
      <a className="skip-link" href="#work">Skip to content</a>
      <ScrollIsland sections={SECTIONS} />
      <main>
        <Hero />
        <Work />
        <WalletStack openIds={openApps} onToggle={toggleApp} />
        <Education />
        <About />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Matthew Magno. Designed and built in San Francisco.</p>
      </footer>
    </>
  );
}
