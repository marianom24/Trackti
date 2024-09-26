import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('access_token');

  
  if (!accessToken) {
    return navigate("/login");
  }
  
  return children;
};

export default ProtectedRoute;