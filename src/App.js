import './App.css';
import './AppRouter.css';
import React from 'react';
import AppRouter from './AppRouter';

function App() {
  return (
    <div className="app site-shell">
      <header className="site-header">
        <span className="brand-title">Matthew Magno</span>
        <span className="brand-subtitle">Software Engineer • Product Builder • Problem Solver</span>
      </header>
      <AppRouter />
    </div>
  );
}

export default App;
