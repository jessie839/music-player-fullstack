import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
   isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setLoading: (state, action) => {
  state.isLoading = action.payload;
},

setFavourites: (state, action) => {
  if (state.user) {
    state.user.favourites = action.payload; 
  }
},


toggleFavourite: (state, action) => {
  if (!state.user) return;
  const song = action.payload;
  const favourites = state.user.favourites || [];
  const exists = favourites.find(fav => fav.id === song.id);

  if (exists) {

    state.user.favourites = favourites.filter(fav => fav.id !== song.id);
  } else {

    state.user.favourites = [...favourites, song];
  }
},
    setUser: (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.isLoading = false;
  state.error = null;

  if (action.payload.token) {
    localStorage.setItem("token", action.payload.token);
  }
},

setError: (state, action) => {
  state.error = action.payload;
  state.isLoading = false;
},
logout: (state) => {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    state.error = null;
    localStorage.removeItem("token");
},


updateFavourites: (state, action) => {
  if (!state.user) return;

  const song = action.payload;
  const exists = state.user.favourites?.some(fav => fav.id === song.id);
  if (!exists) {
    state.user = {
      ...state.user,
      favourites: [...(state.user.favourites || []), song]
    };
  }
},



clearError: (state) => {
    state.error = null;
},

  },
});
export const {
  setLoading,
  setUser,
  setError,
  logout,
  clearError,
  updateFavourites,
} = authSlice.actions;

export default authSlice.reducer;