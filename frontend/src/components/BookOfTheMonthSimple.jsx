import React from 'react';
import { motion } from 'framer-motion';

const BookOfTheMonthSimple = () => {
  return (
    <section style={{ padding: '80px 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '20px' }}>
            ✨ Book of the Month - Enhanced!
          </h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
            The new animations and effects are working! 🎉
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          style={{
            marginTop: '40px',
            padding: '40px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            🚀 Enhanced Features:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>
            <li>✅ Smooth animations with Framer Motion</li>
            <li>✅ Interactive hover effects</li>
            <li>✅ Staggered loading animations</li>
            <li>✅ 3D book cover effects</li>
            <li>✅ Floating star particles</li>
            <li>✅ Enhanced button animations</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default BookOfTheMonthSimple;