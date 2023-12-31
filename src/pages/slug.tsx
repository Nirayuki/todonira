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
import { Divider, Input, Tooltip, Tour } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TourProps } from 'antd';
import type { Color } from 'antd/es/color-picker';

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

import { ModalAddTodo } from '../components/modals/modalAddTodo';
import { ModalSettings } from '../components/modals/modalSettings';


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
    color: Color | string
}

function Slug() {

    const { theme, toggleTheme } = useContext(ThemeContext);

    // Private Room state -------------------------------------------------------------------------
    const [isPrivateRoom, setIsPrivateRoom] = useState(false);

    // Datas states --------------------------------------------------------------------------------
    const [dataPrivateRoom, setDataPrivateRoom] = useState<RoomData | DocumentData | undefined>([]);
    const [data, setData] = useState<TodoItem[]>([]);
    const [dataFiltered, setDataFiltered] = useState<TodoItem[]>([]);
    const [dataInput, setDataInput] = useState<string>('');

    // Loaders state -------------------------------------------------------------------------------
    const [roomDataLoaded, setRoomDataLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modals states --------------------------------------------------------------------
    const [modalEdit, setModalEdit] = useState<boolean>(false);
    const [modalSettings, setModalSettings] = useState<boolean>(false);
    const [modalAddTodo, setModalAddTodo] = useState<boolean>(false);

    // Settings categoria States ---------------------------------------------------------------
    const [categoria, setCategoria] = useState("all");
    const [categoriaInput, setCategoriaInput] = useState<string | undefined>(undefined);
    const [dataCategoria, setDataCategoria] = useState<string[]>([]);

    // Edit categoria states -------------------------------------------------------------------
    const [editData, setEditData] = useState<TodoItem>();

    // Badge states ----------------------------------------------------------------------------
    const [badge, setBadge] = useState<string | undefined>(dataPrivateRoom?.badges ? dataPrivateRoom?.badges[0].title : undefined);
    const [dataBadges, setDataBadges] = useState<ItemBadge[]>([]);

    // Filter states --------------------------------------------------------------------------
    const [filterBadge, setFilterBadge] = useState("all");
    const [filterCategoria, setFilterCategoria] = useState("all");


    // Ref for tour ----------------------------------------------------------------------------
    const [openTour, setOpenTour] = useState(false);

    const steps: TourProps['steps'] = [
        {
            title: "Como eu acesso minha lista novamente?",
            description: "Copie o link da URL(https://todonira.vercel.app/sualista) da sua Lista de tarefa e guarde ela para poder acessa-la novamente"
        }
    ];


    useEffect(() => {
        const path = window.location.pathname.substring(1);
        const storageTour = localStorage.getItem('tour');
        const fetchData = async () => {
            try {
                setLoading(true);
                const dataRoom = await todoService.getRoomData();

                const alwaysLoggedIn = localStorage.getItem(path);
                setIsPrivateRoom(alwaysLoggedIn ? false : dataRoom?.isPrivate ?? false);

                setDataPrivateRoom(dataRoom);
                
                const dataTodo = await todoService.getDocs();
                setData(dataTodo);
                setRoomDataLoaded(true);
            } catch (error) {
                console.error("Error getting room data:", error);
                setIsPrivateRoom(false);
                setRoomDataLoaded(true);
            } finally {
                setLoading(false);
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

        if (e.key === 'Enter' && dataInput.trim() !== "") {
            if (dataInput.length > 150) {
                return
            } else {
                setModalAddTodo(true);
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

    const handleSettings = () => {
        setDataCategoria(dataPrivateRoom?.categoria);
        setDataBadges(dataPrivateRoom?.badges);
        setModalSettings(true);
    }

    if(!roomDataLoaded){
        return
    }

    return (
        <Layout hasChildren={true}>
            {
                isPrivateRoom ?
                    <CardIsPrivateRoom data={dataPrivateRoom} setIsPrivateRoom={setIsPrivateRoom} />
                    :

                    <div className="container">
                        <ModalSettings
                            open={modalSettings}
                            setOpen={setModalSettings}
                            data={dataPrivateRoom}
                            setData={setDataPrivateRoom}
                            dataCategoria={dataCategoria}
                            setDataCategoria={setDataCategoria}
                            dataBadges={dataBadges}
                            setDataBadges={setDataBadges}
                        />

                        <ModalEditTodo open={modalEdit} setOpen={setModalEdit} data={dataPrivateRoom} dataEdit={editData} />
                        <ModalAddTodo
                            open={modalAddTodo}
                            setOpen={setModalAddTodo}
                            dataInput={dataInput}
                            setDataInput={setDataInput}
                            dataPrivateRoom={dataPrivateRoom}
                            categoriaInput={categoriaInput}
                            setCategoriaInput={setCategoriaInput}
                            badge={badge}
                            setBadge={setBadge}
                        >
                            <SelectCategoria setCategoriaInput={setCategoriaInput} categoriaInput={categoriaInput} data={dataPrivateRoom} />
                            <SelectBadge setBadge={setBadge} badge={badge} data={dataPrivateRoom} />
                        </ModalAddTodo>
                        <div className="head">
                            <Input
                                className='input-head'
                                type="text"
                                placeholder='Digite sua tarefa aqui...'
                                value={dataInput}
                                onChange={onChange}
                                onKeyDown={handleKeyDown}
                                allowClear
                            />
                        </div>
                        <div className="list-todo">
                            <div className="list">
                                <div className="filter">
                                    <div>
                                        <SelectFilter
                                            dataRoom={dataPrivateRoom}
                                            setFilterCategoria={setFilterCategoria}
                                            setFilterBadge={setFilterBadge}
                                        />
                                    </div>
                                    <div className="container-right">
                                        <Tooltip title="Mudar tema">
                                            <img className='theme' src={theme === 'dark' ? light : dark} onClick={toggleTheme} />
                                        </Tooltip>
                                        <SettingOutlined onClick={() => handleSettings()} />
                                    </div>
                                </div>
                                <Divider className='divider-list' style={{ margin: "5px" }} />
                                <div>
                                <ListTodos dataRoom={dataPrivateRoom} loading={loading} data={data} dataFiltered={dataFiltered} setDataFiltered={setDataFiltered} setEditData={setEditData} filterBadge={filterBadge} filterCategoria={filterCategoria} setModalEdit={setModalEdit} handleDelete={handleDelete} onChangeCheckBox={onChangeCheckBox} />
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
