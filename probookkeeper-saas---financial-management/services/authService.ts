
import { User } from '../types';
import { MOCK_USERS, AUTH_TOKEN_KEY } from '../constants';
import { simulateApiCall, simulateFindApiCall } from './api';

// In a real app, MOCK_USERS would not be accessed here.
// This service would make HTTP requests to a backend.

interface LoginCredentials {
  username: string;
  password?: string; // Password is used here for simulation only
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    console.log('Attempting login with:', credentials.username);
    // Simulate API call
    return simulateFindApiCall<User>(() => 
      MOCK_USERS.find(user => user.username === credentials.username && user.password === credentials.password),
      700, 
      0.1, // 10% chance of error
      'Invalid username or password.'
    ).then(user => {
        if (!user.isActive) {
            throw new Error('This user account is inactive. Please contact support.');
        }
        localStorage.setItem(AUTH_TOKEN_KEY, user.id);
        // Simulate updating last login on the "backend"
        const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            MOCK_USERS[userIndex].lastLogin = new Date().toISOString();
        }
        return user;
    });
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return simulateApiCall<void>(undefined, 200);
  },

  getCurrentUserOnAppLoad: async (): Promise<User | null> => {
    const storedUserId = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedUserId) {
      // In a real app, you'd verify the token with the backend here.
      // For simulation, we find the user from mock data.
      return simulateFindApiCall<User>(() => 
        MOCK_USERS.find(user => user.id === storedUserId && user.isActive), // Ensure user is active
        100 // quick check
      ).catch(() => {
        // If user not found or inactive, clear token
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return null;
      });
    }
    return Promise.resolve(null);
  },
};
