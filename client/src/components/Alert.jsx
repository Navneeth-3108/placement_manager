const Alert = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-emerald-800/70 bg-emerald-900/25 px-4 py-2 text-sm text-emerald-200">
      {message}
    </div>
  );
};

export default Alert;
