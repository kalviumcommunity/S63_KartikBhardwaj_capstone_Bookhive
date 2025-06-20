import React from 'react';

const CommunityCTA = () => {
  return (
    <section className="community-cta" style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>
          Join Our Reading Community
        </h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9' }}>
          Connect with fellow book lovers, share reviews, and discover your next favorite read
        </p>
        <button style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid white',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '50px',
          fontSize: '1.125rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Get Started Today
        </button>
      </div>
    </section>
  );
};

export default CommunityCTA;