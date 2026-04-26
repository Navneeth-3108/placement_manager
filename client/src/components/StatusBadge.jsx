const styleMap = {
  Applied: 'bg-emerald-900/35 text-emerald-200 ring-1 ring-emerald-700/60',
  Selected: 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-300/40',
  Rejected: 'bg-slate-800 text-slate-300 ring-1 ring-slate-600',
};

const StatusBadge = ({ status }) => {
  const cls = styleMap[status] || 'bg-slate-800 text-slate-200 ring-1 ring-slate-600';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
};

export default StatusBadge;
