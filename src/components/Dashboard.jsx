import { useState, useEffect } from "react";
import axios from "axios";
import {
  Sparkles,
  LogOut,
  FileText,
  Settings,
  Home,
  CheckCircle,
  AlertCircle,
  Upload,
  Calendar,
  Link,
  Video,
  FileUp,
  Key,
  Globe,
  Eye,
  Clock,
  Check,
  XCircle,
  Info,
  Shield,
  Zap,
  BarChart,
  Timer,
  Hash,
  FileCode,
  MessageSquare,
  BookOpen,
  Cpu,
  Cloud,
  Server,
  Lock,
  FileVideo,
  ArrowRight,
  ArrowDown
} from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-gradient-to-r from-emerald-500 to-teal-500",
    error: "bg-gradient-to-r from-rose-500 to-pink-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500",
    info: "bg-gradient-to-r from-[#9400d3] to-[#ee80e9]"
  };

  const icon = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 ${bgColor[type]} text-white px-6 py-4 rounded-xl shadow-2xl animate-slideIn`}>
      {icon[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon: Icon, title, description, gradient = "from-[#9400d3] to-[#ee80e9]" }) => (
  <div className="glass-card rounded-xl p-4 border-l-4 border-[#9400d3] hover-lift">
    <div className="flex items-start gap-3">
      <div className={`bg-gradient-to-r ${gradient} p-2 rounded-lg`}>
        <Icon className="text-white w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

// Rule Item Component
const RuleItem = ({ icon: Icon, text, type = "info" }) => {
  const colors = {
    info: "text-[#9400d3] bg-[#f8f5ff]",
    success: "text-emerald-700 bg-emerald-50",
    warning: "text-amber-700 bg-amber-50",
    error: "text-rose-700 bg-rose-50"
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${colors[type]}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

function Dashboard({ token, onLogout }) {
  const [hashnodePAT, setHashnodePAT] = useState("");
  const [isPATSaved, setIsPATSaved] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideos, setProcessedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [toast, setToast] = useState(null);
  const [userInfo, setUserInfo] = useState({
    monthlyMinutesUsed: 0,
    monthlyLimit: 120,
    dailyCount: 0
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  /* ================= FETCH USER INFO ================= */
  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.hashnodeToken) {
        setIsPATSaved(true);
      }
      setUserInfo({
        monthlyMinutesUsed: res.data.monthlyMinutesUsed || 0,
        monthlyLimit: res.data.monthlyLimit || 120,
        dailyCount: res.data.dailyCount || 0
      });
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  /* ================= SAVE HASHNODE PAT ================= */
  const handleSavePAT = async (e) => {
    e.preventDefault();
    if (!hashnodePAT) {
      showToast("Please enter your Hashnode PAT", "warning");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/hashnode`,
        { token: hashnodePAT },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsPATSaved(true);
      setHashnodePAT("");
      fetchUserInfo();
      showToast("Hashnode PAT saved successfully!", "success");
    } catch {
      showToast("Failed to save PAT. Please try again.", "error");
    }
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showToast("Please select a video file", "warning");
        return;
      }
      
      // Check file size (500MB limit from backend)
      if (file.size > 500 * 1024 * 1024) {
        showToast("File size exceeds 500MB limit", "error");
        return;
      }
      
      setVideoFile(file);
      showToast(`"${file.name}" selected for upload`, "info");
    }
  };

  /* ================= VIDEO UPLOAD & PROCESSING ================= */
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!isPATSaved) {
      showToast("Please save your Hashnode PAT first", "warning");
      return;
    }
    if (!videoFile) {
      showToast("Please select a video file", "warning");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/convert`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setVideoFile(null);
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      showToast("Video converted and published successfully!", "success");
      
      // Update user info and switch to history tab
      fetchUserInfo();
      setActiveTab("history");
      fetchHistory();
    } catch (err) {
      showToast(
        err.response?.data?.error || "Conversion failed. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* ================= FETCH HISTORY ================= */
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProcessedVideos(res.data);
    } catch {
      showToast("Failed to load history", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
  }, [activeTab]);

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  // Calculate usage percentage
  const usagePercentage = (userInfo.monthlyMinutesUsed / userInfo.monthlyLimit) * 100;
  const remainingMinutes = userInfo.monthlyLimit - userInfo.monthlyMinutesUsed;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2d0f2] via-white to-[#f2d0f2] font-sans">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .hover-lift {
          transition: all 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(148, 0, 211, 0.2);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .gradient-border {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                    linear-gradient(to right, #9400d3, #ee80e9) border-box;
        }
        .progress-bar {
          background: linear-gradient(90deg, #9400d3, #ee80e9);
          transition: width 0.3s ease;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* NAV */}
      <nav className="glass-card sticky top-0 z-40 border-b border-[#e6d5e6] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2.5 rounded-xl shadow-md hover-lift">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#9400d3] to-[#ee80e9] bg-clip-text text-transparent">
                Vid2Blog
              </span>
              <p className="text-xs text-gray-500 font-medium">AI-Powered Video to Blog Converter</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#9400d3] hover:bg-[#f5f0ff] transition-colors duration-200 font-medium hover-lift"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-4 space-y-2 shadow-lg">
            {[
              { id: "upload", icon: <Upload className="w-5 h-5" />, label: "Upload" },
              { id: "history", icon: <FileText className="w-5 h-5" />, label: "History" },
              { id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white shadow-md"
                    : "text-gray-700 hover:bg-[#f8f5ff] hover:text-[#9400d3]"
                } hover-lift`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Usage Stats Card */}
          <div className="glass-card rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-[#9400d3]" />
              Monthly Usage
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Minutes Used</span>
                  <span className="font-bold text-gray-800">
                    {userInfo.monthlyMinutesUsed.toFixed(1)} / {userInfo.monthlyLimit} mins
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full progress-bar ${usagePercentage > 80 ? 'animate-pulse' : ''}`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {remainingMinutes > 0 
                    ? `${remainingMinutes.toFixed(1)} minutes remaining this month`
                    : "Monthly limit reached"}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-[#9400d3]" />
                    <span className="text-sm text-gray-600">Daily Conversions</span>
                  </div>
                  <span className="font-bold text-gray-800">{userInfo.dailyCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#9400d3]" />
                    <span className="text-sm text-gray-600">Total Conversions</span>
                  </div>
                  <span className="font-bold text-[#9400d3]">{processedVideos.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Info Card */}
          <div className="glass-card rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#9400d3]" />
              System Information
            </h3>
            <div className="space-y-3">
              <InfoCard
                icon={Cpu}
                title="AI Processing"
                description="Uses Groq AI with Whisper for transcription and GPT for content generation"
              />
              <InfoCard
                icon={Lock}
                title="Secure Encryption"
                description="Your Hashnode PAT is encrypted using AES-256-CBC encryption"
                gradient="from-emerald-500 to-teal-400"
              />
              <InfoCard
                icon={Cloud}
                title="Cloud Storage"
                description="Files are temporarily processed and automatically cleaned up"
                gradient="from-blue-500 to-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2 rounded-lg">
                    <Key className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Hashnode Integration</h2>
                    <p className="text-gray-600">Connect your Hashnode account to publish articles</p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-8 p-4 bg-[#f8f5ff] rounded-xl">
                  <h3 className="font-bold text-[#9400d3] mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    How It Works
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Your Hashnode Personal Access Token (PAT) is securely encrypted and used to:
                  </p>
                  <div className="space-y-2">
                    <RuleItem icon={Hash} text="Fetch your Hashnode publication ID automatically" />
                    <RuleItem icon={Lock} text="Store encrypted token securely using AES-256-CBC" />
                    <RuleItem icon={FileCode} text="Publish converted articles as drafts to your publication" />
                    <RuleItem icon={Shield} text="Token is never stored in plain text" type="success" />
                  </div>
                </div>

                {!isPATSaved ? (
                  <form onSubmit={handleSavePAT} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Access Token (PAT)
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your Hashnode PAT"
                        value={hashnodePAT}
                        onChange={(e) => setHashnodePAT(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#9400d3]/30 focus:border-[#9400d3] outline-none transition-all"
                      />
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-800 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium">How to get your PAT:</span>
                        </div>
                        <ol className="text-sm text-amber-700 space-y-1 ml-6 list-decimal">
                          <li>Go to Hashnode Settings → Developer → Personal Access Tokens</li>
                          <li>Generate a new token with "Create Draft" permissions</li>
                          <li>Copy the token and paste it above</li>
                        </ol>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white py-3.5 rounded-xl font-medium hover-lift shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="w-5 h-5" />
                        Connect Hashnode Account
                      </div>
                    </button>
                  </form>
                ) : (
                  <div className="gradient-border rounded-2xl p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-4">
                      <Check className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hashnode Connected</h3>
                    <p className="text-gray-600 mb-4">Your account is successfully connected and ready to publish</p>
                    <button
                      onClick={() => setIsPATSaved(false)}
                      className="px-6 py-2.5 border border-[#9400d3] text-[#9400d3] rounded-lg hover:bg-[#f8f5ff] transition-colors font-medium"
                    >
                      Reconnect Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2 rounded-lg">
                    <Video className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Upload Video</h2>
                    <p className="text-gray-600">Convert your video into a professional blog post and publish to Hashnode</p>
                  </div>
                </div>

                {/* Process Flow Description */}
<div className="mb-8">
  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
    <Zap className="w-5 h-5 text-[#9400d3]" />
    How Vid2Blog Works
  </h3>
  
  <div className="bg-white rounded-xl p-5 border border-gray-200">
    {/* Process Steps with Arrows */}
    <div className="flex flex-col md:flex-row items-center justify-between">
      
      {/* Step 1 */}
      <div className="flex flex-col items-center text-center p-3 w-full md:w-auto">
        <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-3 rounded-full mb-2">
          <FileVideo className="text-white w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 mb-1">Upload Video</h4>
        <p className="text-xs text-gray-600">MP4, MOV, AVI up to 500MB</p>
      </div>
      
      {/* Arrow */}
      <div className="hidden md:block text-gray-400 px-4">
        <ArrowRight className="w-6 h-6" />
      </div>
      <div className="md:hidden my-4 text-gray-400">
        <ArrowDown className="w-6 h-6 mx-auto" />
      </div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center text-center p-3 w-full md:w-auto">
        <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-3 rounded-full mb-2">
          <MessageSquare className="text-white w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 mb-1">Extract & Transcribe</h4>
        <p className="text-xs text-gray-600">FFmpeg + Whisper AI</p>
      </div>
      
      {/* Arrow */}
      <div className="hidden md:block text-gray-400 px-4">
        <ArrowRight className="w-6 h-6" />
      </div>
      <div className="md:hidden my-4 text-gray-400">
        <ArrowDown className="w-6 h-6 mx-auto" />
      </div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center text-center p-3 w-full md:w-auto">
        <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-3 rounded-full mb-2">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 mb-1">Generate Article</h4>
        <p className="text-xs text-gray-600">GPT creates blog content</p>
      </div>
      
      {/* Arrow */}
      <div className="hidden md:block text-gray-400 px-4">
        <ArrowRight className="w-6 h-6" />
      </div>
      <div className="md:hidden my-4 text-gray-400">
        <ArrowDown className="w-6 h-6 mx-auto" />
      </div>
      
      {/* Step 4 */}
      <div className="flex flex-col items-center text-center p-3 w-full md:w-auto">
        <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-3 rounded-full mb-2">
          <Hash className="text-white w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 mb-1">Publish Draft</h4>
        <p className="text-xs text-gray-600">To your Hashnode blog</p>
      </div>
    </div>
    
    {/* Simple description below */}
    <div className="mt-6 pt-6 border-t border-gray-100">
      <p className="text-sm text-gray-600 text-center">
        Upload your video → AI extracts audio → Converts to text → Creates blog article → Publishes to Hashnode
      </p>
    </div>
  </div>
</div>

                {/* Rules and Limitations */}
                <div className="mb-6 p-4 bg-[#f8f5ff] rounded-xl">
                  <h3 className="font-bold text-[#9400d3] mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Important Rules & Limitations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <RuleItem 
                      icon={Shield} 
                      text={`Monthly limit: ${userInfo.monthlyLimit} minutes of video`} 
                      type="warning"
                    />
                    <RuleItem 
                      icon={Timer} 
                      text="Rate limit: 5 conversions per hour" 
                      type="warning"
                    />
                    <RuleItem 
                      icon={FileVideo} 
                      text="Max file size: 500MB" 
                      type="info"
                    />
                    <RuleItem 
                      icon={Lock} 
                      text="Video files only (MP4, MOV, AVI, etc.)" 
                      type="info"
                    />
                  </div>
                </div>

                {!isPATSaved && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Hashnode PAT Required</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1 ml-7">
                      Please connect your Hashnode account in Settings tab before uploading videos
                    </p>
                  </div>
                )}

                <form onSubmit={handleVideoUpload} className="space-y-6">
                  <div className="gradient-border rounded-2xl p-8 text-center">
                    <FileUp className="w-12 h-12 mx-auto text-[#9400d3] mb-4" />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={!isPATSaved || usagePercentage >= 100}
                      />
                      <div className="space-y-3">
                        {videoFile ? (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-emerald-800">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">{videoFile.name}</span>
                            </div>
                            <p className="text-sm text-emerald-600 mt-1">
                              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#9400d3] transition-colors">
                            <p className="text-gray-700 font-medium">Click to select video file</p>
                            <p className="text-sm text-gray-500 mt-1">Supports MP4, MOV, AVI, and other video formats</p>
                            <p className="text-xs text-gray-400 mt-2">Maximum file size: 500MB</p>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => document.querySelector('input[type="file"]').click()}
                          disabled={!isPATSaved || usagePercentage >= 100}
                          className={`px-6 py-2.5 rounded-lg font-medium ${
                            isPATSaved && usagePercentage < 100
                              ? 'bg-[#9400d3] text-white hover:bg-[#7a00b3]'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          } transition-colors`}
                        >
                          {usagePercentage >= 100 ? 'Monthly Limit Reached' : 'Choose Video'}
                        </button>
                      </div>
                    </label>
                  </div>

                  {/* Current Usage Warning */}
                  {usagePercentage > 80 && usagePercentage < 100 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Usage Alert</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        You've used {userInfo.monthlyMinutesUsed.toFixed(1)} of {userInfo.monthlyLimit} minutes ({usagePercentage.toFixed(1)}%)
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!videoFile || !isPATSaved || isProcessing || usagePercentage >= 100}
                    className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 transition-all ${
                      !videoFile || !isPATSaved || isProcessing || usagePercentage >= 100
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white hover-lift shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Convert & Publish to Hashnode
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="glass-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2 rounded-lg">
                  <Calendar className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Conversion History</h2>
                  <p className="text-gray-600">Track your video conversions and published articles</p>
                </div>
              </div>

              {/* History Description */}
              <div className="mb-6 p-4 bg-[#f8f5ff] rounded-xl">
                <h3 className="font-bold text-[#9400d3] mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Your Conversions
                </h3>
                <p className="text-gray-700 mb-3">
                  Each conversion includes detailed tracking of:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <RuleItem icon={FileVideo} text="Original video filename" />
                  <RuleItem icon={BookOpen} text="Generated article title" />
                  <RuleItem icon={Clock} text="Processing timestamp" />
                  <RuleItem icon={Hash} text="Hashnode draft ID reference" />
                </div>
              </div>

              {processedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No conversions yet</h3>
                  <p className="text-gray-500">Upload your first video to see conversion history</p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg hover-lift"
                  >
                    Go to Upload
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {processedVideos.map((h) => (
                    <div
                      key={h._id}
                      className="gradient-border rounded-xl p-5 hover-lift transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-[#9400d3]" />
                            <h3 className="font-bold text-gray-800">{h.articleTitle}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4" />
                              <span className="font-medium">Video:</span>
                              <span>{h.videoName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">Date:</span>
                              <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                            </div>
                            {h.hashnodeDraftId && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-4 h-4" />
                                <span className="font-medium">Draft ID:</span>
                                <span className="text-xs font-mono">{h.hashnodeDraftId}</span>
                              </div>
                            )}
                          </div>
                          {h.draftUrl && (
  <a
    href={h.draftUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-sm text-[#9400d3] hover:text-[#7a00b3] font-medium"
  >
    <Eye className="w-4 h-4" />
    Open Draft on Hashnode
  </a>
)}
                        </div>
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Draft
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;