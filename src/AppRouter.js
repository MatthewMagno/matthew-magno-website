import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './TestPages/Home';
import MoneyCalc from './TestPages/MoneyCalc';
import './AppRouter.css';

const AppRouter = () => {
  return (
    <Router>
      <div className="site-shell">
        <header className="site-header">
          <Link className="brand-link" to="/">
            <span className="brand-title">Matthew Magno</span>
          </Link>
          <span className="brand-subtitle">Software Engineer • Product Builder • Problem Solver</span>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/money" element={<MoneyCalc />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRouter;
