import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import globalReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { apiSlice } from "./api/apiSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

// creation of global state to store data localy and handle Api calls
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, globalReducer);
const store = configureStore({
  reducer: {
    global: persistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

/*
const store = configureStore({
  reducer: { global: globalReducer, [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});
*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
