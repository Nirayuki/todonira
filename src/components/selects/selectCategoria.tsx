import { Dispatch, SetStateAction, MutableRefObject } from "react";

import { Select, Button, Space } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { DocumentData } from "firebase/firestore";

interface Props{
    setModalNewCategoria: Dispatch<SetStateAction<boolean>>,
    setCategoriaInput: Dispatch<SetStateAction<string>>,
    categoriaInput: string,
    data: RoomData | DocumentData | undefined
}


interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}
export const SelectCategoria = ({setModalNewCategoria, setCategoriaInput, categoriaInput, data}: Props) => {

    return (
        <Select
            className='select-head'
            placeholder="Categorias"
            onChange={(e) => setCategoriaInput(e)}
            value={categoriaInput ? categoriaInput : undefined}
            dropdownRender={(menu) => {
                return (
                    <>
                        {menu}
                        <Button type="text" icon={<PlusOutlined />} onClick={() => setModalNewCategoria(true)}>
                            Nova categoria
                        </Button>
                    </>
                )

            }}
        >
            {
                data?.categoria ? data?.categoria.map((item: string) => {
                    return (
                        <Select.Option value={item} label={item}>
                            <Space>
                                {item}
                            </Space>

                        </Select.Option>
                    )
                })
                    :
                    (
                        null
                    )
            }
        </Select>
    )
}