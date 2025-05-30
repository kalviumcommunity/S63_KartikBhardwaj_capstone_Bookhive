import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function SSGTest({ buildTime, buildRandomNumber }) {
  const [clientTime, setClientTime] = useState('Loading...');
  const [clientRandomNumber, setClientRandomNumber] = useState(null);

  // This runs only on the client after the component mounts
  useEffect(() => {
    setClientTime(new Date().toLocaleString());
    setClientRandomNumber(Math.floor(Math.random() * 10000));
  }, []);

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>Static Generation Test Page</title>
        <meta name="description" content="Testing Static Site Generation" />
      </Head>

      <main style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#6a11cb', marginBottom: '1rem' }}>Static Generation Test</h1>
        
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '4px' }}>
          <h2>Server-Generated Data (at build time):</h2>
          <p><strong>Build Time:</strong> {buildTime}</p>
          <p><strong>Build Random Number:</strong> {buildRandomNumber}</p>
          <p><strong>This data was generated on the server at build time!</strong></p>
        </div>

        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fff8e6', borderRadius: '4px' }}>
          <h2>Client-Generated Data:</h2>
          <p><strong>Client Time:</strong> {clientTime}</p>
          <p><strong>Client Random Number:</strong> {clientRandomNumber}</p>
          <p><strong>This data was generated in your browser!</strong></p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>How to Verify Static Generation is Working:</h2>
          <ol style={{ lineHeight: '1.6' }}>
            <li>View the page source (right-click and select "View Page Source")</li>
            <li>You should see the build time and build random number in the HTML</li>
            <li>You should NOT see the client time and client random number in the HTML source</li>
            <li>If you refresh the page, the build time will stay the same, but client time will update</li>
          </ol>
        </div>

        <div style={{ padding: '1rem', background: '#e6fffa', borderRadius: '4px', borderLeft: '4px solid #38b2ac' }}>
          <p>
            <strong>Note:</strong> This page demonstrates Static Site Generation (SSG). The build time data 
            is generated at build time and remains the same until the next deployment. The client data is 
            generated in the browser each time you load the page.
          </p>
        </div>
      </main>
    </div>
  );
}

// This function runs at build time
export async function getStaticProps() {
  // Generate data at build time
  const buildTime = new Date().toLocaleString();
  const buildRandomNumber = Math.floor(Math.random() * 10000);

  // Return the data as props
  return {
    props: {
      buildTime,
      buildRandomNumber,
    },
    // Regenerate the page at most once per hour
    revalidate: 3600,
  };
}