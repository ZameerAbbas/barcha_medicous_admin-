// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/dashboard");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div style={{ padding: 40 }}>
//       <h2>Login</h2>

//       <form onSubmit={handleLogin} style={{ display: "grid", gap: 10, width: 300 }}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p style={{ color: "red" }}>{error}</p>}

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom"; // Import Link for "Sign Up"

// Assuming you have a logo image or a way to render it
// const BmcLogo = () => (
//   <div className="flex items-center space-x-2">
//     <span className="text-xl font-bold text-green-600">BMC</span>
//     <span className="text-sm text-gray-700 dark:text-gray-300">Barcha Medical Store</span>
//   </div>
// );

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      // Improve error message display for better UX
      const errorMessage = err.message
        .replace("Firebase: Error (auth/", "")
        .replace(").", "")
        .split("-")
        .join(" ")
        .toUpperCase();
      setError(errorMessage || "An unexpected error occurred.");
    }
  };

  return (
    // Outer container for the dark background and centering (matching the overall screenshot look)
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">

      {/* Logo container at the top left */}
      <div className="absolute top-6 left-6 text-white">
        {/* <BmcLogo /> */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
          <img
            src="/logo.png"
            alt="BARCHA Medicous"
            className="w-full h-full object-contain"
          />
        </div>


      </div>

      {/* Main Login Card/Form Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 sm:p-10">

        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Login to Barcha Medical Store
          </h1>
          <p className="text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email/Phone Input Group */}
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {/* Email Icon: You can replace this with a proper SVG or component icon */}
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="emailOrPhone"
                type="text" // Using text to accommodate both email or phone
                placeholder="Enter your email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>
          </div>

          {/* Password Input Group */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {/* Password Icon (Lock): Replace with a proper SVG or component icon */}
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V7a2 2 0 012-2h0a2 2 0 012 2v4" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-gray-600 hover:text-blue-600 transition duration-150">
              Forgot Password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition duration-150"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link to="/signup" className="text-gray-900 font-semibold hover:text-blue-600 ml-1 transition duration-150">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Footer "Made with V" (bottom left) */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        Made with V
      </div>
    </div>
  );
}