import React, { useState, useEffect, useRef, useContext, ChangeEvent } from 'react';
import { Layout } from '../components/layout';
import { Checkbox, Divider, Dropdown, Menu, Card, Button, Select, Modal, Input, Space, List } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { BaseSelectRef } from 'rc-select';
import { SmileOutlined, EllipsisOutlined, EyeFilled, EyeInvisibleFilled, PlusOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import todoService from '../services/todo.service';
import { DocumentData } from 'firebase/firestore';
import dark from '../assets/dark.svg';
import light from '../assets/light.svg';
import { ThemeContext } from '../theme/ThemeContext';
import usePersistedState from '../components/usePersistedState';
import '../style/slug.css'
import roomService from '../services/room.service';
const { Option } = Select;

interface TodoItem {
    id?: string | null | number;
    text: string;
    completed: boolean;
    categoria?: string | []
}

interface isEdit {
    isEdit: boolean,
    isEditingId: string | number | null | undefined
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: []
}

function Slug() {

    const { theme, toggleTheme } = useContext(ThemeContext);

    const [isPrivateRoom, setIsPrivateRoom] = usePersistedState('isPrivateRoom', false);

    const [dataPrivateRoom, setDataPrivateRoom] = useState<RoomData | DocumentData | undefined>([]);

    const [data, setData] = useState<TodoItem[]>([]);
    const [dataFiltered, setDataFiltered] = useState<TodoItem[]>([]);

    const [dataInput, setDataInput] = useState<string>('');


    const [roomDataLoaded, setRoomDataLoaded] = useState(false);

    const [passwordInput, setPasswordInput] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [alwaysLogged, setAlwaysLogged] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inputCategoria, setInputCategoria] = useState<string>("");
    const [modalCategoriaSettings, setModalCategoriaSettings] = useState<boolean>(false);
    const [settings, setSettings] = useState<string[]>([]);
    const [categoria, setCategoria] = useState("all");
    const [categoriaInput, setCategoriaInput] = useState<string | undefined>("");

    const [modalEdit, setModalEdit] = useState<boolean>(false);
    const [editData, setEditData] = useState<TodoItem>();
    const [editCategoria, setEditCategoria] = useState<string | undefined | []>();
    const [editInput, setEditInput] = useState<string | undefined>();

    const [error, setError] = useState<string>("");

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
        if (e.key === 'Enter' && dataInput.trim() !== "") {
            if (dataInput.length > 150) {
                return
            } else {
                const newItem: TodoItem = {
                    text: dataInput,
                    completed: false,
                    categoria: categoriaInput ? categoriaInput : []
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

    const onChangePrivateRoom = (e: React.FormEvent<HTMLInputElement>) => {
        setPasswordInput(e.currentTarget.value);
    }

    const handleEntrar = () => {
        if (dataPrivateRoom?.password === passwordInput) {
            if (alwaysLogged) {
                const path = window.location.pathname.substring(1);
                localStorage.setItem(path, passwordInput);
                setError("");
                setIsPrivateRoom(false);
            } else {
                setError("");
                setIsPrivateRoom(false);
            }
        } else {
            setError("Senha inválida!");
        }
    }

    const handleKeyEntrar = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && dataPrivateRoom?.password.trim() !== "") {
            setIsPrivateRoom(false);
        }
    }

    const handleAlwaysLoggedIn = (e: CheckboxChangeEvent) => {
        setAlwaysLogged(e.target.checked);
    }

    if (!roomDataLoaded) {
        return null;
    }

    const handleOk = async () => {
        if (inputCategoria !== "") {
            await roomService.addRoomCategoria(inputCategoria, dataPrivateRoom);
            setIsModalOpen(false);
            setCategoriaInput(inputCategoria);
            setInputCategoria("");
        } else {
            setIsModalOpen(false);
        }

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCategoriaOk = async () => {
        await roomService.updateCategoria(settings);
        setModalCategoriaSettings(false);
    }

    const hanleCategoriaCancel = () => {
        setModalCategoriaSettings(false);
    }

    const handleSettings = async () => {
        const newItem = await dataPrivateRoom?.categoria.map((item: any) => { return item });
        setSettings(newItem);
        setModalCategoriaSettings(true);
    }

    const handleChangeSettings = (e: ChangeEvent<HTMLInputElement>, key: number) => {
        const updateSettings: string[] = [...settings];
        updateSettings[key] = e.currentTarget.value;

        setSettings(updateSettings);
    }

    const handleDeleteSettings = (key: number) => {
        const updatedSettings = settings.filter((_, index) => index !== key);
        if (categoriaInput === settings[key]) {
            if (categoriaInput === categoria) {
                setCategoria("all");
                setCategoriaInput(undefined);
            } else {
                setCategoriaInput(undefined);
            }
        }
        setSettings(updatedSettings);
    }

    const handleFilter = (e: string) => {
        setCategoria(e);
        setDataFiltered(e === "all" ? data : data.filter(filter => filter.categoria === e));
    }

    const handleEditOk = async () => {
        const newItem = {
            id: editData?.id,
            completed: editData?.completed,
            text: editInput ? editInput : editData?.text,
            categoria: editCategoria ? editCategoria : editData?.categoria ? editData?.categoria : null
        }

        await todoService.updateTodo(editData?.id, newItem);
        setEditInput(undefined);
        setEditCategoria(undefined);
        setModalEdit(false);
    }

    const handleEditCancel = () => {
        setModalEdit(false);
        setEditInput(undefined);
        setEditCategoria(undefined);
    }


    return (
        <Layout>

            {
                isPrivateRoom ?

                    <Card className='card' bordered={theme === "light" ? true : false} style={{ width: 350 }}>
                        <div className='title'>
                            Room Privada
                        </div>
                        <div className="passw">
                            <input type={showPassword ? "text" : "password"} placeholder='Senha' onChange={onChangePrivateRoom} value={passwordInput} onKeyDown={handleKeyEntrar} />
                            {showPassword ? <EyeFilled className='icon eye' onClick={(e) => setShowPassword(false)} /> : <EyeInvisibleFilled className='icon eye' onClick={(e) => setShowPassword(true)} />}
                            {error ? <p style={{ color: "red", margin: '0px', marginTop: "5px" }}>{error}</p> : ""}
                        </div>
                        <div className="check">
                            <Checkbox onChange={(e) => handleAlwaysLoggedIn(e)} />
                            <p>Me manter logado</p>
                        </div>
                        <Button type="primary" onClick={(e) => handleEntrar()}>Entrar</Button>
                    </Card>

                    :

                    <div className="container">
                        <Modal
                            open={isModalOpen}
                            title="Nova categoria"
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <Input className='input-categoria' placeholder='Nova categoria' value={inputCategoria} onChange={(e) => setInputCategoria(e.currentTarget.value)} />
                        </Modal>
                        <Modal
                            open={modalCategoriaSettings}
                            title="Configuração Categorias"
                            onOk={handleCategoriaOk}
                            onCancel={hanleCategoriaCancel}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={settings}
                                renderItem={(item, key) => {
                                    return (
                                        <List.Item
                                            actions={[<Button type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteSettings(key)}>
                                            </Button>]}
                                        >
                                            <Input value={item} key={key} onChange={(e) => handleChangeSettings(e, key)} />
                                        </List.Item>
                                    )
                                }}
                            />
                        </Modal>
                        <div className="head">
                            <div className="select">
                                <Select
                                    className='select-head'
                                    placeholder="Categorias"
                                    onChange={(e) => setCategoriaInput(e)}
                                    value={categoriaInput}
                                    dropdownRender={(menu) => {
                                        return (
                                            <>
                                                {menu}
                                                <Button type="text" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                                                    Nova categoria
                                                </Button>
                                            </>
                                        )

                                    }}
                                >
                                    {
                                        dataPrivateRoom?.categoria ? dataPrivateRoom?.categoria.map((item: string) => {
                                            return (
                                                <Option value={item} label={item}>
                                                    <Space>
                                                        {item}
                                                    </Space>

                                                </Option>
                                            )
                                        })
                                            :
                                            (
                                                null
                                            )
                                    }
                                </Select>
                                <SettingOutlined onClick={() => handleSettings()} />
                            </div>
                            <input className='input-head' type="text" placeholder='Digite aqui...' value={dataInput} onChange={onChange} onKeyDown={handleKeyDown} />
                            <span className='conter' style={{ color: dataInput && dataInput.length > 150 ? "red" : "black" }}>{dataInput ? dataInput.length : "0"}</span>
                        </div>
                        <div className="list-todo">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <div className="left" style={{ display: 'flex', alignItems: 'center', gap: "30px" }}>
                                    <span>Lista de Todo's</span>
                                    <img className='theme' src={theme === 'dark' ? light : dark} onClick={toggleTheme} />
                                </div>
                                <div className="filter">
                                    <Select
                                        className='select-head'
                                        placeholder="Filtrar Categoria"
                                        onChange={(e) => handleFilter(e)}
                                        defaultValue={categoria}
                                        value={categoria}
                                    >
                                        <Option value="all" label="Todos">
                                            <Space>
                                                Todos
                                            </Space>
                                        </Option>
                                        {dataPrivateRoom?.categoria ? dataPrivateRoom?.categoria.map((item: string) => {
                                            return (
                                                <Option value={item} label={item}>
                                                    <Space>
                                                        {item}
                                                    </Space>
                                                </Option>
                                            )
                                        }) : null}
                                    </Select>
                                </div>
                            </div>
                            <Divider className='divider' style={{ margin: "0px" }} />
                            <div className="list">
                                {dataFiltered?.length ? (
                                    dataFiltered?.map((item, key) =>
                                        <>
                                            <div className="check-list" key={key}>
                                                <div className="check">
                                                    <Checkbox className='checkbox' checked={item.completed} onChange={(e) => onChangeCheckBox(e, item)} key={item.id} />
                                                    <span>{item.text}</span>
                                                </div>
                                                <div className="more">
                                                    <Dropdown
                                                        overlay={
                                                            <Menu>
                                                                <Menu.Item onClick={() => {
                                                                    setModalEdit(true);
                                                                    setEditData(item);
                                                                    console.log(item);
                                                                }}>
                                                                    Editar
                                                                </Menu.Item>
                                                                <Menu.Item onClick={() => handleDelete(item.id)}>
                                                                    Deletar
                                                                </Menu.Item>
                                                            </Menu>
                                                        }
                                                        trigger={["click"]}
                                                        placement="bottomRight"
                                                    >
                                                        <EllipsisOutlined className='more' />
                                                    </Dropdown>
                                                </div>

                                            </div>
                                            <Divider className='divider' style={{ margin: "0px" }} />
                                        </>
                                    )
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <SmileOutlined style={{ fontSize: 20 }} />
                                        <p>Sem todo's</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Modal
                            open={modalEdit}
                            title="Editar Todo"
                            onOk={handleEditOk}
                            onCancel={handleEditCancel}
                        >
                            <Space
                                direction='vertical'
                                size="large"
                                style={{width: "100%", paddingTop: "10px"}}
                            >
                                <Input placeholder='Digite todo aqui...' defaultValue={editData?.text} value={editInput ? editInput : editData?.text} onChange={(e) => setEditInput(e.currentTarget.value)} style={{width: "100%"}}/>
                                <Select
                                    placeholder="Categoria"
                                    onChange={(e) => setEditCategoria(e)}
                                    defaultValue={editData?.categoria ? editData.categoria : null}
                                    value={editCategoria ? editCategoria : editData?.categoria}
                                    style={{width: "100px"}}
                                >
                                    {
                                        dataPrivateRoom?.categoria ? dataPrivateRoom?.categoria.map((item: string) => {
                                            return (
                                                <Option value={item} label={item}>
                                                    <Space>
                                                        {item}
                                                    </Space>

                                                </Option>
                                            )
                                        }) : null
                                    }
                                </Select>
                            </Space>
                        </Modal>
                    </div>

            }

        </Layout>
    )

}

export default Slug;
