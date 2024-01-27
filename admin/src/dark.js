import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DarkPatternsList = () => {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/report')
      .then(response => {
        setPatterns(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  const handleApprove = (id, website_name, img, htmlcontent, tag) => {
    axios.post('http://localhost:5000/approve', { id, website_name, img, htmlcontent, tag })
      .then(response => {
        console.log('Approval successful:', response.data);
        axios.get('http://localhost:5000/report')
          .then(response => {
            setPatterns(response.data);
          })
          .catch(error => {
            console.error('Error fetching data after approval:', error);
          });
      })
      .catch(error => {
        console.error('Error approving pattern:', error);
      });
  };

  const handleChange = (id, selectedTag) => {
    setPatterns(prevPatterns =>
      prevPatterns.map(pattern =>
        pattern.id === id ? { ...pattern, tag: selectedTag } : pattern
      )
    );
  };

  return (
    <div>
      <h1>Dark Patterns List</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
        <div style={{ flex: 1 }}>Website Name</div>
        <div style={{ flex: 1 }}>Website Image</div>
        <div style={{ flex: 1 }}>Tag</div>
        <div style={{ flex: 2 }}>HTML Content</div>
        <div style={{ flex: 1 }}>Actions</div>
      </div>
      {patterns.map(pattern => (
        <div key={pattern.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ddd', padding: '10px', margin: '10px', borderRadius: '5px' }}>
          <div style={{ flex: 1 }}><a href={pattern.website_name}>{pattern.website_name}</a></div>
          <div style={{ flex: 1 }}>
            <img src={`data:image/jpg;base64,${pattern.img}`} alt={pattern.website_name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
          </div>
          <select style={{ flex: 1 }} value={pattern.tag} onChange={(e) => handleChange(pattern.id, e.target.value)}>
            <option value="Forced Action">Forced Action</option>
            <option value="Misdirection">Misdirection</option>
            <option value="Not Dark Pattern">Not Dark Pattern</option>
            <option value="Obstruction">Obstruction</option>
            <option value="Scarcity">Scarcity</option>
            <option value="Sneaking">Sneaking</option>
            <option value="Social Proof">Social Proof</option>
            <option value="Urgency">Urgency</option>
          </select> 
          <div style={{ flex: 2 }}>{pattern.htmlcontent}</div>
          <div style={{ flex: 1 }}>
          <button onClick={() => handleApprove(pattern.id, pattern.website_name, pattern.img, pattern.htmlcontent, pattern.tag)}>Submit</button>
                    </div>
        </div>
      ))}
    </div>
  );
};

export default DarkPatternsList;
