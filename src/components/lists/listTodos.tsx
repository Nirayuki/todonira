import React, { Dispatch, SetStateAction } from "react";
import { List, Dropdown, Menu, Checkbox, Tag, Tooltip, ConfigProvider } from "antd";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { EllipsisOutlined, SmileOutlined } from '@ant-design/icons';

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

interface Props {
    data: TodoItem[] | undefined,
    setEditData: Dispatch<SetStateAction<TodoItem | undefined>>,
    setModalEdit: Dispatch<SetStateAction<boolean>>,
    handleDelete: (itemId: string | number | null | undefined) => {},
    onChangeCheckBox: (e: CheckboxChangeEvent, todo: TodoItem) => {}
}

export const ListTodos = ({ data, setEditData, setModalEdit, handleDelete, onChangeCheckBox }: Props) => {
    return (
        <ConfigProvider
            renderEmpty={() => {
                return(
                    <div className="no-data">
                        <SmileOutlined style={{ fontSize: 20 }} />
                        <p>Sem Todos</p>
                    </div>
                )
            }}
        >
            <List
                dataSource={data}
                itemLayout="horizontal"
                renderItem={(item: TodoItem, key) => {
                    return (
                        <List.Item
                            actions={[
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item onClick={() => {
                                                setModalEdit(true);
                                                setEditData(item);
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
                                    <Tooltip title="Mostrar mais">
                                        <EllipsisOutlined className='more' />
                                    </Tooltip>
                                </Dropdown>
                            ]}
                        >
                            <div className="check">
                                <Checkbox className='checkbox' checked={item.completed} onChange={(e) => onChangeCheckBox(e, item)} key={item.id} />
                                <span>{item.text}</span>
                            </div>
                            <div className="tag">
                                {item.badge ? (
                                    <Tag color={item.badge.color} style={{color: "rgba(0, 0, 0, 0.8)", fontWeight: "500"}}>{item.badge.title}</Tag>
                                ) : (
                                    <Tag color="#d3d3d3" style={{ color: "black", fontWeight: "500" }}>Sem Badge</Tag>
                                )}
                            </div>
                        </List.Item>
                    )
                }}
            >
            </List>
        </ConfigProvider>
    )
}