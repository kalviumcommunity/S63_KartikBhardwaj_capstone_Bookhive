import React, { useState } from 'react';
import BookDetailsModal from './BookDetailsModal';
import './ReviewCard.css';

const ReviewCard = ({ review, book }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <img
          src={review.userAvatar || '/default-avatar.png'}
          alt="Profile"
          className="review-card-avatar"
        />
        <div className="review-card-user-info">
          <div className="review-card-username">{review.username}</div>
        </div>
      </div>
      <div className="review-card-rating-row">
        <div className="review-card-stars">
          {[1,2,3,4,5].map((star) => (
            <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>★</span>
          ))}
        </div>
        <span className="review-card-reviewing">reviewing</span>
        <span className="review-card-book-name" onClick={handleBookClick}>{book.title}</span>
      </div>
      <div className="review-card-text">{review.text}</div>
      <hr className="review-card-divider" />
      <div className="review-card-footer">
        <span className="review-card-date">Posted on {new Date(review.date).toLocaleDateString()}</span>
        <div className="review-card-actions">
          <span className="review-card-action">Reply</span>
          <span className="review-card-action">Share</span>
          <span className="review-card-action">Report</span>
        </div>
      </div>
      {isModalOpen && (
        <BookDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={book}
        />
      )}
    </div>
  );
};

export default ReviewCard; 