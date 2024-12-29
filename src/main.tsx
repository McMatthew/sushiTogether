import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import React from "react";
import ThemeProvider from "./ThemeProvider.tsx";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import OrderPage from "./pages/OrderPage.tsx";
import "./main.css";
import { OrderContextProvider } from "./context/orderContext.tsx";
import FirebaseDbProvider from "./context/firebaseComponent.tsx";
import "firebase/database";
import { FirebaseAppProvider } from "reactfire";
import LobbyPage from "./pages/LobbyPage.tsx";

const firebaseConfig = {
  apiKey: "AIzaSyD6paU0cIUR7Jxw4pIcG09LgpA8O6Ht6HQ",
  authDomain: "sushi-togheter.firebaseapp.com",
  databaseURL: "https://sushi-togheter-default-rtdb.firebaseio.com",
  projectId: "sushi-togheter",
  storageBucket: "sushi-togheter.appspot.com",
  messagingSenderId: "938795302682",
  appId: "1:938795302682:web:5c387435a08d374087b6a3",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          <FirebaseDbProvider>
            <OrderContextProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/session/:code" element={<OrderPage />} />
                <Route path="/session/:code/lobby" element={<LobbyPage />} />
              </Routes>
            </OrderContextProvider>
          </FirebaseDbProvider>
        </FirebaseAppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
