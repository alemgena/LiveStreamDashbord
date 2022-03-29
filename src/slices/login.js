import { createSlice } from '@reduxjs/toolkit';
export const loginSlice = createSlice({
  name: 'loginAdmin',
  initialState: {
    inputValues: {
      user_identifier: '',
      password: '',
    },
    inputErrors: {
      user_IdentifierErr: '',
      passwordErr: '',
    },
    isLoading: false,
    isUserLogged: false,
    loggedUser: localStorage.getItem('loginInfo')
      ? JSON.parse(localStorage.getItem('loginInfo'))
      : null,
    userInformation: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  },
  reducers: {
    setUser_Identifier: (state, action) => {
      state.inputValues.user_identifier = action.payload;
    },
    setPassword: (state, action) => {
      state.inputValues.password = action.payload;
    },
    setIsUserLogged: (state, action) => {
      state.isUserLogged = action.payload;
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setUserInformation: (state, action) => {
      state.userInformation = action.payload;
    },
    setEmailErr: (state, action) => {
      state.inputErrors.user_IdentifierErr = action.payload;
    },
    setPasswordErr: (state, action) => {
      state.inputErrors.passwordErr = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});
