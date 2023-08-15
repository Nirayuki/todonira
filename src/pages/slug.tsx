import React, { useState, useEffect, useContext } from 'react';
import usePersistedState from '../components/usePersistedState';
import { Layout } from '../components/layout';
import { ListTodos } from '../components/lists/listTodos';

// Modals Components --------------------------------------------------------
import { ModalBadges } from '../components/modals/modalBadges';
import { ModalNewBadge } from '../components/modals/modalNewBadge';
import { CardIsPrivateRoom } from '../components/cards/cardIsPrivateRoom';
import { ModalNewCategoria } from '../components/modals/modalNewCategoria';

// Antd Components -------------------------------------------------------------------
import { Divider, Tooltip } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

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

    useEffect(() => {
        const path = window.location.pathname.substring(1);
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
        const unsubscribe = todoService.subscribeToTodos((todos: TodoItem[]) => {
            setData(todos);
            setDataFiltered(categoria === "all" ? todos : todos.filter(filter => filter.categoria === categoria));
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
                    } : null
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
                                <Tooltip
                                    title="Categorias"
                                >
                                    <SelectCategoria
                                        setModalNewCategoria={setModalNewCategoria}
                                        setCategoriaInput={setCategoriaInput}
                                        categoriaInput={categoriaInput}
                                        data={dataPrivateRoom}
                                    />
                                </Tooltip>
                                <Tooltip title="Configuração das Categorias">
                                    <SettingOutlined onClick={() => handleSettings()} />
                                </Tooltip>
                                <Tooltip title="Badges">
                                    <SelectBadge data={dataPrivateRoom} badge={badge} setBadge={setBadge} setModalNewBadge={setModalNewBadge} />
                                </Tooltip>
                                <Tooltip title="Configuração das Badges">
                                    <SettingOutlined onClick={() => handleSettingsBadges()} />
                                </Tooltip>
                            </div>
                            <input className='input-head' type="text" placeholder='Digite aqui...' value={dataInput} onChange={onChange} onKeyDown={handleKeyDown} />
                            <span className='conter' style={{ color: dataInput && dataInput.length > 150 ? "red" : "black" }}>{dataInput ? dataInput.length : "0"}</span>
                        </div>
                        <div className="list-todo">
                            <div className='header-filter-theme' style={{ }}>
                                <div className="left">
                                    <span>Lista de Todo's</span>
                                    <Tooltip title="Mudar tema">
                                        <img className='theme' src={theme === 'dark' ? light : dark} onClick={toggleTheme} />
                                    </Tooltip>
                                </div>
                                <div className="filter">
                                    <Tooltip title="Filtrar Badges">
                                        <SelectFilterBadge
                                            dataRoom={dataPrivateRoom}
                                            setFilterBadge={setFilterBadge}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Filtrar Categorias">
                                        <SelectFilter
                                            dataRoom={dataPrivateRoom}
                                            setFilterCategoria={setFilterCategoria}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            <Divider className='divider' style={{ margin: "0px" }} />
                            <div className="list">
                                <ListTodos data={data} dataFiltered={dataFiltered} setDataFiltered={setDataFiltered} setEditData={setEditData} filterBadge={filterBadge} filterCategoria={filterCategoria} setModalEdit={setModalEdit} handleDelete={handleDelete} onChangeCheckBox={onChangeCheckBox} />
                            </div>
                        </div>
                    </div>
            }
        </Layout>
    )
}

export default Slug;
