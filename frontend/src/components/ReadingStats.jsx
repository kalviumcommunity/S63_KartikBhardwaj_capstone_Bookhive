import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import '../styles/ReadingStats.css';

const stats = [
  {
    id: 1,
    title: 'Books Read',
    value: 12500,
    icon: '📚',
    color: '#0984e3'
  },
  {
    id: 2,
    title: 'Active Readers',
    value: 8500,
    icon: '👥',
    color: '#00b894'
  },
  {
    id: 3,
    title: 'Reviews Posted',
    value: 45000,
    icon: '✍️',
    color: '#fdcb6e'
  },
  {
    id: 4,
    title: 'Reading Hours',
    value: 250000,
    icon: '⏰',
    color: '#e17055'
  }
];

const ReadingStats = () => {
  const sectionRef = useRef(null);

  return (
    <section className="reading-stats" ref={sectionRef}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Reading Community Stats
      </motion.h2>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  separator=","
                  enableScrollSpy
                  scrollSpyOnce
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="stats-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p>Join our growing community of readers today!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="join-btn"
        >
          Join Now
        </motion.button>
      </motion.div>
    </section>
  );
};

export default ReadingStats; 