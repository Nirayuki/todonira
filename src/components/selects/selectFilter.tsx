import { Select, MenuProps } from "antd";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";

import { FilterOutlined } from '@ant-design/icons';

interface Props {
    dataRoom: RoomData | DocumentData | undefined,
    setFilterCategoria: Dispatch<SetStateAction<string>>,
    setFilterBadge: Dispatch<SetStateAction<string>>
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


export const SelectFilter = ({ dataRoom, setFilterCategoria, setFilterBadge}: Props) => {

    const handleCategoryChange = (selectedValue: string) => {
        setFilterCategoria(selectedValue);
    };

    const handleBadgeChange = (selectedValue: string) => {
        setFilterBadge(selectedValue);
    };
    
    return (
        <div>
            <Select
                className='select-filter'
                placeholder="Filtrar Tarefas"
                suffixIcon={<FilterOutlined/>}
                bordered={false}
                onChange={handleCategoryChange}
            >
                <Select.Option key="all" value="all">
                    Todos
                </Select.Option>
                {dataRoom?.categoria?.map((item: string) => (
                    <Select.Option key={item} value={item}>
                        {item}
                    </Select.Option>
                ))}
            </Select>
            <Select
                className='select-filter'
                placeholder="Filtrar Marcações"
                suffixIcon={<FilterOutlined/>}
                bordered={false}
                onChange={handleBadgeChange}
            >
                <Select.Option key="all" value="all">
                    Todos
                </Select.Option>
                {dataRoom?.badges?.map((item: ItemBadge) => (
                   
                    <Select.Option key={item.title} value={item.title}>
                        {item.title}
                    </Select.Option>
                ))}
            </Select>
        </div>
    )
}