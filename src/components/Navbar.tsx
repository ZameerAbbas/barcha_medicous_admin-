/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut, type User, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const UserAvatar = ({ photoURL, displayName }: { photoURL: string | null; displayName: string | null }) => {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName || "User Avatar"}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }

  const initial = displayName ? displayName[0].toUpperCase() : 'U';
  return (
    <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
      {initial}
    </div>
  );
};

interface NavbarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

    }
  };


  if (loading) {
    return (
      <nav className="h-16 bg-white shadow-md flex items-center justify-end px-6">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </nav>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="h-16 bg-white shadow-md flex items-center justify-end px-4 sm:px-6 z-20">
      <div className="flex items-center space-x-4">


        <button
          className="md:hidden p-2 text-gray-700 hover:text-gray-900"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center space-x-3">


          <UserAvatar
            photoURL={user.photoURL}
            displayName={user.displayName}
          />


          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">

              {user.displayName || "Admin User"}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {user.email}
            </p>
          </div>
        </div>


        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
        >

          <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </nav>
  );
}