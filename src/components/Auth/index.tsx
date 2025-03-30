import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #128C7E;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #128C7E;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #128C7E;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0C6B5E;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Toggle = styled.button`
  background: none;
  border: none;
  color: #128C7E;
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
`;

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    if (!isLogin && !displayName) {
      setError('Display name is required for registration');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const payload = isLogin 
        ? { username, password } 
        : { username, password, displayName };
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      onLogin(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred during authentication';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContainer>
      <Logo>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 17.6127 0.662671 20.0799 1.82843 22.2172L0.344515 29.0207C0.209298 29.5284 0.727052 29.9659 1.2207 29.7555L7.64988 27.3041C9.82255 28.7596 12.3312 29.6308 15 30Z" fill="#25D366"/>
          <path d="M22.25 15.875C22.25 16.2202 22.1183 16.5514 21.884 16.7857C21.6496 17.02 21.3185 17.1517 20.9733 17.1517C20.6281 17.1517 20.2969 17.02 20.0626 16.7857C19.8283 16.5514 19.6965 16.2202 19.6965 15.875C19.6965 15.5298 19.8283 15.1986 20.0626 14.9643C20.2969 14.73 20.6281 14.5983 20.9733 14.5983C21.3185 14.5983 21.6496 14.73 21.884 14.9643C22.1183 15.1986 22.25 15.5298 22.25 15.875ZM16.5517 15.875C16.5517 16.2202 16.42 16.5514 16.1857 16.7857C15.9514 17.02 15.6202 17.1517 15.275 17.1517C14.9298 17.1517 14.5986 17.02 14.3643 16.7857C14.13 16.5514 13.9983 16.2202 13.9983 15.875C13.9983 15.5298 14.13 15.1986 14.3643 14.9643C14.5986 14.73 14.9298 14.5983 15.275 14.5983C15.6202 14.5983 15.9514 14.73 16.1857 14.9643C16.42 15.1986 16.5517 15.5298 16.5517 15.875ZM10.8535 15.875C10.8535 16.2202 10.7217 16.5514 10.4874 16.7857C10.2531 17.02 9.92194 17.1517 9.57673 17.1517C9.23152 17.1517 8.9004 17.02 8.66607 16.7857C8.43174 16.5514 8.3 16.2202 8.3 15.875C8.3 15.5298 8.43174 15.1986 8.66607 14.9643C8.9004 14.73 9.23152 14.5983 9.57673 14.5983C9.92194 14.5983 10.2531 14.73 10.4874 14.9643C10.7217 15.1986 10.8535 15.5298 10.8535 15.875Z" fill="white"/>
        </svg>
        {isLogin ? 'WhatsApp Login' : 'Create Account'}
      </Logo>
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        {!isLogin && (
          <Input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </Button>
      </Form>
      
      <Toggle onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </Toggle>
    </AuthContainer>
  );
};

export default Auth; 