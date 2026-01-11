import { Video, FileText, Zap, Clock, CheckCircle, Sparkles, Code, Upload } from 'lucide-react';

function LandingPage({ navigateTo }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8d7ff] via-white to-[#d7bfd7]">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#9400d3] to-[#ee80e9] bg-clip-text text-transparent">
                Vid2Blog
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigateTo('login')}
                className="px-4 py-2 text-[#9400d3] hover:text-[#ee80e9] transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigateTo('signup')}
                className="px-6 py-2 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-[#d7bfd7]">
              <Sparkles className="w-4 h-4 text-[#9400d3]" />
              <span className="text-sm font-medium text-[#9400d3]">AI-Powered Content Creation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Tutorial Videos into{' '}
              <span className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] bg-clip-text text-transparent">
                Beautiful Blog Posts
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Stop wasting time taking notes while watching tutorials. Vid2Blog automatically extracts key insights,
              code snippets, and important concepts from your videos and publishes them directly to Hashnode.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigateTo('signup')}
                className="px-8 py-4 bg-gradient-to-r from-[#9400d3] to-[#ee80e9] text-white rounded-lg hover:shadow-xl transition-all font-medium text-lg"
              >
                Start Converting Videos
              </button>
              <button className="px-8 py-4 bg-white text-[#9400d3] rounded-lg hover:shadow-lg transition-all font-medium text-lg border-2 border-[#d7bfd7]">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d7bfd7] hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-[#d8d7ff] to-[#d7bfd7] w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-[#9400d3]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Video</h3>
              <p className="text-gray-700">
                Simply upload your tutorial video or provide a link. Our AI handles the rest.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d7bfd7] hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-[#d8d7ff] to-[#d7bfd7] w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-[#9400d3]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Processing</h3>
              <p className="text-gray-700">
                Our AI extracts key concepts, code snippets, and important notes automatically.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d7bfd7] hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-[#d8d7ff] to-[#d7bfd7] w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-[#9400d3]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Publish to Hashnode</h3>
              <p className="text-gray-700">
                Automatically formatted and published to your Hashnode blog in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Problem We Solve
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Watching tutorials while simultaneously taking notes is time-consuming and distracting.
              You miss important details while typing, and formatting code snippets is tedious.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg mt-1">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Time Consuming</h3>
                  <p className="text-gray-700">
                    Pausing videos every few seconds to write notes disrupts your learning flow.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg mt-1">
                  <Code className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Code Snippet Headache</h3>
                  <p className="text-gray-700">
                    Manually copying and formatting code from videos is error-prone and frustrating.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg mt-1">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Messy Notes</h3>
                  <p className="text-gray-700">
                    Quick notes during videos end up unorganized and hard to reference later.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg mt-1">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Automated & Fast</h3>
                  <p className="text-gray-700">
                    Watch videos uninterrupted while Vid2Blog captures everything automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg mt-1">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Perfect Code Formatting</h3>
                  <p className="text-gray-700">
                    All code snippets are extracted and formatted with proper syntax highlighting.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg mt-1">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Blog Posts</h3>
                  <p className="text-gray-700">
                    Get well-structured, publication-ready blog posts on your Hashnode instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700">
              Three simple steps to transform your video tutorials into blog posts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#9400d3] to-[#ee80e9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Your Hashnode PAT</h3>
              <p className="text-gray-700">
                Connect your Hashnode account by adding your Personal Access Token once.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-[#9400d3] to-[#ee80e9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Video</h3>
              <p className="text-gray-700">
                Upload your tutorial video or paste a link. Our AI starts processing immediately.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-[#9400d3] to-[#ee80e9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Relax & Publish</h3>
              <p className="text-gray-700">
                Your blog post is automatically created and published to your Hashnode blog.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#9400d3] to-[#ee80e9]">
        <div className="max-w-4xl mx-auto text-center">
          <Zap className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Save Time?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of developers who are transforming their learning experience
          </p>
          <button
            onClick={() => navigateTo('signup')}
            className="px-8 py-4 bg-white text-[#9400d3] rounded-lg hover:shadow-xl transition-all font-medium text-lg"
          >
            Start Free Today
          </button>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-[#9400d3] to-[#ee80e9] p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#9400d3] to-[#ee80e9] bg-clip-text text-transparent">
              Vid2Blog
            </span>
          </div>
          <p className="text-gray-600">
            Transform your tutorial videos into blog posts with AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
