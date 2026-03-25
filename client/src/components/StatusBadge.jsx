const styleMap = {
  Applied: 'bg-sky-100 text-sky-700',
  Selected: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }) => {
  const cls = styleMap[status] || 'bg-slate-100 text-slate-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
};

export default StatusBadge;
