import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const loadUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  } catch (error) {
    console.error('Failed to parse user from local storage', error);
  }
  return null;
};

const initialUser = loadUserFromStorage();

const initialState: AuthState = {
  isAuthenticated: !!initialUser,
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('authUser');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
