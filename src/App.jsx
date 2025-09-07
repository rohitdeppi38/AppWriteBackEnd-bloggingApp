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
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logOut());
        }
      })
      .catch(() => dispatch(logOut()))
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
    <div className="min-h-screen flex flex-col justify-between bg-linear-0 via-blue-50 relative overflow-hidden text-gray-100">
      {/* Subtle neon grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.08)_1px,_transparent_1px),linear-gradient(-45deg,_rgba(255,255,255,0.08)_1px,_transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none"></div>

      {/* Content Wrapper with glass effect */}
      <div className="flex flex-col min-h-screen relative z-10">
        <header className="backdrop-blur-md bg-white/10 border-b border-white/10 shadow-lg">
          <Header />
        </header>

       <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-md border border-gray-100 rounded-2xl mx-4 md:mx-8 lg:mx-16 p-6 md:p-10 lg:p-12 overflow-auto">
  <Outlet />
</main>



        <footer className="backdrop-blur-md bg-white/10 border-t border-white/10 shadow-lg">
          <Footer />
        </footer>
      </div>
    </div>
  ) : (
    // Glassy loading screen
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900">
      <div className="backdrop-blur-xl bg-white/10 px-10 py-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 rounded-full blur-lg bg-pink-500 opacity-40 animate-pulse"></div>
        </div>
        <p className="mt-5 text-pink-200 font-semibold tracking-wide text-lg">Loading...</p>
      </div>
    </div>
  );
}

export default App;
