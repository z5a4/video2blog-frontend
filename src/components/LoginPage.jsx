import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";

function LoginPage({ navigateTo, onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      // backend returns ONLY JWT
      onLogin(res.data.token);
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8d7ff] via-white to-[#d7bfd7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* BACK */}
        <button
          onClick={() => navigateTo("landing")}
          className="flex items-center space-x-2 text-[#9400d3] hover:text-[#ee80e9] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
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
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue converting videos
            </p>
          </div>

          {error && (
            <p className="text-red-600 mb-4 text-center">
              {error}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
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
                  required
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#d7bfd7] rounded-lg focus:ring-2 focus:ring-[#9400d3] outline-none bg-white/50"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-[#d7bfd7] rounded-lg focus:ring-2 focus:ring-[#9400d3] outline-none bg-white/50"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg font-medium text-lg disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigateTo("signup")}
                className="text-[#9400d3] hover:text-[#ee80e9] font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
