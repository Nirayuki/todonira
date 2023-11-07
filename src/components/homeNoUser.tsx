import '../styles/homenouser.css'

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
                    <img src="/listas.png" alt="Lista" />
                </div>
                <div className="item_photo">
                    <p>Lista</p>
                    <img src="/lista.png" alt="Lista" />
                </div>
                <div className="item_photo">
                    <p>Criar lista</p>
                    <img src="/criar_lista.png" alt="Criar lista" />
                </div>
                <div className="item_photo">
                    <p>Editar lista</p>
                    <img src="/editar_lista.png" alt="Editar lista" />
                </div>
                <div className="item_photo">
                    <p>Gerenciar lista</p>
                    <img src="/gerenciar_listas.png" alt="Gerenciar lista" />
                </div>
            </div>
        </div>
    )
}