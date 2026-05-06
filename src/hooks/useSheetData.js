import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { getSheetUrl } from '../config/sheets';

export function useSheetData(year, tab) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = getSheetUrl(year, tab);
    if (!url) {
      setData([]);
      setLoading(false);
      setError('Sheet not configured for this year yet.');
      return;
    }

    setLoading(true);
    setError(null);

    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: (err) => {
        setError(`Failed to load data: ${err.message}`);
        setLoading(false);
      },
    });
  }, [year, tab]);

  return { data, loading, error };
}
