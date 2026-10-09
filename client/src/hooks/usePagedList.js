import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client.js';

export function usePagedList(fetcher, params) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const key = JSON.stringify(params);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(JSON.parse(key));
      setItems(data.items);
      setMeta(data.meta);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [fetcher, key]);

  useEffect(() => { reload(); }, [reload]);

  return { items, meta, loading, error, setError, reload };
}