import { Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

interface Props{
    data: RoomData | DocumentData | undefined,
    badge: string | undefined,
    setBadge: Dispatch<SetStateAction<string | undefined>>,
    setModalNewBadge: Dispatch<SetStateAction<boolean>>
}

interface ItemBadge {
    title: string,
    color: string
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

export const SelectBadge = ({data, badge, setBadge, setModalNewBadge}: Props) => {
    return (
        <Select
            className='select-head'
            placeholder="Badge"
            defaultValue={data?.badges ? data?.badges[0].title : undefined}
            onChange={(e) => setBadge(e)}
            value={badge ? badge : data?.badges ? data?.badges[0].title : undefined}
            dropdownRender={(menu) => {
                return (
                    <>
                        {menu}
                        <Button type="text" icon={<PlusOutlined />} onClick={() => setModalNewBadge(true)}>
                            Criar
                        </Button>
                    </>
                )

            }}
        >
            {data?.badges ? data?.badges.map((item: ItemBadge, key: number) => {
                return (
                    <Select.Option value={item.title} label={item.title} key={key}>
                        {item.title}
                    </Select.Option>
                )
            }) : null}
        </Select>
    )
}