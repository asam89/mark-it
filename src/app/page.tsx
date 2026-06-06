import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">Mark-It</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            AI-Powered Marketing
            <br />
            <span className="text-indigo-600">for Small Businesses</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent marketing operating system. Get personalized strategy,
            channel management, budget allocation, and ROI tracking — all from a
            single dashboard.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              href="#features"
              className="px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              See Features
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🤖
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Business Profiling</h3>
            <p className="mt-2 text-gray-600">
              Chat with our AI consultant to build a deep understanding of your business,
              market, and compliance needs.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              💰
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Budget Allocation</h3>
            <p className="mt-2 text-gray-600">
              AI recommends how to split your budget across channels based on your
              business type, goals, and location.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Unified Dashboard</h3>
            <p className="mt-2 text-gray-600">
              See all your marketing metrics in one place with AI-generated insights
              and a plain-English ROI analysis.
            </p>
          </div>
        </div>

        {/* Platforms */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Connect All Your Channels</h2>
          <p className="mt-2 text-gray-600">Sync data from the platforms that matter to your business</p>
          <div className="mt-8 flex items-center justify-center gap-8 flex-wrap text-4xl">
            <span title="Meta">📘</span>
            <span title="Instagram">📸</span>
            <span title="Google">🔍</span>
            <span title="TikTok">🎵</span>
            <span title="LinkedIn">💼</span>
            <span title="YouTube">▶️</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Simple Pricing</h2>
          <p className="mt-2 text-gray-600 text-center">Start free, upgrade as you grow</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900">Starter</h3>
              <p className="mt-1 text-3xl font-bold text-gray-900">$49<span className="text-base font-normal text-gray-500">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>1 business</li>
                <li>3 platform connections</li>
                <li>Basic dashboard</li>
                <li>AI onboarding</li>
              </ul>
            </div>
            <div className="p-6 bg-indigo-600 rounded-2xl text-white ring-2 ring-indigo-600 ring-offset-2">
              <h3 className="font-semibold">Growth</h3>
              <p className="mt-1 text-3xl font-bold">$99<span className="text-base font-normal text-indigo-200">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-indigo-100">
                <li>1 business</li>
                <li>All platform connections</li>
                <li>Full dashboard + ROI meter</li>
                <li>Lead tracking</li>
              </ul>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900">Pro</h3>
              <p className="mt-1 text-3xl font-bold text-gray-900">$199<span className="text-base font-normal text-gray-500">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Up to 3 businesses</li>
                <li>All features</li>
                <li>Content suggestions</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>© 2024 Mark-It. All rights reserved.</span>
          <span>AI-powered marketing intelligence</span>
        </div>
      </footer>
    </div>
  );
}
