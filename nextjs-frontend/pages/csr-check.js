import { useState, useEffect } from 'react';

function CSRCheck() {
  const [currentTime, setCurrentTime] = useState('Loading...');

  // This runs only in the browser after the component mounts
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Client-Side Rendering Check Page</h1>
      
      <div style={{ 
        padding: '20px', 
        background: '#fff8e6', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Client-Side Generated Time:</h2>
        <p style={{ fontSize: '18px' }}><strong>Browser Time:</strong> {currentTime}</p>
        <p>
          <strong>If you see "Loading..." in the page source (View Page Source) but a timestamp in the browser, 
          then this is client-side rendering!</strong>
        </p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>How to verify CSR is working:</h3>
        <ol>
          <li>Look at the timestamp above</li>
          <li>Right-click on this page and select "View Page Source"</li>
          <li>Search for "Loading..." in the HTML source</li>
          <li>If you find "Loading..." in the source but see a timestamp in the browser, CSR is working!</li>
        </ol>
      </div>
    </div>
  );
}

export default CSRCheck;