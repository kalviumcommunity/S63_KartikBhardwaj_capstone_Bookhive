import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import '../styles/UserProfile.css';

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
      <div className="profile-container">
        <div className="profile-header-card">
          <div className="profile-image-container">
            <img 
              src={userInfo.profileImage} 
              alt={userInfo.username} 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
          <div className="profile-header-info">
            <h1>{userInfo.username}</h1>
                <button
              className="edit-profile-btn" 
              onClick={handleEditProfile}
              aria-label="Edit Profile"
                >
                  Edit Profile
                </button>
            </div>
          </div>

        <div className="account-info-card">
          <h2>Account Informations</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">User id :</span>
              <span className="info-value">{userInfo.userId}</span>
              </div>
            <div className="info-item">
              <span className="info-label">Email :</span>
              <span className="info-value">{userInfo.email}</span>
              </div>
            <div className="info-item">
              <span className="info-label">Account Type :</span>
              <span className="info-value">{userInfo.accountType}</span>
              </div>
            <div className="info-item">
              <span className="info-label">Last Login :</span>
              <span className="info-value">{userInfo.lastLogin}</span>
            </div>
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