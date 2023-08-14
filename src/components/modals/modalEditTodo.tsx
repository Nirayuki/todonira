import { Dispatch, SetStateAction, useState } from "react";

import { Modal, Space, Input, Select } from "antd";
import { DocumentData } from "firebase/firestore";

import todoService from "../../services/todo.service";

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    data: RoomData | DocumentData | undefined
    dataEdit: TodoItem | undefined
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

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

interface ItemBadge{
    title: string,
    color: string
}

export const ModalEditTodo = ({ open, setOpen, data, dataEdit }: Props) => {

    const [input, setInput] = useState<string | undefined>("");
    const [select, setSelect] = useState<string | undefined | []>();
    const [selectBadge, setSelectBadge] = useState<string | undefined>();

    const handleOk = async () => {
        const badgeObject = data?.badges.filter((filter: { title: string }) => filter.title === selectBadge);
        const newItem = {
            id: dataEdit?.id,
            completed: dataEdit?.completed,
            text: input ? input : dataEdit?.text,
            categoria: select ? select : dataEdit?.categoria ? dataEdit?.categoria : null,
            badge: selectBadge ? badgeObject[0] : null
        }

        await todoService.updateTodo(dataEdit?.id, newItem);
        setInput(undefined);
        setSelect(undefined);
        setOpen(false);
    }

    const handleCancel = () => {
        setInput(undefined);
        setSelect(undefined);
        setOpen(false);
    }

    return (
        <Modal
            open={open}
            title="Editar Todo"
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Space
                direction='vertical'
                size="large"
                style={{ width: "100%", paddingTop: "10px" }}
            >
                <Input placeholder='Digite todo aqui...' defaultValue={dataEdit?.text} value={input ? input : dataEdit?.text} onChange={(e) => setInput(e.currentTarget.value)} style={{ width: "100%" }} />
                <Space direction="horizontal" size="large">
                    <Select
                        placeholder="Categoria"
                        onChange={(e) => setSelect(e)}
                        defaultValue={dataEdit?.categoria ? dataEdit.categoria : null}
                        value={select ? select : dataEdit?.categoria}
                        style={{ width: "100px" }}
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
                            }) : null
                        }
                    </Select>
                    <Select
                        placeholder="Badge"
                        onChange={(e) => setSelectBadge(e)}
                        defaultValue={dataEdit?.badge ? dataEdit.badge.title : null}
                        value={selectBadge ? selectBadge : dataEdit?.badge?.title}
                        style={{ width: "100px" }}
                    >
                        {
                            data?.badges ? data?.badges.map((item: ItemBadge) => {
                                return (
                                    <Select.Option value={item.title} label={item.title}>
                                        <Space>
                                            {item.title}
                                        </Space>
                                    </Select.Option>
                                )
                            }) : null
                        }
                    </Select>
                </Space>

            </Space>
        </Modal>
    )
}