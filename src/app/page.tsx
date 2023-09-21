'use client'
import '../styles/home.css';
import { useAuthContext } from '@/components/authContext';

export default function Home() {

  const auth = useAuthContext();

  return (
    <div className="container">
      <div className="boasvindas">
        {auth?.user ? (
          <>
            <p><span>{auth.user.name}</span>, boas vindas</p>
          </>
        ) : <h1>Boas vindas!</h1>}
      </div>
      <div className="line"></div>
      <h4>Suas listas</h4>
      {!auth?.user ? (
        <div className="no-user">
          <p>Faça o login para acessar suas listas.</p>
        </div>
      ) : (
        <div className='list'>
          Listagem
        </div>
      )}
    </div>
  )
}
