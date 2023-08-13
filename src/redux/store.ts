import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import postSlice from "./features/postSlice";
/* ====================================================== */

const reducer = combineReducers({
  auth: authSlice,
  post: postSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
