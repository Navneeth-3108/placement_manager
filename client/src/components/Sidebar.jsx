import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/companies', label: 'Companies' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/applications', label: 'Applications' },
  { to: '/placements', label: 'Placements' },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-20 bg-black/70 backdrop-blur-sm lg:hidden ${open ? 'block' : 'hidden'}`}
      />
      <aside
        className={`fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-emerald-900/50 bg-[#08110d] p-4 text-emerald-100 shadow-card transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 rounded-xl border border-emerald-900/70 bg-emerald-900/20 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Placement</p>
          <h1 className="text-2xl font-bold text-emerald-50">Manager</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/50'
                    : 'text-emerald-100/80 hover:bg-emerald-900/35 hover:text-emerald-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
