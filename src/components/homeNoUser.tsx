import '../styles/homenouser.css'
import criarlista from '../assets/criar lista.PNG';
import editarlista from '../assets/editar lista.PNG';
import gerenciarlistas from '../assets/gerenciar listas.PNG';
import listashow from '../assets/lista.PNG';
import listas from '../assets/listas.PNG';
import Image from 'next/image';

export const HomeNoUser = () => {
    return (
        <div className="container">
            <div className="boasvindas">
                <h1>Boas vindas!</h1>
            </div>
            <p>Crie sua conta no TODOLIST mais incrível do mundo!</p>
            <p style={{ marginTop: "20px" }}>O projeto todonira é feito para acabar com seu sofrimento para se organizar, e também para criar listas complexas. Todonira é uma ferramente de listas com interface simples e objetiva.</p>
            <div className="line"></div>
            <div className="photos">
                <div className="item_photo">
                    <p>Listas</p>
                    <Image src={listas} alt="Lista" />
                </div>
                <div className="item_photo">
                    <p>Lista</p>
                    <Image src={listashow} alt="Lista" />
                </div>
                <div className="item_photo">
                    <p>Criar lista</p>
                    <Image src={criarlista} alt="Criar lista" />
                </div>
                <div className="item_photo">
                    <p>Editar lista</p>
                    <Image src={editarlista} alt="Editar lista" />
                </div>
                <div className="item_photo">
                    <p>Gerenciar lista</p>
                    <Image src={gerenciarlistas} alt="Gerenciar lista" />
                </div>
            </div>
        </div>
    )
}