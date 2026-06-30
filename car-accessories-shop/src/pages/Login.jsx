import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength logic
  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ff4d4d', '#ff944d', '#ffd24d', '#85e085', '#33cc33'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      if (email.includes('admin')) {
        toast.error('Admin accounts must use the secure admin portal.');
        setLoading(false);
        return;
      }
      
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Invalid email or password');
      }
    } else {
      if (!name.trim()) {
        toast.error('Name is required');
        setLoading(false);
        return;
      }
      const result = await signup(name, email, password);
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="premium-login-container">
      <div className="premium-login-card">
        <div className="login-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to continue your journey' : 'Join us for exclusive premium auto gear'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="premium-form">
          <div className={`form-fields ${!isLogin ? 'signup-mode' : ''}`}>
            {!isLogin && (
              <div className="input-group">
                <i className="input-icon">👤</i>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Full Name" 
                  required={!isLogin} 
                />
              </div>
            )}
            
            <div className="input-group">
              <i className="input-icon">✉️</i>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address" 
                required 
              />
            </div>
            
            <div className="input-group">
              <i className="input-icon">🔒</i>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
              />
            </div>

            {!isLogin && password && (
              <div className="password-strength-container">
                <div className="strength-bar-wrapper">
                  <div 
                    className="strength-bar" 
                    style={{ 
                      width: `${(strength / 4) * 100}%`,
                      backgroundColor: strengthColors[strength]
                    }} 
                  />
                </div>
                <span className="strength-label" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="premium-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="toggle-mode">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setPassword(''); }}
              className="toggle-btn"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
