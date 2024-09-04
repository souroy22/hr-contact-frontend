import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./global/globalReducer";
import userReducer from "./user/userReducer";

const store = configureStore({
  reducer: {
    globalReducer,
    userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
