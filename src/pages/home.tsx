import React, { useState, useEffect } from 'react';
import '../style/home.css';
import { Layout } from '../components/layout';
import { Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SmileOutlined, EllipsisOutlined } from '@ant-design/icons';

interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}


function Home() {

    const [data, setData] = useState<TodoItem[]>(() => {
        // Carrega o estado do 'localStorage' quando o componente for montado
        const savedData = localStorage.getItem('todoData');
        return savedData ? JSON.parse(savedData) : [];
      });
    
      useEffect(() => {
        // Salva o estado 'data' no 'localStorage' sempre que ele for alterado
        localStorage.setItem('todoData', JSON.stringify(data));
      }, [data]);

    const [dataInput, setDataInput] = useState<string>("");


    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && dataInput !== "") {
            const newItem: TodoItem = {
                id: data.length + 1, // Gerando um ID simples; você pode usar outra lógica para IDs únicos
                text: dataInput,
                completed: false,
            };

            setData([...data, newItem]);
            setDataInput("");
        }
    }


    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDataInput(e.currentTarget.value);
    }

    const onChangeCheckBox = (e: CheckboxChangeEvent, id: number) => {
        const updatedData = data.map((item) =>
            item.id === id ? { ...item, completed: e.target.checked } : item
        );

        // Atualiza o estado 'data' com o item modificado
        setData(updatedData);
    }

    return (
        <Layout>
            <div className="container">
                <div className="head">
                    <input type="text" placeholder='Digite aqui...' value={dataInput} onChange={onChange} onKeyDown={handleKeyDown} />
                </div>
                <div className="list-todo">
                    <span>Lista de Todo's</span>
                    <Divider style={{margin: "5px"}} />
                    <div className="list">
                        {data.length ? (
                            data.map((item) =>
                                <>
                                    <div className="check-list">
                                        <div className="check">
                                            <Checkbox checked={item.completed} onChange={(e) => onChangeCheckBox(e, item.id)} key={item.id} />
                                            <span>{item.text}</span>
                                        </div>
                                        <div className="more">
                                            <EllipsisOutlined className='more' />
                                        </div>
                                    </div>
                                    <Divider style={{margin: "15px"}} />
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
            </div>
        </Layout>
    );
}

export default Home;
