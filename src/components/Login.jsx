import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Firebase/Firebase.config";
import { toast } from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaCarSide, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setUser }) => {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const token = await res.user.getIdToken();

      const loginUser = {
        name: res.user.displayName || "User",
        email: res.user.email,
  photo: res.user.photoURL || "https://i.pravatar.cc/150?img=12",
        token, 
      };

  
      localStorage.setItem("user", JSON.stringify(loginUser));
      localStorage.setItem("userLoggedIn", "true");

      // Update parent 
      setUser(loginUser);

      toast.success("Login successful! 🎉");

  
   navigate(redirectPath, { replace: true });
    } catch (error) {
    console.error("Login Error:", error);
      if (error.code === "auth/user-not-found") {
   toast.error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else {
        toast.error("Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const token = await result.user.getIdToken();

      const googleUser = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        token, 
      };

  localStorage.setItem("user", JSON.stringify(googleUser));
      localStorage.setItem("userLoggedIn", "true");
      setUser(googleUser);

 toast.success("Logged in with Google! 🚗");

      navigate(redirectPath, { replace: true });
    } catch (error) {
   console.error("Google Login Error:", error);
      toast.error("Google login failed");
    } finally {
   setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-700">

  <div className="flex flex-col items-center mb-6">
   <FaCarSide className="text-5xl text-amber-400 mb-2 animate-pulse" />
    <h2 className="text-3xl font-bold text-amber-400 text-center mb-1">   Welcome Back </h2>   <p className="text-gray-400 text-sm text-center">  Login to continue yours journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
 <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
   className="w-full p-3 bg-gray-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
          />
     <div className="relative">
      <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
     onChange={(e) => setPassword(e.target.value)}
              required
      className="w-full p-3 bg-gray-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
            />
  <button
              type="button"
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400 transition"
      onClick={() => setShowPassword(!showPassword)}
            >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
       </button>
          </div>

  <button
            type="submit"
            disabled={loading}
  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
      {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}

    <div className="flex items-center my-6">
   <div className="flex-1 h-px bg-gray-600"></div>
   <span className="px-3 text-gray-400 text-sm">OR</span>
     <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Google Login */}

   <button
   onClick={handleGoogleLogin}
          disabled={loading}
     className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
   >
    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
    <path
     fill="#4285F4"
     d="M533.5 278.4c0-17.2-1.5-34.1-4.4-50.5H272v95.5h146.9c-6.4 34.8-25.2 64.3-53.8 84v69h86.9c50.9-46.9 81.5-116 81.5-198z"
      />
     <path
        fill="#34A853"
        d="M272 544.3c72.6 0 133.5-23.9 178-64.9l-86.9-69c-24.1 16.1-54.8 25.7-91.1 25.7-69.9 0-129.3-47.2-150.5-110.6H34.4v69.3c44.1 87 134.7 149.5 237.6 149.5z"
            />
            <path
      fill="#FBBC05"
     d="M121.5 321.5c-10.3-30.3-10.3-63.1 0-93.4V158.8H34.4c-42.1 83.8-42.1 182.1 0 265.9l87.1-69.2z"
       />
     <path
       fill="#EA4335"
    d="M272 107.5c37.7-.6 73.4 13 101.2 37.5l75.7-75.7C403.1 25.5 344.2 0 272 0 169.1 0 78.5 62.5 34.4 149.5l87.1 69.3c21.2-63.4 80.6-110.6 150.5-111.3z"
            />
    </svg>  Continue with Google </button>

        {/* Signup */}

  <p className="text-center text-sm text-gray-400 mt-6">
      Don't have an account?{" "}
   <Link to="/signup" className="text-amber-400 hover:underline font-medium"> Sign up </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
