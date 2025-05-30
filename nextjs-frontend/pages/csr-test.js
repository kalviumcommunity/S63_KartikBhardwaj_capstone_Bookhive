import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function CSRTest() {
  const [clientTime, setClientTime] = useState('Loading...');
  const [clientRandomNumber, setClientRandomNumber] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  // This runs only on the client after the component mounts
  useEffect(() => {
    // Simulate a network request
    setTimeout(() => {
      setClientTime(new Date().toLocaleString());
      setClientRandomNumber(Math.floor(Math.random() * 10000).toString());
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>Client-Side Rendering Test Page</title>
        <meta name="description" content="Testing Client-Side Rendering" />
      </Head>

      <main style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#6a11cb', marginBottom: '1rem' }}>Client-Side Rendering Test</h1>
        
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Loading data...</p>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fff8e6', borderRadius: '4px' }}>
            <h2>Client-Generated Data:</h2>
            <p><strong>Client Time:</strong> {clientTime}</p>
            <p><strong>Client Random Number:</strong> {clientRandomNumber}</p>
            <p><strong>This data was generated entirely in your browser!</strong></p>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h2>How to Verify Client-Side Rendering is Working:</h2>
          <ol style={{ lineHeight: '1.6' }}>
            <li>View the page source (right-click and select "View Page Source")</li>
            <li>You should NOT see the client time and client random number in the HTML source</li>
            <li>You should see "Loading..." in the source instead</li>
            <li>The data is only populated after JavaScript runs in your browser</li>
            <li>If you disable JavaScript, you would not see the actual data</li>
          </ol>
        </div>

        <div style={{ padding: '1rem', background: '#e6fffa', borderRadius: '4px', borderLeft: '4px solid #38b2ac' }}>
          <p>
            <strong>Note:</strong> This page demonstrates Client-Side Rendering (CSR). All the data is 
            generated in the browser after the page loads. This is different from SSR where the server 
            generates the HTML with the data before sending it to the browser.
          </p>
        </div>
      </main>
    </div>
  );
}