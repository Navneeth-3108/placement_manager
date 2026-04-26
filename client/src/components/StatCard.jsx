const StatCard = ({ title, value, tone = 'ocean' }) => {
  const tones = {
    ocean: 'from-emerald-400 to-teal-300',
    coral: 'from-lime-300 to-emerald-500',
    fern: 'from-green-500 to-emerald-300',
    ink: 'from-emerald-700 to-green-500',
  };

  return (
    <div className="fade-up rounded-2xl border border-emerald-900/55 bg-[#0b1612]/85 p-4 shadow-card">
      <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${tones[tone] || tones.ocean}`} />
      <p className="text-sm text-emerald-100/70">{title}</p>
      <p className="text-3xl font-bold text-emerald-50">{value}</p>
    </div>
  );
};

export default StatCard;
