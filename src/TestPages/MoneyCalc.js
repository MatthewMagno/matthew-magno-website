import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function MoneyCalc() {

  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [result, setResult] = useState(null);

  const handleAddition = () => {
    fetch('http://localhost:8080/add', { // Assuming your backend is running on port 8080
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ total: parseFloat(one), subTotal: parseFloat(two) })
    })
    .then(response => response.json())
    .then(data => setResult(data))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div>

      <div className="info">
        <div className="biography">
          <h1>This is the biography</h1>
          <div>
            <input type="number" placeholder="Place overall total" value={one} onChange={e => setOne(e.target.value)} />
            <input type="number" placeholder="Place total before tax" value={two} onChange={e => setTwo(e.target.value)} />
            <button onClick={handleAddition}>Add</button>
            {result && <h1>upCharge: {result}%</h1>}
          </div>
        </div>
        <div className="selection">
          <h1>This is the selection</h1>
        </div>
      </div>
    </div>
  );
}

export default MoneyCalc;