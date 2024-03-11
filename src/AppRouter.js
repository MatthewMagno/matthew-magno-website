import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './TestPages/Home';
import About from './TestPages/About';
import Contact from './TestPages/Contact';
import MoneyCalc from './TestPages/MoneyCalc';
import './AppRouter.css';


const AppRouter = () => {
    return (
      <Router>
         <div>
         <div className="name">
         <Link className="name" to="/">
        <h1>Matthew Magno</h1>
        </Link>
      </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/money" element={<MoneyCalc />} />
        </Routes>
        </div>
      </Router>
    );
  };
  
  export default AppRouter;