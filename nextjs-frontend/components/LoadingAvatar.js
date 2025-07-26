import React from 'react';
import styles from '../styles/LoadingAvatar.module.css';

const LoadingAvatar = ({ progress = 0, message = "Loading..." }) => {
  
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

      </div>
      
      <div className={styles.loading_message}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingAvatar;