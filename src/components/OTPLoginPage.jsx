import { useState, useEffect } from "react";
import { Sparkles, Mail, KeyRound, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";

function OTPLoginPage({ navigateTo, onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [rememberEmail, setRememberEmail] = useState(false);

  // Load remembered email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberEmail(true);
    }
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    // Save email to localStorage if remember me is checked
    if (rememberEmail) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        { email: formData.email }
      );
      
      setOtpSent(true);
      setCooldown(60); // 60 seconds cooldown
      setError("");
      
      // In development, show OTP for testing
      if (import.meta.env.DEV && response.data.otp) {
        console.log("OTP for testing:", response.data.otp);
      }
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
  e.preventDefault();
  if (!formData.otp || formData.otp.length !== 6) {
    setError("Please enter a valid 6-digit OTP");
    return;
  }

  setLoading(true);
  setError("");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
      {
        email: formData.email,
        otp: formData.otp
      }
    );

    // OTP verified successfully, get token and login
    const { token, hasHashnode, hasGroqApiKey } = response.data;
    
    // Pass both API key statuses to onLogin
    onLogin(token, { hasHashnode, hasGroqApiKey });
    
  } catch (err) {
    setError(err.response?.data?.error || "Invalid OTP. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    
    // For OTP input, only allow numbers and limit to 6 digits
    if (name === "otp") {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        { email: formData.email }
      );
      setCooldown(60);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setFormData(prev => ({ ...prev, otp: "" }));
      setError("");
    } else {
      navigateTo("landing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8d7ff] via-white to-[#d7bfd7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* BACK BUTTON */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-[#9400d3] hover:text-[#ee80e9] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{otpSent ? "Change Email" : "Back to home"}</span>
        </button>

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[#d7bfd7]">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#9400d3] to-[#ee80e9] bg-clip-text text-transparent">
                Vid2Blog
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {otpSent ? "Enter OTP" : "Welcome Back"}
            </h2>
            <p className="text-gray-600">
              {otpSent 
                ? `Enter the OTP sent to ${formData.email}`
                : "Sign in with email verification"}
            </p>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              error.includes("sent") 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-6">
            {/* EMAIL INPUT (shown always) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                  className={`w-full pl-10 pr-4 py-3 border border-[#d7bfd7] rounded-lg focus:ring-2 focus:ring-[#9400d3] outline-none transition-all ${
                    otpSent ? "opacity-70 cursor-not-allowed bg-gray-50" : "bg-white/50"
                  }`}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              {/* Remember Email Checkbox (only when not OTP sent) */}
              {!otpSent && (
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="rememberEmail"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    className="w-4 h-4 text-[#9400d3] rounded focus:ring-[#9400d3]"
                  />
                  <label htmlFor="rememberEmail" className="ml-2 text-sm text-gray-600">
                    Remember my email
                  </label>
                </div>
              )}
            </div>

            {/* OTP INPUT (shown only after OTP is sent) */}
            {otpSent && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-digit OTP
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#d7bfd7] rounded-lg focus:ring-2 focus:ring-[#9400d3] outline-none text-center text-2xl tracking-widest bg-white/50"
                    placeholder="123456"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Check your inbox. OTP expires in 10 minutes.
                </p>
                
                {/* Resend OTP */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={cooldown > 0 || loading}
                    className={`text-sm ${
                      cooldown > 0 || loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#9400d3] hover:text-[#ee80e9]"
                    }`}
                  >
                    {cooldown > 0
                      ? `Resend OTP in ${cooldown}s`
                      : "Didn't receive OTP? Resend"}
                  </button>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg font-medium text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : otpSent ? (
                "Verify & Sign In"
              ) : (
                "Send OTP to Email"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigateTo("signup")}
                className="text-[#9400d3] hover:text-[#ee80e9] font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* ADDITIONAL INFO */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Secure Login:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                No password required - OTP is sent to your email
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                OTP is valid for 10 minutes only
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                Check spam folder if you don't see the email
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPLoginPage;