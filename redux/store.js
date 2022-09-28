import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});
