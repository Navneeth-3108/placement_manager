import { SignIn } from '@clerk/clerk-react';

const clerkAppearance = {
  variables: {
    colorPrimary: '#22c55e',
    colorBackground: '#0b1410',
    colorInputBackground: '#122018',
    colorText: '#e7fbe9',
    colorTextSecondary: '#93c5a2',
    borderRadius: '0.8rem',
  },
  elements: {
    card: 'border border-emerald-900/70 bg-[#08100c] shadow-2xl',
    formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold',
    footerActionLink: 'text-emerald-300 hover:text-emerald-200',
  },
};

const SignInPage = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060b08] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.16),transparent_35%)]" />
      <div className="relative z-10 grid w-full max-w-5xl gap-8 rounded-3xl border border-emerald-900/60 bg-black/50 p-6 backdrop-blur-xl lg:grid-cols-2 lg:p-10">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-emerald-400">Placement Manager</p>
          <h1 className="text-4xl font-black leading-tight text-emerald-50">Clean hiring operations, secured access.</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100/75">
            Sign in to manage students, companies, jobs, applications, and placements from one elegant control room.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-in" appearance={clerkAppearance} />
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
