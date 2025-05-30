import React, { useState, useRef } from 'react';
import '../styles/EditProfileModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUser, FaEnvelope, FaSave, FaTimes } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }) => {
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    profileImage: currentUser.profileImage || '',
    favoriteGenre: currentUser.favoriteGenre || 'Fantasy',
    readingGoal: '30 books per year',
    preferredFormat: 'Paperback'
  });
  const [previewImage, setPreviewImage] = useState(currentUser.profileImage || '');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.2 + (custom * 0.1),
        duration: 0.4
      }
    })
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="modal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Your Profile</h2>
              <motion.button 
                className="close-btn"
                onClick={onClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>
            
            <form onSubmit={handleSubmit} className="edit-profile-form">
              <motion.div 
                className="image-upload-section"
                variants={formItemVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <div className="profile-image-preview">
                  <img 
                    src={previewImage || '/default-avatar.png'} 
                    alt="Profile Preview" 
                  />
                  <motion.div 
                    className="image-overlay"
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                  >
                    <motion.button 
                      type="button" 
                      className="change-photo-btn"
                      onClick={() => fileInputRef.current.click()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCamera /> Change Photo
                    </motion.button>
                  </motion.div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </motion.div>

              <div className="form-sections">
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <motion.div 
                    className="form-group"
                    variants={formItemVariants}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                  >
                    <label htmlFor="username">
                      <FaUser /> Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                    />
                  </motion.div>

                  <motion.div 
                    className="form-group"
                    variants={formItemVariants}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                  >
                    <label htmlFor="email">
                      <FaEnvelope /> Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                  </motion.div>
                </div>

                <div className="form-section">
                  <h3>Reading Preferences</h3>
                  <motion.div 
                    className="form-group"
                    variants={formItemVariants}
                    custom={3}
                    initial="hidden"
                    animate="visible"
                  >
                    <label htmlFor="favoriteGenre">Favorite Genre</label>
                    <select
                      id="favoriteGenre"
                      name="favoriteGenre"
                      value={formData.favoriteGenre}
                      onChange={handleInputChange}
                    >
                      <option value="Fantasy">Fantasy</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Non-fiction">Non-fiction</option>
                    </select>
                  </motion.div>

                  <motion.div 
                    className="form-group"
                    variants={formItemVariants}
                    custom={4}
                    initial="hidden"
                    animate="visible"
                  >
                    <label htmlFor="preferredFormat">Preferred Format</label>
                    <select
                      id="preferredFormat"
                      name="preferredFormat"
                      value={formData.preferredFormat}
                      onChange={handleInputChange}
                    >
                      <option value="Paperback">Paperback</option>
                      <option value="Hardcover">Hardcover</option>
                      <option value="E-book">E-book</option>
                      <option value="Audiobook">Audiobook</option>
                    </select>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                className="modal-footer"
                variants={formItemVariants}
                custom={5}
                initial="hidden"
                animate="visible"
              >
                <motion.button 
                  type="button" 
                  className="cancel-btn"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes /> Cancel
                </motion.button>
                <motion.button 
                  type="submit" 
                  className="save-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave /> Save Changes
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal; 