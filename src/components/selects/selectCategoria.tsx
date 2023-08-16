import { Dispatch, SetStateAction, MutableRefObject } from "react";

import { Select, Button, Space } from "antd";

import { AppstoreOutlined } from "@ant-design/icons";
import { DocumentData } from "firebase/firestore";

interface Props {
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
export const SelectCategoria = ({ setCategoriaInput, categoriaInput, data }: Props) => {

    return (
        <div style={{fontSize: "1.2rem"}}> 
            <AppstoreOutlined style={{color: categoriaInput ? "black" : "lightgray"}}/>
            <Select
                className='select-head'
                placeholder="Categoria"
                onChange={(e) => setCategoriaInput(e)}
                value={categoriaInput ? categoriaInput : undefined}
                bordered={false}
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
        </div>
    )
}