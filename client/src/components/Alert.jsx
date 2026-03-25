const Alert = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
      {message}
    </div>
  );
};

export default Alert;
