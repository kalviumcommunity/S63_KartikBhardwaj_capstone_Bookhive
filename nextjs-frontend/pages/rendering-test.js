import Head from 'next/head';
import Link from 'next/link';

export default function RenderingTest() {
  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>Next.js Rendering Methods Test</title>
        <meta name="description" content="Testing different rendering methods in Next.js" />
      </Head>

      <main style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#6a11cb', marginBottom: '1rem' }}>Next.js Rendering Methods Test</h1>
        
        <p style={{ marginBottom: '2rem' }}>
          This page helps you understand and verify the different rendering methods in Next.js.
          Click on each link below to see the different rendering methods in action.
        </p>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr', marginBottom: '2rem' }}>
          <Link 
            href="/ssr-test"
            style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #6a11cb, #2575fc)', 
              color: 'white', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            Server-Side Rendering (SSR) Test
          </Link>
          
          <Link 
            href="/ssg-test"
            style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #11998e, #38ef7d)', 
              color: 'white', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            Static Site Generation (SSG) Test
          </Link>
          
          <Link 
            href="/csr-test"
            style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #f12711, #f5af19)', 
              color: 'white', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            Client-Side Rendering (CSR) Test
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>How to Verify Each Rendering Method:</h2>
          <ol style={{ lineHeight: '1.6' }}>
            <li>
              <strong>Server-Side Rendering (SSR):</strong> The HTML is generated on the server for each request. 
              View the page source to see the data already included in the HTML. Refresh the page to see the data change.
            </li>
            <li>
              <strong>Static Site Generation (SSG):</strong> The HTML is generated at build time. 
              View the page source to see the build-time data in the HTML. Client-side data will not be in the source.
            </li>
            <li>
              <strong>Client-Side Rendering (CSR):</strong> The HTML is minimal and data is loaded by JavaScript in the browser. 
              View the page source to see that no data is included in the initial HTML.
            </li>
          </ol>
        </div>

        <div style={{ padding: '1rem', background: '#e6fffa', borderRadius: '4px', borderLeft: '4px solid #38b2ac' }}>
          <p>
            <strong>Note:</strong> Understanding these rendering methods is crucial for optimizing your Next.js application.
            Use SSR for pages that need fresh data on each request, SSG for pages that can be built ahead of time,
            and CSR for highly interactive components or when data is user-specific.
          </p>
        </div>
      </main>
    </div>
  );
}