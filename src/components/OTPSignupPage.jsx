import { useState,useEffect } from "react";
import { Sparkles, Mail, User, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import axios from "axios";

function OTPSignupPage({ navigateTo }) {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

      // OTP verified successfully
      setOtpVerified(true);
      setError("");
      
      // Navigate to login after successful verification
      setTimeout(() => {
        navigateTo("login");
      }, 2000);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8d7ff] via-white to-[#d7bfd7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigateTo("landing")}
          className="flex items-center space-x-2 text-[#9400d3] hover:text-[#ee80e9] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </button>

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Sign up with email verification</p>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              error.includes("success") 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {error}
            </div>
          )}

          {otpVerified ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-4">
                <CheckCircle className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Verified Successfully!</h3>
              <p className="text-gray-600 mb-4">Your account has been created. Redirecting to login...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-[#9400d3] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={otpSent}
                    className={`w-full pl-10 pr-4 py-3 border border-[#d7bfd7] rounded-lg focus:ring-2 focus:ring-[#9400d3] focus:border-transparent outline-none transition-all bg-white/50 ${
                      otpSent ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* OTP Input (shown only after OTP is sent) */}
              {otpSent && (
                <div className="animate-fadeIn">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-[#d7bfd7] rounded-lg focus:ring-2 focus:ring-[#9400d3] focus:border-transparent outline-none transition-all bg-white/50 text-center text-2xl tracking-widest"
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    We've sent a 6-digit OTP to your email. It will expire in 10 minutes.
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg hover:shadow-lg transition-all font-medium text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : otpSent ? (
                  "Verify OTP"
                ) : (
                  "Send Verification OTP"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigateTo("login")}
                className="text-[#9400d3] hover:text-[#ee80e9] font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">How it works:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#9400d3] rounded-full mt-1 mr-2"></div>
                Enter your email and we'll send a 6-digit OTP
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#9400d3] rounded-full mt-1 mr-2"></div>
                Check your inbox (and spam folder)
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#9400d3] rounded-full mt-1 mr-2"></div>
                Enter the OTP to verify your email
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#9400d3] rounded-full mt-1 mr-2"></div>
                OTP expires in 10 minutes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPSignupPage;