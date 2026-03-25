const StatCard = ({ title, value, tone = 'ocean' }) => {
  const tones = {
    ocean: 'from-sky-500 to-cyan-400',
    coral: 'from-orange-500 to-amber-400',
    fern: 'from-emerald-500 to-lime-400',
    ink: 'from-slate-700 to-slate-500',
  };

  return (
    <div className="fade-up rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${tones[tone] || tones.ocean}`} />
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default StatCard;
