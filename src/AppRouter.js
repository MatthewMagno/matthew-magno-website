import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './TestPages/Home';
import About from './TestPages/About';
import Contact from './TestPages/Contact';


const AppRouter = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" component={Contact} />
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;