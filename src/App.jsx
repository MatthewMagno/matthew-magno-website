import React, { useState } from 'react';
import ScrollIsland from './components/ScrollIsland.jsx';
import Hero from './components/Hero.jsx';
import WalletStack from './components/WalletStack.jsx';
import Work from './components/Work.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import { apps } from './data.js';

const SECTIONS = [
  { id: 'apps', label: 'Apps' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function App() {
  const [openApp, setOpenApp] = useState(apps[0].id);

  const showApp = (id) => {
    setOpenApp(id);
    document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <a className="skip-link" href="#apps">Skip to content</a>
      <ScrollIsland sections={SECTIONS} />
      <main>
        <Hero onOpenApp={showApp} />
        <WalletStack openId={openApp} onOpen={setOpenApp} />
        <Work />
        <About />
        <Contact />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Matthew Magno. Designed and built in San Francisco.</p>
      </footer>
    </>
  );
}
