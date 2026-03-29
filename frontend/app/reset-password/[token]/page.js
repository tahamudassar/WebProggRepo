'use client'; // Ensures the component is client-side only

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import { color } from 'framer-motion';

const ResetPassword = ({ params }) => {
  const [token, setToken] = useState(null); // Initialize the token state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter(); // Initialize the router to handle redirection

  // We use useEffect to handle token change
  useEffect(() => {
    if (params && params.token) {
      setToken(params.token); // Set token from URL params
    }
  }, [params]); // Dependency on params

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }

    const data = {
      token: token,  // Token from the URL
      new_password: newPassword,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/passwordResetConfirm/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Your password has been successfully reset.');
        setError('');
        
        // Redirect to login page after successful password reset
        router.push('/login'); // Adjust the path if needed
      } else {
        setError(result.detail || 'Something went wrong. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      setError('Failed to reset password. Please try again later.');
      setSuccess('');
    }
  };

  // If the token is not available yet, display a loading message
  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1>Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button type="submit" style={styles.submitButton}>Reset Password</button>
        </form>
      </div>
    </div>
  );
};

// Styles for centering the content
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    backgroundColor: 'black', // Light background color for the page
  },
  formContainer: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '3a3B3C',
    width: '100%',
    maxWidth: '400px', // Limit form width
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    color: 'white',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    border: 'none',
    color: 'white',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  }
};

export default ResetPassword;
