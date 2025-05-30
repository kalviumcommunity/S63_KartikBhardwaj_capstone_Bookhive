import Head from 'next/head';

export default function SSRTest({ serverTime, randomNumber }) {
  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>SSR Test Page</title>
        <meta name="description" content="Testing Server-Side Rendering" />
      </Head>

      <main style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#6a11cb', marginBottom: '1rem' }}>Server-Side Rendering Test</h1>
        
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '4px' }}>
          <h2>Server-Generated Data:</h2>
          <p><strong>Server Time:</strong> {serverTime}</p>
          <p><strong>Random Number:</strong> {randomNumber}</p>
          <p><strong>This data was generated on the server at build/request time!</strong></p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>How to Verify SSR is Working:</h2>
          <ol style={{ lineHeight: '1.6' }}>
            <li>View the page source (right-click and select "View Page Source")</li>
            <li>Look for the server time and random number in the HTML</li>
            <li>If you can see these values in the source HTML, SSR is working!</li>
            <li>If you refresh the page, the server time should update (with getServerSideProps)</li>
          </ol>
        </div>

        <div style={{ padding: '1rem', background: '#e6fffa', borderRadius: '4px', borderLeft: '4px solid #38b2ac' }}>
          <p>
            <strong>Note:</strong> This page demonstrates that Next.js is rendering content on the server 
            before sending it to the browser. This is different from client-side rendering where the browser 
            would receive an empty shell and then JavaScript would populate the content.
          </p>
        </div>
      </main>
    </div>
  );
}

// This function runs on the server for every request
export async function getServerSideProps() {
  // Generate data on the server
  const serverTime = new Date().toLocaleString();
  const randomNumber = Math.floor(Math.random() * 10000);

  // Return the data as props
  return {
    props: {
      serverTime,
      randomNumber,
    },
  };
}