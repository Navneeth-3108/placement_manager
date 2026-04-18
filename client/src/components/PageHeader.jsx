const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-4 fade-up">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
};

export default PageHeader;
