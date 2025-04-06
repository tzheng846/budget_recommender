import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth.module.css';

const SignIn: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <p>ShopSense.</p>
        </div>
        <div className={styles.navMenu}>
          <ul>
            <li><a href="#" className={styles.active}>Account</a></li>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Explore</a></li>
          </ul>
        </div>
        <div className={styles.navButton}>
          <button 
            className={`${styles.btn} ${styles.whiteBtn}`} 
            onClick={() => loginWithRedirect()}
          >
            Sign In
          </button>
          <button 
            className={styles.btn} 
            onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className={styles.formBox}>
        <div className={styles.loginContainer}>
          <div className={styles.top}>
            <span>Welcome to ShopSense</span>
            <header>Smart Budget Management</header>
          </div>
          <div className={styles.content}>
            <p>Track your expenses, get insights, and make smarter financial decisions.</p>
            <button 
              className={styles.submit} 
              onClick={() => loginWithRedirect()}
            >
              Sign In with Auth0
            </button>
            <div className={styles.twoCol}>
              <p>New to ShopSense?</p>
              <button 
                className={`${styles.btn} ${styles.signupBtn}`}
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              >
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 