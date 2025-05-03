import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const backendBaseUrl = 'http://localhost:5001/';

const Profile = () => {
  const { user } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.profilePhoto) {
      setProfilePhoto(
        user.profilePhoto.startsWith('http')
          ? user.profilePhoto
          : backendBaseUrl + user.profilePhoto
      );
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setUploading(true);
      setError('');

      const response = await axios.post('/api/users/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfilePhoto(
        response.data.photoUrl.startsWith('http')
          ? response.data.photoUrl
          : backendBaseUrl + response.data.photoUrl
      );
      setUploading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading photo');
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="photo-container">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo-placeholder">
                <span>No photo</span>
              </div>
            )}
          </div>

          <div className="upload-section">
            <label className="upload-button">
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>

        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 