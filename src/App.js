import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './TestPages/Home';
import About from './TestPages/About';
import Contact from './TestPages/Contact';
import AppRouter from './AppRouter';

function App() {
  return (
    <div>
    <div className="app">
      <AppRouter />
    </div>
    </div>
  );
}

export default App;
