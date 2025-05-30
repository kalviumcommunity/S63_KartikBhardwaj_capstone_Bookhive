function SSRCheck({ currentTime }) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>SSR Check Page</h1>
      
      <div style={{ 
        padding: '20px', 
        background: '#f0f4f8', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Server-Side Generated Time:</h2>
        <p style={{ fontSize: '18px' }}><strong>Server Time:</strong> {currentTime}</p>
        <p>
          <strong>If you see a timestamp above and it appears in the page source (View Page Source), 
          then SSR is working correctly!</strong>
        </p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>How to verify SSR is working:</h3>
        <ol>
          <li>Look at the timestamp above</li>
          <li>Right-click on this page and select "View Page Source"</li>
          <li>Search for the timestamp in the HTML source</li>
          <li>If you find the timestamp in the source, SSR is working!</li>
        </ol>
      </div>
    </div>
  );
}

// This function runs on the server for every request
export async function getServerSideProps() {
  // Generate current time on the server
  const currentTime = new Date().toLocaleString();
  
  // Return the data as props
  return {
    props: {
      currentTime,
    },
  };
}

export default SSRCheck;