import { useState, useEffect } from "react";
import { 
  Key, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Cpu,
  Globe,
  Loader2,
  Lock,
  Zap
} from "lucide-react";
import axios from "axios";

function ApiKeysSettings({ token, apiKeyStatus, onUpdate }) {
  const [groqKey, setGroqKey] = useState("");
  const [hashnodeToken, setHashnodeToken] = useState("");
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showHashnodeToken, setShowHashnodeToken] = useState(false);
  const [loading, setLoading] = useState({
    groq: false,
    hashnode: false,
    status: false
  });
  const [messages, setMessages] = useState({
    groq: null,
    hashnode: null
  });

  const handleSaveGroqKey = async (e) => {
    e.preventDefault();
    if (!groqKey.trim()) {
      setMessages({ ...messages, groq: { type: "error", text: "Please enter Groq API key" } });
      return;
    }

    setLoading(prev => ({ ...prev, groq: true }));
    setMessages({ ...messages, groq: null });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/keys/groq`,
        { groqKey: groqKey.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages({ 
        ...messages, 
        groq: { 
          type: "success", 
          text: response.data.message,
          details: response.data.validation 
        } 
      });
      
      setGroqKey("");
      if (onUpdate) onUpdate();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to save Groq key";
      setMessages({ 
        ...messages, 
        groq: { 
          type: "error", 
          text: errorMsg,
          locked: error.response?.data?.locked,
          lockedUntil: error.response?.data?.lockedUntil
        } 
      });
    } finally {
      setLoading(prev => ({ ...prev, groq: false }));
    }
  };

  const handleSaveHashnodeToken = async (e) => {
    e.preventDefault();
    if (!hashnodeToken.trim()) {
      setMessages({ ...messages, hashnode: { type: "error", text: "Please enter Hashnode token" } });
      return;
    }

    setLoading(prev => ({ ...prev, hashnode: true }));
    setMessages({ ...messages, hashnode: null });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/keys/hashnode`,
        { hashnodeToken: hashnodeToken.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages({ 
        ...messages, 
        hashnode: { 
          type: "success", 
          text: response.data.message,
          details: response.data.validation 
        } 
      });
      
      setHashnodeToken("");
      if (onUpdate) onUpdate();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to save Hashnode token";
      setMessages({ 
        ...messages, 
        hashnode: { 
          type: "error", 
          text: errorMsg 
        } 
      });
    } finally {
      setLoading(prev => ({ ...prev, hashnode: false }));
    }
  };

  const handleDeleteKey = async (type) => {
    if (!window.confirm(`Are you sure you want to delete your ${type} key?`)) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/keys/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages({ 
        ...messages, 
        [type]: { 
          type: "success", 
          text: `${type} key deleted successfully` 
        } 
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to delete key:", error);
    }
  };

  const handleRefreshStatus = () => {
    if (onUpdate) onUpdate();
    setMessages({ groq: null, hashnode: null });
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#9400d3]" />
            API Keys Status
          </h3>
          <button
            onClick={handleRefreshStatus}
            disabled={loading.status}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#9400d3] hover:bg-[#f8f5ff] rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading.status ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Groq Status */}
          <div className={`p-4 rounded-lg border ${
            apiKeyStatus.groq.isVerified 
              ? 'border-emerald-200 bg-emerald-50' 
              : 'border-amber-200 bg-amber-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#9400d3]" />
                <span className="font-bold">Groq API</span>
              </div>
              {apiKeyStatus.groq.isVerified ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm">
                Status: <span className={`font-medium ${
                  apiKeyStatus.groq.isVerified ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {apiKeyStatus.groq.isConfigured 
                    ? (apiKeyStatus.groq.isVerified ? 'Verified' : 'Needs Verification')
                    : 'Not Configured'
                  }
                </span>
              </p>
              {apiKeyStatus.groq.lastVerified && (
                <p className="text-xs text-gray-600">
                  Last verified: {new Date(apiKeyStatus.groq.lastVerified).toLocaleDateString()}
                </p>
              )}
              {apiKeyStatus.groq.usageCount > 0 && (
                <p className="text-xs text-gray-600">
                  Usage: {apiKeyStatus.groq.usageCount} calls
                </p>
              )}
            </div>
          </div>

          {/* Hashnode Status */}
          <div className={`p-4 rounded-lg border ${
            apiKeyStatus.hashnode.isVerified 
              ? 'border-emerald-200 bg-emerald-50' 
              : 'border-amber-200 bg-amber-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#9400d3]" />
                <span className="font-bold">Hashnode</span>
              </div>
              {apiKeyStatus.hashnode.isVerified ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm">
                Status: <span className={`font-medium ${
                  apiKeyStatus.hashnode.isVerified ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {apiKeyStatus.hashnode.isConfigured 
                    ? (apiKeyStatus.hashnode.isVerified ? 'Verified' : 'Needs Verification')
                    : 'Not Configured'
                  }
                </span>
              </p>
              {apiKeyStatus.hashnode.publicationId && (
                <p className="text-xs text-gray-600 truncate" title={apiKeyStatus.hashnode.publicationId}>
                  Publication: {apiKeyStatus.hashnode.publicationId.substring(0, 20)}...
                </p>
              )}
              {apiKeyStatus.hashnode.lastVerified && (
                <p className="text-xs text-gray-600">
                  Last verified: {new Date(apiKeyStatus.hashnode.lastVerified).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Status */}
        {apiKeyStatus.security.isLocked && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Account Locked</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Too many failed attempts. Account locked until {
                new Date(apiKeyStatus.security.lockedUntil).toLocaleString()
              }
            </p>
            <p className="text-xs text-red-600 mt-1">
              Failed attempts: {apiKeyStatus.security.failedAttempts}
            </p>
          </div>
        )}
      </div>

      {/* Groq API Key Section */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#9400d3]" />
          Groq API Key
        </h3>

        {messages.groq && (
          <div className={`mb-4 p-3 rounded-lg ${
            messages.groq.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {messages.groq.type === 'success' ? 
                <CheckCircle className="w-4 h-4" /> : 
                <AlertCircle className="w-4 h-4" />
              }
              <span>{messages.groq.text}</span>
            </div>
            {messages.groq.details && (
              <div className="mt-2 text-sm">
                <p>Models available: {messages.groq.details.modelsAvailable}</p>
                <p>Rate limit: {messages.groq.details.rateLimit} requests/minute</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSaveGroqKey} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Groq API Key
            </label>
            <div className="relative">
              <input
                type={showGroqKey ? "text" : "password"}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9400d3] focus:border-transparent outline-none pr-12"
                disabled={loading.groq}
              />
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showGroqKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your key starts with "gsk_" and is encrypted before storage
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading.groq || !groqKey.trim()}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.groq ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </div>
              ) : apiKeyStatus.groq.isConfigured ? 'Update & Revalidate' : 'Save & Validate'}
            </button>
            
            {apiKeyStatus.groq.isConfigured && (
              <button
                type="button"
                onClick={() => handleDeleteKey('groq')}
                className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            How to get Groq API Key:
          </h4>
          <ol className="text-xs text-blue-700 space-y-1 ml-5 list-decimal">
            <li>Go to <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline">Groq Console</a></li>
            <li>Sign up / Log in to your account</li>
            <li>Navigate to API Keys section</li>
            <li>Create a new API key</li>
            <li>Copy the key (starts with gsk_)</li>
          </ol>
        </div>
      </div>

      {/* Hashnode Token Section */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#9400d3]" />
          Hashnode Personal Access Token
        </h3>

        {messages.hashnode && (
          <div className={`mb-4 p-3 rounded-lg ${
            messages.hashnode.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {messages.hashnode.type === 'success' ? 
                <CheckCircle className="w-4 h-4" /> : 
                <AlertCircle className="w-4 h-4" />
              }
              <span>{messages.hashnode.text}</span>
            </div>
            {messages.hashnode.details && (
              <div className="mt-2 text-sm">
                <p>Username: {messages.hashnode.details.username}</p>
                <p>Publications: {messages.hashnode.details.publications?.length || 0}</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSaveHashnodeToken} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Hashnode Personal Access Token
            </label>
            <div className="relative">
              <input
                type={showHashnodeToken ? "text" : "password"}
                value={hashnodeToken}
                onChange={(e) => setHashnodeToken(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9400d3] focus:border-transparent outline-none pr-12"
                disabled={loading.hashnode}
              />
              <button
                type="button"
                onClick={() => setShowHashnodeToken(!showHashnodeToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showHashnodeToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              UUID format token with create draft permissions
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading.hashnode || !hashnodeToken.trim()}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.hashnode ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </div>
              ) : apiKeyStatus.hashnode.isConfigured ? 'Update & Revalidate' : 'Save & Validate'}
            </button>
            
            {apiKeyStatus.hashnode.isConfigured && (
              <button
                type="button"
                onClick={() => handleDeleteKey('hashnode')}
                className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            How to get Hashnode PAT:
          </h4>
          <ol className="text-xs text-purple-700 space-y-1 ml-5 list-decimal">
            <li>Go to <a href="https://hashnode.com/settings/developer" target="_blank" rel="noopener noreferrer" className="underline">Hashnode Developer Settings</a></li>
            <li>Scroll to "Personal Access Tokens"</li>
            <li>Click "Generate New Token"</li>
            <li>Name it (e.g., "Vid2Blog")</li>
            <li>Select "Create draft" permission only</li>
            <li>Copy the generated UUID token</li>
          </ol>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 mb-1">Security First</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• All keys are encrypted using AES-256-GCM encryption</li>
              <li>• Keys are validated in real-time before storage</li>
              <li>• Fake or invalid keys are automatically detected and rejected</li>
              <li>• Multiple failed attempts will temporarily lock your account</li>
              <li>• Keys are never logged or stored in plain text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeysSettings;