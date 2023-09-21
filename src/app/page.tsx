'use client'
import { useEffect, useState } from 'react';
import '../styles/home.css';
import { useAuthContext } from '@/components/authContext';
import userService from '@/services/user.service';

import { useRouter } from 'next/navigation';
import { HomeNoUser } from '@/components/homeNoUser';
import { HomeHasUser } from '@/components/homeHasUser';
import { LoadingOutlined } from '@ant-design/icons';
import { HomeLoadingSkeleton } from '@/components/homeLoadingSkeleton';

export default function Home() {

  const auth = useAuthContext();
  const [data, setData] = useState<any[]>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (auth?.user) {
        const res: any = await userService.getUser(auth?.user.id);

        setData(res.listas);

      }
    }

    fetchData()
  }, [])

  return (
    <>
      {auth?.loading && (<HomeLoadingSkeleton />)}
      {!auth?.user && !auth?.loading && (<HomeNoUser />)}
      {auth?.user && (<HomeHasUser />)}
    </>
  )
}
