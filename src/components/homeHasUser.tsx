'use client'
import { useEffect, useState } from 'react';
import '../styles/home.css';
import { useAuthContext } from '@/components/authContext';
import userService from '@/services/user.service';

import { useRouter } from 'next/navigation';
import Skeleton from './Skeleton';
import { MdOutlineDataObject } from 'react-icons/md';

export const HomeHasUser = () => {
    const auth = useAuthContext();
    const [data, setData] = useState<any[]>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            if (auth?.user) {
                const res: any = await userService.getUser(auth?.user.id);

                setData(res.listas);
                setLoading(false);
            }
        }

        fetchData()
    }, [])

    return (
        <div className="container">
            <div className="boasvindas">
                <p><span>{auth?.user.name}</span>, boas vindas</p>
            </div>
            <div className="line-home"></div>
            <h4>Suas listas</h4>
            {loading && (
                <div className='list'>
                    <Skeleton width='100%' height='58px' />
                    <Skeleton width='100%' height='58px' />
                    <Skeleton width='100%' height='58px' />
                    <Skeleton width='100%' height='58px' />
                    <Skeleton width='100%' height='58px' />
                </div>
            )}
            {data?.length === 0 ? (
                <p className='no-data'><MdOutlineDataObject/> Sem Listas</p>
            ) : (
                <div className='list'>

                    {!loading && data?.map((item, key) => {
                        return (
                            <div className='card' key={key} onClick={() => {
                                router.push(`/lista/${item.title.replace(/ /g, "-").toLocaleLowerCase()}?id=${item.id}`);
                            }}>
                                {item.title}
                            </div>
                        )
                    }).reverse()}
                </div>
            )}
        </div>
    )
}