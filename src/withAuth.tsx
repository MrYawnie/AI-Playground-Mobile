import React, { useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const withAuth = (WrappedComponent: React.FC) => {
  const WithAuth: React.FC = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          setLoading(false);
          history.push('/login');
        }
      });

      return () => {
        unsubscribe();
      };
    }, [history]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
