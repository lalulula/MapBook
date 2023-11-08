import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  isAuthenticated: false,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state, action) => {
      state.user = null;
    },
    //To access in FE:
    // const userInfo = useSelector(getUser);
    // const user = userInfo;
    // user.payload.user;
    getUser: (state, action) => {
      return state.user;
    },
  },
});
export const { login, logout, getUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
