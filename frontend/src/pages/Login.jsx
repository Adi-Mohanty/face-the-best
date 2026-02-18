import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getIdTokenResult
} from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login() {

  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
  
    try {
      let userCredential;
      
      if (authMode === "login") {
        userCredential =
          await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential =
          await createUserWithEmailAndPassword(auth, email, password);
      }
  
      const token =
        await getIdTokenResult(userCredential.user, true);
      if (token.claims.admin) {
        navigate("/admin/questions");
      } else {
        navigate("/exams");
      }
    }
    catch (err) {
      mapFirebaseError(err.code);
    }
    finally {
      setLoading(false);
    }
  };  

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
  
      const result = await signInWithPopup(auth, provider);

      const token = await getIdTokenResult(result.user, true);

      if (token.claims.admin) {
        navigate("/admin/questions");
      } else {
        navigate("/exams");
      }
    }
    catch (err) {
      mapFirebaseError(err.code);
    }
  };  

  const mapFirebaseError = (code) => {
    const messages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/email-already-in-use": "Email already registered.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "Invalid email address."
    };
    setError(messages[code] || "Authentication failed.");
  };

  
  return (
    <div className="relative min-h-screen font-display overflow-hidden">
      {/* FULL BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqohfwhmRtfoHfLaAMenD5PpS-wqL18HkexiZbp1eop-wCQsgpJErzUaFPpUYW3VrAoL7ykkybIOCULtJKMVZz4VEwelGBro-STynGUuUuTG7MxzFRgm79cO5qpnJc80m7P8Vush-3iv43NrhPthZ8uTml-tfFYSQOWa5tBNMzDS5cNqz49AbonriYFKL7YUw75wkieg6t55t8eXIdYcA-dqvN1vMUiPzros-jsnvGiXnwgaZ1a1K5C9SzVNTxVG0wGdSHFVfENf5f")'
        }}
      />
    
    
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

    
      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen">
        {/* LEFT CONTENT */}
        <div className="hidden lg:flex flex-1 items-center px-16">
          <div className="max-w-xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-4xl">
                auto_stories
              </span>
    
              <span className="text-2xl font-bold">
                Face The Best
              </span>  
            </div>
  
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Achieve Excellence in Competitive Exams
            </h1>
    
            <p className="text-lg text-white/90 mb-4">
              Practice smarter. Compete daily. Become the best.
            </p>
    
            <p className="text-white/70 text-sm">
              Join over 100,000+ students preparing for UPSC, SSC, and Banking.
            </p>
          </div>
        </div>
    
    
        {/* RIGHT AUTH PANEL */}
        <div className="
          flex-1 flex items-center justify-center
          px-6
        ">
          <div className="auth-panel w-full max-w-md p-8 rounded-2xl">
            {/* Heading */}
            <div className="mb-5">
              <h2 className="text-xl font-bold mb-1">
               {authMode === "login"
                ? "Welcome Back"
                : "Create Account"}
              </h2>

              <p className="text-xs text-[#6a6a9a]">
                Continue your preparation journey
              </p>
            </div>
    
            {/* Segmented */}
            <div className="segment-container mb-6">
              <button
                onClick={() => setAuthMode("login")}
                className={`segment-button ${
                  authMode === "login" ? "active" : ""
                }`}
              >
                Login
              </button>
    
              <button
                onClick={() => setAuthMode("signup")}
                className={`segment-button ${
                  authMode === "signup" ? "active" : ""
                }`}
              >
                Sign Up
              </button>
            </div>
    
            {/* Email */}
            <div className="input-group">
              <label>Email</label>
    
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="you@email.com"
              />
            </div>
    
            {/* Password */}
            <div className="input-group">
              <label>Password</label>
    
              <div className="password-container">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
    
                <button
                  type="button"
                  className="visibility-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`primary-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Please wait...
                </span>
              ) : authMode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="material-symbols-outlined error-icon">
                  error
                </span>
                <span>{error}</span>
              </div>
            )}
    
            {/* Divider */}
            <div className="divider">
              OR
            </div>
    
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="google-button"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="google-icon"
              />
              Continue with Google  
            </button>

            {/* Switch mode */}
            <p className="switch-text">
              {authMode === "login"
                ? "New user?"
                : "Already have account?"}

              <span
                onClick={() =>
                  setAuthMode(
                    authMode === "login"
                      ? "signup"
                      : "login"
                  )
                }
              >
                {authMode === "login"
                  ? " Create account"
                  : " Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    
  
      <style jsx>{`
        /* AUTH PANEL */
        .auth-panel {
          background: linear-gradient(145deg, #f0f2f7, #ffffff);
          box-shadow:
            20px 20px 40px rgba(0,0,0,0.35),
            -10px -10px 20px rgba(255,255,255,0.9);
        }

        /* SEGMENT CONTAINER (pressed base) */
        .segment-container {
          display: flex;
          padding: 4px;
          border-radius: 12px;
          background: linear-gradient(145deg, #dfe3ec, #ffffff);
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.15),
            inset -4px -4px 8px rgba(255,255,255,0.9);
        }

        /* SEGMENT BUTTON */
        .segment-button {
          flex: 1;
          padding: 8px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #555;
        }

        /* ACTIVE SEGMENT */
        .segment-button.active {
          background: linear-gradient(145deg, #ffffff, #e6e9ef);
          color: #111;
          box-shadow:
            4px 4px 8px rgba(0,0,0,0.2),
            -3px -3px 6px rgba(255,255,255,0.9);
        }

        /* INPUT GROUP */
        .input-group {
          margin-bottom: 16px;
        }

        .input-group label {
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        /* INPUT FIELD */
        .input-group input {
          width: 100%;
          padding: 10px;
          margin-top: 4px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(145deg, #e6e9ef, #ffffff);
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.15),
            inset -4px -4px 8px rgba(255,255,255,0.9);
        }

        /* PASSWORD CONTAINER */
        .password-container {
          position: relative;
        }

        /* PASSWORD INPUT */
        .password-container input {
          padding-right: 42px;
        }

        /* VISIBILITY BUTTON */
        .visibility-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(145deg, #ffffff, #e6e9ef);
          box-shadow:
            2px 2px 4px rgba(0,0,0,0.2),
            -2px -2px 4px rgba(255,255,255,0.9);
        }

        /* PRIMARY BUTTON */
        .primary-button {
          width: 100%;
          padding: 12px;
          margin-top: 6px;
          border-radius: 12px;
          border: none;
          color: white;
          font-weight: 700;
          background: linear-gradient(145deg, #3b3ba7, #2f2f8f);
          box-shadow:
            6px 6px 14px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.2);
          cursor: pointer;
        }

        .primary-button:active {
          box-shadow:
            inset 4px 4px 10px rgba(0,0,0,0.5);
        }

        /* GOOGLE BUTTON */
        .google-button {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(145deg, #ffffff, #e6e9ef);
          box-shadow:
            6px 6px 14px rgba(0,0,0,0.25),
            -4px -4px 8px rgba(255,255,255,0.9);
          cursor: pointer;
        }

        .google-button:active {
          box-shadow:
            inset 4px 4px 10px rgba(0,0,0,0.3);
        }

        /* GOOGLE ICON */
        .google-icon {
          width: 18px;
          height: 18px;
        }

        /* LOADING BUTTON */
        .primary-button.loading {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow:
            inset 3px 3px 8px rgba(0,0,0,0.4);
        }

        /* ERROR BOX (skeuomorphic) */
        .error-box {
          margin-top: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #b00020;
          background: linear-gradient(145deg, #ffe6e6, #ffffff);
          box-shadow:
            inset 3px 3px 6px rgba(0,0,0,0.15),
            inset -3px -3px 6px rgba(255,255,255,0.9);
        }

        /* ERROR ICON */
        .error-icon {
          font-size: 16px;
        }

        /* FIXED DIVIDER */
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 18px 0;
          font-size: 11px;
          font-weight: 700;
          color: #666;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          margin: 0 10px;
          background: linear-gradient(to right, transparent, #aaa, transparent);
        }

        /* FIXED SWITCH TEXT */
        .switch-text {
          text-align: center;
          font-size: 12px;
          margin-top: 16px;
          color: #444;
        }

        .switch-text span {
          color: #3b3ba7;
          font-weight: 700;
          cursor: pointer;
        }

        .switch-text span:hover {
          text-decoration: underline;
        }

      `}</style>
    </div>
  ); 
}