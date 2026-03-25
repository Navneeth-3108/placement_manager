const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-10 mb-6 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm lg:hidden"
        >
          Menu
        </button>
        <div>
          <p className="text-sm text-slate-500">Campus Hiring Operations</p>
          <h2 className="text-lg font-bold text-slate-800">Placement Management System</h2>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
