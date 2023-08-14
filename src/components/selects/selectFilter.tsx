import { Select, Space } from "antd";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

interface Props {
    categoria: string,
    dataRoom: RoomData | DocumentData | undefined,
    dataTodo: TodoItem[],
    setCategoria: Dispatch<SetStateAction<string>>,
    setDataFiltered: Dispatch<SetStateAction<TodoItem[]>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

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



export const SelectFilter = ({categoria, dataRoom, dataTodo, setCategoria, setDataFiltered}: Props) => {

    const handleFilter = (e: string) => {
        setCategoria(e);
        setDataFiltered(e === "all" ? dataTodo : dataTodo.filter(filter => filter.categoria === e));
    }

    return (
        <Select
            className='select-filter'
            placeholder="Filtrar Categoria"
            onChange={(e) => handleFilter(e)}
            defaultValue={categoria}
            value={categoria}
        >
            <Select.Option value="all" label="Todos">
                <Space>
                    Todos
                </Space>
            </Select.Option>
            {dataRoom?.categoria ? dataRoom?.categoria.map((item: string) => {
                return (
                    <Select.Option value={item} label={item}>
                        <Space>
                            {item}
                        </Space>
                    </Select.Option>
                )
            }) : null}
        </Select>
    )
}