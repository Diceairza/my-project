
import { User } from '../types';
import { MOCK_USERS } from '../constants'; // Still using mock for simulation
import { simulateApiCall, simulateFindApiCall } from './api';

let localUsers = [...MOCK_USERS]; // Simulate a mutable data store

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return simulateApiCall<User[]>(localUsers.map(u => ({...u, password: ''}))); // Don't send passwords to client
  },

  getUserById: async (id: string): Promise<User | null> => {
    return simulateFindApiCall<User>(() => localUsers.find(user => user.id === id), 300, 0.05)
      .then(user => user ? {...user, password: ''} : null);
  },

  createUser: async (userData: Omit<User, 'id' | 'lastLogin'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      isActive: userData.isActive === undefined ? true : userData.isActive,
      lastLogin: undefined, // New users haven't logged in yet
    };
    // Password should be handled by backend (hashed). Here it's directly assigned.
    localUsers.push(newUser);
    return simulateApiCall<User>({...newUser, password: ''});
  },

  updateUser: async (userId: string, userData: Partial<Omit<User, 'id' | 'password'>>): Promise<User | null> => {
    const userIndex = localUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      // Important: Never update password directly like this from client data without proper checks/flow.
      // This simulation assumes password changes are handled separately or are not part of this userData.
      const updatedUser = { ...localUsers[userIndex], ...userData };
      localUsers[userIndex] = updatedUser;
      return simulateApiCall<User>({...updatedUser, password: ''});
    }
    return simulateApiCall<User | null>(null, 300, 0);
  },

  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    const initialLength = localUsers.length;
    localUsers = localUsers.filter(user => user.id !== userId);
    if (localUsers.length < initialLength) {
      return simulateApiCall<{ success: boolean }>({ success: true });
    }
    return simulateApiCall<{ success: boolean }>({ success: false }, 300, 0);
  },

  forcePasswordReset: async (userId: string): Promise<{success: boolean, newTemporaryPassword?: string}> => {
      // THIS IS A SIMULATION. In a real app, the backend would generate a secure temporary password or reset link.
      const userIndex = localUsers.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
          const tempPassword = `Temp${Math.random().toString(36).slice(-6)}`;
          localUsers[userIndex].password = tempPassword; // Update "backend" password
          console.warn(`User ${localUsers[userIndex].username} password reset to: ${tempPassword} (SIMULATION ONLY)`);
          return simulateApiCall<{success: boolean, newTemporaryPassword?: string}>({success: true, newTemporaryPassword: tempPassword});
      }
      return simulateApiCall<{success: boolean}>({success: false}, 300, 0);
  }
};
