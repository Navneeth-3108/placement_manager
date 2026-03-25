const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-4 fade-up">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
};

export default PageHeader;
