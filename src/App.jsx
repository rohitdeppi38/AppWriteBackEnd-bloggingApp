import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth.js";
import { login, logOut } from "./store/authslice.js";
import { Outlet } from "react-router-dom";

import Footer from "./components/footer/footer.jsx";
import Header from "./components/header/Header.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then(userData => {
        if (userData) {
          dispatch(login(userData)); // ✅ fixed shape
        } else {
          dispatch(logOut());
        }
      })
      .catch(() => dispatch(logOut()))
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
    <div className="min-h-screen flex flex-col justify-between bg-gray-400">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null;
}

export default App;
