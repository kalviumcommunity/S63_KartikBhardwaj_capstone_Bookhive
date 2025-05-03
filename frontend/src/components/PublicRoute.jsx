import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Spinner.css';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/profile" />;
  }

  return children;
};

export default PublicRoute; 