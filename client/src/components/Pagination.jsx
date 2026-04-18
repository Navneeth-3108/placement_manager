const Pagination = ({ pagination, onChange }) => {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        className="ui-btn-ghost px-3 py-1"
      >
        Prev
      </button>
      <span className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="ui-btn-ghost px-3 py-1"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
