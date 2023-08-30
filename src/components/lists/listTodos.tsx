import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Dropdown, Menu, Checkbox, Tag, Tooltip, ConfigProvider } from "antd";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { EllipsisOutlined, SmileOutlined, LoadingOutlined } from '@ant-design/icons';

import '../../style/list.css'

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
    data: TodoItem[],
    dataFiltered: TodoItem[] | undefined,
    setDataFiltered: Dispatch<SetStateAction<TodoItem[]>>,
    setEditData: Dispatch<SetStateAction<TodoItem | undefined>>,
    setModalEdit: Dispatch<SetStateAction<boolean>>,
    handleDelete: (itemId: string | number | null | undefined) => {},
    onChangeCheckBox: (e: CheckboxChangeEvent, todo: TodoItem) => {},
    filterBadge: string,
    filterCategoria: string,
    loading: boolean
}

export const ListTodos = ({ loading, data, dataFiltered, setDataFiltered, setEditData, setModalEdit, handleDelete, onChangeCheckBox, filterBadge, filterCategoria }: Props) => {

    useEffect(() => {
        if (filterBadge === "all" && filterCategoria === "all") {
            setDataFiltered(data);
        } else {
            setDataFiltered(
                data?.filter(filter =>
                    (filterBadge === "all" || filter.badge?.title === filterBadge) &&
                    (filterCategoria === "all" || filter.categoria === filterCategoria)
                )
            );
        }
    }, [filterBadge, filterCategoria, data]);

    function getBrightness(color: string) {
        const rgb = parseInt(color.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    return (
        <ConfigProvider
            renderEmpty={() => {
                return (
                    <div className="no-data">
                        <SmileOutlined style={{ fontSize: 20 }} />
                        <p>Sem tarefas</p>
                    </div>
                )
            }}
        >
            {loading ? (
                <div className="loading"><LoadingOutlined /></div>
            ) : (
                <div className="list-container">
                    {dataFiltered ? dataFiltered.map((item, key) => {
                        return (
                            <div className="list-item">
                                <div className="check">
                                    <Checkbox className='checkbox' checked={item.completed} onChange={(e) => onChangeCheckBox(e, item)} key={item.id} />
                                    <span style={{ textDecoration: item.completed ? "line-through" : "" }}>
                                        <div className="tag">
                                            {item.badge ? (
                                                <Tag color={item.badge.color} style={{ color: getBrightness(item.badge.color) > 128 ? 'black' : 'white', fontWeight: "700", textShadow: "2px 2px 4px #fffff", width: "auto" }}>{item.badge.title}</Tag>
                                            ) : null}
                                        </div>
                                        {item.text}
                                    </span>
                                </div>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item onClick={() => {
                                                setModalEdit(true);
                                                setEditData(item);
                                            }}
                                                key={1}
                                            >
                                                Editar
                                            </Menu.Item>
                                            <Menu.Item onClick={() => handleDelete(item.id)} key={2}>
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
                            </div>
                        )
                    }) : null}
                </div>


            )}
        </ConfigProvider>
    )
}