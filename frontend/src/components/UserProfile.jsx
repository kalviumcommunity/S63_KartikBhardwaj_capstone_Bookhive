import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import '../styles/UserProfile.css';
import { FaUser, FaEnvelope, FaIdBadge, FaUserTag, FaClock } from 'react-icons/fa';

const UserProfile = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.displayName || 'Hanuman ji',
    email: user?.email || 'hanuman@gmail.com',
    userId: user?.uid || 'Not set',
    accountType: user?.role || 'user',
    lastLogin: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A',
    profileImage: user?.photoURL || '/default-avatar.png'
  });

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = (formData) => {
    setUserInfo(prev => ({
      ...prev,
      username: formData.username,
      email: formData.email,
      profileImage: formData.profileImage
    }));

    localStorage.setItem('userProfile', JSON.stringify({
      ...userInfo,
      username: formData.username,
      email: formData.email,
      profileImage: formData.profileImage
    }));
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserInfo(prev => ({
        ...prev,
        ...JSON.parse(savedProfile)
      }));
  }
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-card-modern">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <img 
              src={userInfo.profileImage} 
              alt={userInfo.username} 
              className="profile-avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
          <h1 className="profile-username">{userInfo.username}</h1>
          <button
            className="profile-edit-btn-modern"
            onClick={handleEditProfile}
            aria-label="Edit Profile"
          >
            Edit Profile
          </button>
        </div>
        <div className="profile-info-list-modern">
          <div className="profile-info-item-modern">
            <FaIdBadge className="profile-info-icon" />
            <span className="profile-info-label">User ID:</span>
            <span className="profile-info-value">{userInfo.userId}</span>
          </div>
          <div className="profile-info-item-modern">
            <FaEnvelope className="profile-info-icon" />
            <span className="profile-info-label">Email:</span>
            <span className="profile-info-value">{userInfo.email}</span>
          </div>
          <div className="profile-info-item-modern">
            <FaUserTag className="profile-info-icon" />
            <span className="profile-info-label">Account Type:</span>
            <span className="profile-info-value">{userInfo.accountType}</span>
          </div>
          <div className="profile-info-item-modern">
            <FaClock className="profile-info-icon" />
            <span className="profile-info-label">Last Login:</span>
            <span className="profile-info-value">{userInfo.lastLogin}</span>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={userInfo}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfile; 