import { useCallback, useEffect, useState } from 'react';

const usePaginatedResource = (fetcher, initialQuery = {}) => {
  const [query, setQuery] = useState({ page: 1, limit: 10, ...initialQuery });
  const [state, setState] = useState({
    data: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
    loading: false,
    error: '',
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const result = await fetcher(query);
      setState({
        data: result.data,
        pagination: result.pagination,
        loading: false,
        error: '',
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message || 'Failed to load data' }));
    }
  }, [fetcher, query]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    ...state,
    query,
    setQuery,
    reload: load,
  };
};

export default usePaginatedResource;
