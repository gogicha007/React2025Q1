"use client";

import { useEffect, useState } from 'react';
import ClientComponent from './ClientComponent';
import type { IResponse } from 'types/interface';

export default function Home() {
  const [initialData, setInitialData] = useState<IResponse | null>(null);
  const [initialPage, setInitialPage] = useState<number>(1);
  const [initialStatus, setInitialStatus] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${initialPage}${initialStatus ? `&status=${initialStatus}` : ''}`);
      const data: IResponse = await response.json();
      setInitialData(data);
      setInitialPage(Number(initialPage));
      setInitialStatus(initialStatus);
    };

    fetchData();
  }, [initialPage, initialStatus]);

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <ClientComponent initialData={initialData} initialPage={initialPage} initialStatus={initialStatus} />
  );
}