import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useFetch = (url, options = {}) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken || !url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          ...options,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, accessToken, options]);

  return { data, loading, error };
};

export default useFetch;
