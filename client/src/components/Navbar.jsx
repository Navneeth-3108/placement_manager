const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-10 mb-6 rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="ui-btn-ghost px-3 py-1.5 lg:hidden"
        >
          <span className="sr-only">Open menu</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-700">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div>
          <p className="text-sm text-slate-500">Campus Hiring Operations</p>
          <h2 className="text-lg font-bold text-slate-800">Placement Management System</h2>
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1">API</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1">DB</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
