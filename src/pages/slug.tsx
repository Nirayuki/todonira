import React, { useState, useEffect, useContext, useRef } from 'react';
import usePersistedState from '../components/usePersistedState';
import { Layout } from '../components/layout';
import { ListTodos } from '../components/lists/listTodos';

// Modals Components --------------------------------------------------------
import { ModalBadges } from '../components/modals/modalBadges';
import { ModalNewBadge } from '../components/modals/modalNewBadge';
import { CardIsPrivateRoom } from '../components/cards/cardIsPrivateRoom';
import { ModalNewCategoria } from '../components/modals/modalNewCategoria';

// Antd Components -------------------------------------------------------------------
import { Divider, Tooltip, Tour } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TourProps } from 'antd';

// Antd Icons ----------------------------------------------------------------------
import { SettingOutlined } from '@ant-design/icons';

// Services --------------------------------------------
import todoService from '../services/todo.service';
import roomService from '../services/room.service';
import { DocumentData } from 'firebase/firestore';

// Css/Images -------------------------------------------------
import dark from '../assets/dark.svg';
import light from '../assets/light.svg';
import { ThemeContext } from '../theme/ThemeContext';
import '../style/slug.css'
import { ModalCategoriaSettings } from '../components/modals/modalCategoriaSettings';
import { ModalEditTodo } from '../components/modals/modalEditTodo';
import { SelectCategoria } from '../components/selects/selectCategoria';
import { SelectBadge } from '../components/selects/selectBadge';
import { SelectFilter } from '../components/selects/selectFilter';
import { SelectFilterBadge } from '../components/selects/selectFilterBadge';

import img_nova_tarefa from '../assets/nova tarefa.png';
import img_categoria from '../assets/categoria.png';
import img_marcacao from '../assets/marcação.png';
import img_tarefa_list from '../assets/tarefalista.png';
import img_filtrar_categoria from '../assets/filtrar categoria.png';
import img_filtrar_marcacao from '../assets/filtrar marcacao.png';


interface TodoItem {
    id?: string | null | number;
    text: string;
    completed: boolean;
    categoria?: string | [],
    badge?: {
        title: string,
        color: string
    } | null
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

interface ItemBadge {
    title: string,
    color: string
}

function Slug() {

    const { theme, toggleTheme } = useContext(ThemeContext);

    // Private Room state -------------------------------------------------------------------------
    const [isPrivateRoom, setIsPrivateRoom] = usePersistedState('isPrivateRoom', false);

    // Datas states --------------------------------------------------------------------------------
    const [dataPrivateRoom, setDataPrivateRoom] = useState<RoomData | DocumentData | undefined>([]);
    const [data, setData] = useState<TodoItem[]>([]);
    const [dataFiltered, setDataFiltered] = useState<TodoItem[]>([]);
    const [dataInput, setDataInput] = useState<string>('');

    // Loaders state -------------------------------------------------------------------------------
    const [roomDataLoaded, setRoomDataLoaded] = useState(false);

    // Modals states --------------------------------------------------------------------
    const [modalNewCategoria, setModalNewCategoria] = useState(false);
    const [modalCategoriaSettings, setModalCategoriaSettings] = useState<boolean>(false);
    const [modalEdit, setModalEdit] = useState<boolean>(false);
    const [modalBagdes, setModalBadges] = useState<boolean>(false);
    const [modalNewBadge, setModalNewBadge] = useState<boolean>(false);

    // Settings categoria States ---------------------------------------------------------------
    const [settings, setSettings] = useState<string[]>([]);
    const [categoria, setCategoria] = useState("all");
    const [categoriaInput, setCategoriaInput] = useState<string>("");

    // Edit categoria states -------------------------------------------------------------------
    const [editData, setEditData] = useState<TodoItem>();

    // Badge states ----------------------------------------------------------------------------
    const [badge, setBadge] = useState<string | undefined>(dataPrivateRoom?.badges ? dataPrivateRoom?.badges[0].title : undefined);
    const [dataBadges, setDataBadges] = useState<ItemBadge[]>([]);

    // Filter states --------------------------------------------------------------------------
    const [filterBadge, setFilterBadge] = useState("all");
    const [filterCategoria, setFilterCategoria] = useState("all");


    // Ref for tour ----------------------------------------------------------------------------
    const refInput = useRef(null);
    const refCategoria = useRef(null);
    const refBadge = useRef(null);
    const refList = useRef(null);
    const refFilterCategoria = useRef(null);
    const refFilterBadge = useRef(null);
    const [openTour, setOpenTour] = useState(false);

    const steps: TourProps['steps'] = [
        {
            title: 'Criar uma nova tarefa',
            description: 'Nesse campo você deverá digitar a sua tarefa',
            cover: (
                <img
                    alt="tour.png"
                    src={img_nova_tarefa}
                />
            ),
            target: () => refInput.current,
        },
        {
            title: 'Adicionar uma categoria',
            description: 'Após escrever sua tarefa, nesse campo você escolherá a categoria de sua tarefa',
            cover: (
                <img
                    alt="tour.png"
                    src={img_categoria}
                />
            ),
            target: () => refCategoria.current,
        },
        {
            title: 'Adicionar uma marcação a tarefa',
            description: 'Após escolhar a categoria de sua tarefa, nesse campo você escolherá a marcação de sua tarefa',
            cover: (
                <img
                    alt="tour.png"
                    src={img_marcacao}
                />
            ),
            target: () => refBadge.current,
        },
        {
            title: 'Visualização de sua tarefa',
            description: 'Após você adicionar uma tarefa, você poderá visualizar ela nesse campo',
            cover: (
                <img
                    alt="tour.png"
                    src={img_tarefa_list}
                />
            ),
            target: () => refList.current,
        },
        {
            title: 'Filtrar tarefas por categorias',
            description: 'Para você poder visualizar tarefas de categorias especificas, basta você selecionar o filtro de categoria que deseja nesse campo.',
            cover: (
                <img
                    alt="tour.png"
                    src={img_filtrar_categoria}
                />
            ),
            target: () => refFilterCategoria.current,
        },
        {
            title: 'Filtrar tarefas por marcação',
            description: 'Para você poder visualizar tarefas de marcações especificas, basta você selecionar o filtro de marcações que deseja nesse campo.',
            cover: (
                <img
                    alt="tour.png"
                    src={img_filtrar_marcacao}
                />
            ),
            target: () => refFilterBadge.current,
        },
    ];


    useEffect(() => {
        const path = window.location.pathname.substring(1);
        const storageTour = localStorage.getItem('tour');
        const fetchData = async () => {
            try {
                const dataRoom = await todoService.getRoomData();

                const alwaysLoggedIn = localStorage.getItem(path);
                setIsPrivateRoom(alwaysLoggedIn ? false : dataRoom?.isPrivate ?? false);


                setDataPrivateRoom(dataRoom);

                setRoomDataLoaded(true);
            } catch (error) {
                console.error("Error getting room data:", error);
                setIsPrivateRoom(false);
                setRoomDataLoaded(true);
            }
        };

        fetchData();

        if (storageTour === "false" || window.innerWidth < 730) {
        } else {
            setOpenTour(true);
        }

        const unsubscribe = todoService.subscribeToTodos((todos: TodoItem[]) => {
            setData(todos);
        });

        const unsubscribeRoom = roomService.subscribeRoom((room: RoomData) => {
            setDataPrivateRoom(room);
        });

        // Cleanup do ouvinte ao desmontar o componente.
        return () => {
            unsubscribe()
            unsubscribeRoom()
        };


    }, [categoria]);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        const badgeObject: ItemBadge[] = dataPrivateRoom?.badges.filter((filter: { title: string }) => filter.title === badge);
        if (e.key === 'Enter' && dataInput.trim() !== "") {
            if (dataInput.length > 150) {
                return
            } else {
                const newItem: TodoItem = {
                    text: dataInput,
                    completed: false,
                    categoria: categoriaInput ? categoriaInput : [],
                    badge: badge ? {
                        title: badgeObject[0].title,
                        color: badgeObject[0].color
                    } : null,
                };

                await todoService.addTodo(newItem);
                setDataInput("");
            }
        }
    }

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDataInput(e.currentTarget.value);
    }

    const onChangeCheckBox = async (e: CheckboxChangeEvent, todo: TodoItem) => {
        await todoService.updateTodo(todo.id, { ...todo, completed: e.target.checked });
    }

    const handleDelete = async (itemId: string | number | null | undefined) => {
        await todoService.deleteTodo(itemId);
    };

    const handleSettings = async () => {
        const newItem = await dataPrivateRoom?.categoria.map((item: any) => { return item });
        setSettings(newItem);
        setModalCategoriaSettings(true);
    }

    const handleSettingsBadges = async () => {
        const newData = await dataPrivateRoom?.badges.map((item: any) => { return item });
        setDataBadges(newData);
        setModalBadges(true);
    }

    if (!roomDataLoaded) {
        return null;
    }

    return (
        <Layout hasChildren={true}>

            {
                isPrivateRoom ?
                    <CardIsPrivateRoom data={dataPrivateRoom} setIsPrivateRoom={setIsPrivateRoom} />
                    :

                    <div className="container">
                        <ModalNewBadge open={modalNewBadge} setOpen={setModalNewBadge} data={dataPrivateRoom} />
                        <ModalNewCategoria open={modalNewCategoria} setOpen={setModalNewCategoria} data={dataPrivateRoom} setCategoriaInput={setCategoriaInput} />
                        <ModalCategoriaSettings
                            open={modalCategoriaSettings}
                            setOpen={setModalCategoriaSettings}
                            dataSettings={settings}
                            setDataSettings={setSettings}
                            categoriaInput={categoriaInput}
                            setCategoriaInput={setCategoriaInput}
                            setCategoria={setCategoria}
                            categoria={categoria}
                        />
                        <ModalEditTodo open={modalEdit} setOpen={setModalEdit} data={dataPrivateRoom} dataEdit={editData} />
                        <ModalBadges open={modalBagdes} setOpen={setModalBadges} data={dataPrivateRoom} setBadge={setBadge} dataBadges={dataBadges} setDataBadges={setDataBadges} />
                        <div className="head">
                            <div className="select">
                                <div
                                    ref={refCategoria}
                                >
                                    <SelectCategoria
                                        setModalNewCategoria={setModalNewCategoria}
                                        setCategoriaInput={setCategoriaInput}
                                        categoriaInput={categoriaInput}
                                        data={dataPrivateRoom}
                                    />
                                </div>
                                <Tooltip title="Configuração das Categorias">
                                    <SettingOutlined onClick={() => handleSettings()} />
                                </Tooltip>
                                <div
                                    ref={refBadge}
                                >
                                    <SelectBadge data={dataPrivateRoom} badge={badge} setBadge={setBadge} setModalNewBadge={setModalNewBadge} />
                                </div>
                                <Tooltip title="Configuração das Marcações">
                                    <SettingOutlined onClick={() => handleSettingsBadges()} />
                                </Tooltip>
                            </div>
                            <input ref={refInput} className='input-head' type="text" placeholder='Digite sua tarefa aqui...' value={dataInput} onChange={onChange} onKeyDown={handleKeyDown} />
                            <span className='conter' style={{ color: dataInput && dataInput.length > 150 ? "red" : "black" }}>{dataInput ? dataInput.length : "0"}</span>
                        </div>
                        <div className="list-todo">
                            <div className='header-filter-theme' style={{}}>
                                <div className="left">
                                    <span>Lista de Todo's</span>
                                    <Tooltip title="Mudar tema">
                                        <img className='theme' src={theme === 'dark' ? light : dark} onClick={toggleTheme} />
                                    </Tooltip>
                                </div>
                            </div>
                            <Divider className='divider' style={{ margin: "0px" }} orientation='left'>Filtros</Divider>
                            <div className="list">
                                <div className="filter">
                                    <div ref={refFilterBadge}>
                                        <SelectFilterBadge
                                            dataRoom={dataPrivateRoom}
                                            setFilterBadge={setFilterBadge}
                                        />
                                    </div>
                                    <div ref={refFilterCategoria}>
                                        <SelectFilter
                                            dataRoom={dataPrivateRoom}
                                            setFilterCategoria={setFilterCategoria}
                                        />
                                    </div>
                                </div>
                                <Divider className='divider-list' style={{ margin: "5px" }} />
                                <div ref={refList}>
                                <ListTodos data={data} dataFiltered={dataFiltered} setDataFiltered={setDataFiltered} setEditData={setEditData} filterBadge={filterBadge} filterCategoria={filterCategoria} setModalEdit={setModalEdit} handleDelete={handleDelete} onChangeCheckBox={onChangeCheckBox} />
                                </div>
                            </div>
                        </div>
                        <Tour open={openTour} onClose={() => setOpenTour(false)} onFinish={() => {
                            setOpenTour(false);
                            localStorage.setItem('tour', "false")
                        }} steps={steps} />
                    </div>
            }
        </Layout>
    )
}

export default Slug;
