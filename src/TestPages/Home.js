import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Home() {

  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [result, setResult] = useState(null);

  return (
    <div>
      <div className="info">
        <div className="biography">
          <h1>Matthew Magno is a visionary software engineer with a passion for pushing the boundaries of technology. From an early age, he exhibited a keen interest in computers and programming, spending countless hours tinkering with code and exploring the digital realm. His insatiable curiosity and drive for excellence have propelled him to become a prominent figure in the tech industry.</h1>
          <h1>With a knack for problem-solving and a creative mindset, Matthew has led numerous innovative projects that have revolutionized the way we interact with technology. Whether it's developing cutting-edge applications or diving into the depths of machine learning, he approaches each challenge with determination and a thirst for knowledge. Outside of the digital realm, Matthew enjoys exploring the great outdoors, indulging in culinary adventures, and fostering connections with like-minded individuals. As he continues to make his mark on the world of technology, Matthew Magno remains dedicated to pushing boundaries, inspiring others, and shaping the future of innovation.</h1>
          <Link  to="/money"><h1>Click to go to Money Calculator</h1></Link>
        </div>
        <div className="selection">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer"><h1 className='choice'>Google</h1></a>
          <h1 className='choice'>Projects</h1>
          <h1 className='choice'>Templates</h1>
          <h1 className='choice'>Photography</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;