import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { client } from '../lib/axios';

function useApi<T>(config: AxiosRequestConfig): { loading: boolean; data: T | null } {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

  const fetchApi = async () => {
    const { data } = await client(config);

    setLoading(false);
    setData(data as T);

    return data;
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return { loading, data };
}

export default useApi;
