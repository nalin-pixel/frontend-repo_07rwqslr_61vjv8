import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 w-full overflow-hidden rounded-b-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/l3ufsRa1W8xbZt4O/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/30 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full flex items-end p-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800">Onebox Dashboard</h1>
          <p className="text-slate-600 text-sm">Shiny, holographic mailbox vibes — unified email, AI-powered.</p>
        </div>
      </div>
    </div>
  );
}
