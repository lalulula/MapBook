import React from "react";
import "semantic-ui-css/semantic.min.css";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { GoogleOAuthProvider } from "@react-oauth/google";

import store from "./app/store";

export let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId = {process.env.REACT_APP_CLIENT_ID}>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);
