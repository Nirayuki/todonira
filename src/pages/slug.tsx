import React, { useState, useEffect, useRef, useContext } from 'react';
import { Layout } from '../components/layout';
import { Checkbox, Divider, Dropdown, Menu, Card, Button } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SmileOutlined, EllipsisOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import todoService from '../services/todo.service';
import { DocumentData } from 'firebase/firestore';
import { SlugDetails, SlugPass } from '../style/slugDetails';
import dark from '../assets/dark.svg';
import light from '../assets/light.svg';
import { ThemeContext } from '../theme/ThemeContext';
import usePersistedState from '../components/usePersistedState';

interface TodoItem {
    id?: string | null | number;
    text: string;
    completed: boolean;
}

interface isEdit {
    isEdit: boolean,
    isEditingId: string | number | null | undefined
}

interface RoomData {
    isPrivate: boolean,
    password: string
}

function Slug() {

    const { theme, toggleTheme } = useContext(ThemeContext);

    const [isPrivateRoom, setIsPrivateRoom] = usePersistedState('isPrivateRoom', false);
    const [dataPrivateRoom, setDataPrivateRoom] = useState<RoomData | DocumentData>();

    const [data, setData] = useState<TodoItem[]>([]);

    const [dataInput, setDataInput] = useState<string>('');

    const [isEditing, setIsEditing] = useState<isEdit>({ isEdit: false, isEditingId: null });

    const [dataInputEdit, setDataInputEdit] = useState<string>('');

    const inputRef = useRef<HTMLInputElement>(null);

    const [roomDataLoaded, setRoomDataLoaded] = useState(false);

    const [passwordInput, setPasswordInput] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataRoom = await todoService.getRoomData();
                setIsPrivateRoom(dataRoom?.isPrivate ?? false);
                setDataPrivateRoom(dataRoom);
                setRoomDataLoaded(true);
            } catch (error) {
                console.error("Error getting room data:", error);
                setIsPrivateRoom(false); // Define como false em caso de erro
                setRoomDataLoaded(true);
            }
        };

        fetchData();
        const unsubscribe = todoService.subscribeToTodos((todos: TodoItem[]) => {
            setData(todos);
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                // Se o usuário clicou fora do input, encerra o modo de edição
                setIsEditing({ isEdit: false, isEditingId: null });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);



        // Cleanup do ouvinte ao desmontar o componente.
        return () => {
            unsubscribe()
            document.removeEventListener("mousedown", handleClickOutside);
        };


    }, []);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && dataInput.trim() !== "") {
            if (dataInput.length > 150) {
                return
            } else {
                const newItem: TodoItem = {
                    text: dataInput,
                    completed: false,
                };

                await todoService.addTodo(newItem);
                setDataInput("");
            }
        }
    }


    const handleKeyDownEdit = async (e: React.KeyboardEvent<HTMLDivElement>, todo: TodoItem) => {
        if (e.key === 'Enter' && dataInputEdit.trim() !== "") {
            await todoService.updateTodo(todo.id, { ...todo, text: dataInputEdit });

            setDataInputEdit("");
            setIsEditing({ isEdit: false, isEditingId: null });
        }
    }

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDataInput(e.currentTarget.value);
    }

    const onChangeEdit = (e: React.FormEvent<HTMLInputElement>) => {
        setDataInputEdit(e.currentTarget.value);
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
            setIsPrivateRoom(false);
        }
    }

    const handleKeyEntrar = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && dataPrivateRoom?.password.trim() !== "") {
            setIsPrivateRoom(false);
        }
    }

    if (!roomDataLoaded) {
        return null; // Ou renderize um componente de loading ou simplesmente não renderize nada
    }

    return (
        <Layout>
            {
                isPrivateRoom ?

                    <SlugPass>
                        <Card className='card' bordered={false} style={{ width: 350 }}>
                            <div className='title'>
                                Room Privada
                            </div>
                            <div className="passw">
                                <input type={showPassword ? "text" : "password"} placeholder='Senha' onChange={onChangePrivateRoom} value={passwordInput} onKeyDown={handleKeyEntrar} />
                                {showPassword ? <EyeFilled className='icon eye' onClick={(e) => setShowPassword(false)} /> : <EyeInvisibleFilled className='icon eye' onClick={(e) => setShowPassword(true)} />}
                            </div>
                            <Button type="primary" onClick={(e) => handleEntrar()}>Entrar</Button>
                        </Card>
                    </SlugPass>

                    :
                    <SlugDetails>

                        <div className="head">
                            <input type="text" placeholder='Digite aqui...' value={dataInput} onChange={onChange} onKeyDown={handleKeyDown} />
                            <span style={{ color: dataInput && dataInput.length > 150 ? "red" : "black" }}>{dataInput ? dataInput.length : "0"}</span>
                        </div>
                        <div className="list-todo">
                            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                <span>Lista de Todo's</span>
                                <img className='theme' src={theme === 'dark' ? light : dark} onClick={toggleTheme} />
                            </div>
                            <Divider className='divider' style={{ margin: "0px" }} />
                            <div className="list">
                                {data.length ? (
                                    data.map((item, key) =>
                                        <>
                                            <div className="check-list" key={key}>
                                                <div className="check">
                                                    <Checkbox className='checkbox' checked={item.completed} onChange={(e) => onChangeCheckBox(e, item)} key={item.id} />
                                                    {
                                                        isEditing.isEdit && isEditing.isEditingId === item.id ? <input type="text" autoFocus ref={inputRef} defaultValue={item.text} onChange={onChangeEdit} onKeyDown={(e) => handleKeyDownEdit(e, item)} />

                                                            :

                                                            <span>{item.text}</span>
                                                    }
                                                </div>
                                                <div className="more">
                                                    <Dropdown
                                                        overlay={
                                                            <Menu>
                                                                <Menu.Item onClick={() => setIsEditing({ isEdit: true, isEditingId: item.id })}>
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
                    </SlugDetails>

            }
        </Layout>
    )

}

export default Slug;
