export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-6">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          New
        </span>
        <p className="text-xs text-orange-700 font-medium">
          Built for Cambodian University Students 🇰🇭
        </p>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 max-w-3xl leading-tight">
        Master Your University <span className="text-orange-600">Journey</span>
      </h1>

      <p className="mt-6 text-slate-600 max-w-xl text-lg">
        Stop juggling between Telegram and notebooks. Manage your schedules,
        assignments, and AI study plans in one place.
      </p>

      <div className="mt-10">
        <button className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-orange-200">
          Create Free Account
        </button>
      </div>
    </div>
  );
}
