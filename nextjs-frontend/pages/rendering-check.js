import Link from 'next/link';

function RenderingCheck() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Next.js Rendering Methods Check</h1>
      
      <p style={{ marginBottom: '20px' }}>
        Click on the links below to test different rendering methods in Next.js:
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link 
          href="/ssr-check"
          style={{
            padding: '15px',
            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Server-Side Rendering (SSR) Test
        </Link>
        
        <Link 
          href="/csr-check"
          style={{
            padding: '15px',
            background: 'linear-gradient(135deg, #f12711, #f5af19)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Client-Side Rendering (CSR) Test
        </Link>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f4f8', borderRadius: '8px' }}>
        <h2>How to check if SSR is working:</h2>
        <ol style={{ lineHeight: '1.6' }}>
          <li>Click on the SSR Test link above</li>
          <li>On the SSR page, right-click and select "View Page Source"</li>
          <li>Look for the timestamp in the HTML source</li>
          <li>If you see the timestamp in the source, SSR is working correctly!</li>
        </ol>
        
        <h2 style={{ marginTop: '20px' }}>How to check if CSR is working:</h2>
        <ol style={{ lineHeight: '1.6' }}>
          <li>Click on the CSR Test link above</li>
          <li>On the CSR page, right-click and select "View Page Source"</li>
          <li>Look for "Loading..." in the HTML source</li>
          <li>If you see "Loading..." in the source but a timestamp in the browser, CSR is working!</li>
        </ol>
      </div>
    </div>
  );
}

export default RenderingCheck;