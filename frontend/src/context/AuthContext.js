import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
      };
    case 'REGISTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      authService.verifyToken(token)
        .then(user => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token }
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      await authService.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      dispatch({
        type: 'REGISTER_ERROR',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};