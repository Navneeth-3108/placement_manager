import { UserButton } from '@clerk/clerk-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-10 mb-6 rounded-2xl border border-emerald-900/50 bg-[#0b1511]/90 px-4 py-3 shadow-card backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="ui-btn-ghost px-3 py-1.5 lg:hidden"
        >
          <span className="sr-only">Open menu</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-100">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div>
          <p className="text-sm text-emerald-400/80">Campus Hiring Operations</p>
          <h2 className="text-lg font-bold text-emerald-50">Placement Management System</h2>
        </div>
        <div className="hidden items-center gap-2 text-xs text-emerald-200/80 sm:flex">
          <span className="rounded-full border border-emerald-800 bg-emerald-900/30 px-3 py-1">API</span>
          <span className="rounded-full border border-emerald-800 bg-emerald-900/30 px-3 py-1">DB</span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
