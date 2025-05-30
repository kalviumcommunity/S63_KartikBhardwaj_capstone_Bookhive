import { useState, useEffect } from 'react';
import styles from '../styles/LoadingAvatar.module.css';

// Array of interesting book facts and quotes to display while loading
const LOADING_MESSAGES = [
  "Did you know? The longest book ever published is 'Remembrance of Things Past' by Marcel Proust, with 9,609,000 characters.",
  "The word 'library' comes from the Latin word 'liber', meaning 'book'.",
  "The most expensive book ever sold was Leonardo da Vinci's Codex Leicester, purchased by Bill Gates for $30.8 million.",
  "A single medieval manuscript required the skins of up to 500 animals to create the parchment.",
  "The world's largest library is the Library of Congress with more than 170 million items.",
  "The first printed book in English was 'The Recuyell of the Historyes of Troye' in 1473.",
  "The three most read books in the world are The Holy Bible, Quotations from Chairman Mao, and Harry Potter.",
  "The word 'bookworm' originally referred to insects that feed on books.",
  "'The Lord of the Rings' took J.R.R. Tolkien 12 years to complete.",
  "The first e-book is considered to be the US Declaration of Independence, digitized in 1971.",
  "The average reader can finish a 300-page book in about 5 hours.",
  "The first public library in the US opened in 1790 in Franklin, Massachusetts.",
  "Shakespeare invented over 1,700 words that we still use today.",
  "The first book printed in America was 'The Bay Psalm Book' in 1640.",
  "The world's smallest book is 'Teeny Ted from Turnip Town', measuring just 0.07 mm × 0.10 mm."
];

const LoadingAvatar = ({ progress = 0, message = "Loading..." }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Change the message every few seconds
  useEffect(() => {
    // Show initial message after a short delay
    const initialTimer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
      setCurrentMessage(LOADING_MESSAGES[randomIndex]);
      setShowMessage(true);
    }, 1000);
    
    // Set up interval to change messages
    const messageInterval = setInterval(() => {
      setShowMessage(false);
      
      // Wait for fade out animation to complete before changing message
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
        setCurrentMessage(LOADING_MESSAGES[randomIndex]);
        setShowMessage(true);
      }, 500);
    }, 6000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(messageInterval);
    };
  }, []);
  
  return (
    <div className={styles.loading_avatar_container}>
      <div className={styles.loading_progress_bar}>
        <div 
          className={styles.loading_progress_fill} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className={styles.avatar_scene}>
        {/* Animated book character */}
        <div className={styles.book_character}>
          <div className={styles.book_body}>
            <div className={styles.book_cover}></div>
            <div className={styles.book_pages}></div>
            <div className={styles.book_binding}></div>
          </div>
          <div className={styles.character_face}>
            <div className={styles.character_eyes}>
              <div className={`${styles.eye} ${styles.left}`}></div>
              <div className={`${styles.eye} ${styles.right}`}></div>
            </div>
            <div className={styles.character_mouth}></div>
          </div>
          <div className={styles.character_arms}>
            <div className={`${styles.arm} ${styles.arm_left}`}></div>
            <div className={`${styles.arm} ${styles.arm_right}`}></div>
          </div>
          <div className={styles.character_legs}>
            <div className={`${styles.leg} ${styles.leg_left}`}></div>
            <div className={`${styles.leg} ${styles.leg_right}`}></div>
          </div>
        </div>
        
        {/* Speech bubble with random book facts */}
        <div className={`${styles.speech_bubble} ${showMessage ? styles.visible : ''}`}>
          <p>{currentMessage}</p>
        </div>
      </div>
      
      <div className={styles.loading_message}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingAvatar;