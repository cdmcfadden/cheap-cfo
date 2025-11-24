import { useState } from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';
import CallInterface from './components/CallInterface';
import ConversationHistory from './components/ConversationHistory';

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-3">
            Cheap Financial Officer
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Your AI-Powered CFO Tutor
          </p>
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm">
              Master Cash Flow, EBITDA, Investments & More
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <CallInterface
                sessionId={sessionId}
                onSessionStart={setSessionId}
                onSessionEnd={() => setSessionId(null)}
              />
            </div>

            <div className="lg:sticky lg:top-8">
              <ConversationHistory sessionId={sessionId} />
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
              What You Can Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-slate-800 mb-2">Cash Flow Management</h3>
                <p className="text-sm text-slate-600">
                  Understanding cash flow statements and working capital optimization
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-slate-800 mb-2">Financial Metrics</h3>
                <p className="text-sm text-slate-600">
                  EBITDA, ROI, financial ratios, and performance indicators
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-slate-800 mb-2">Investment Analysis</h3>
                <p className="text-sm text-slate-600">
                  Capital allocation, valuation methods, and strategic planning
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>cheapfinancialofficer.com - Empowering Future CFOs</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
