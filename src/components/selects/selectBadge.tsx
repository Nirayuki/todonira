import { Select, Button } from "antd";
import { TagOutlined  } from "@ant-design/icons";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction, MutableRefObject, forwardRef } from "react";

interface Props {
    data: RoomData | DocumentData | undefined,
    badge: string | undefined,
    setBadge: Dispatch<SetStateAction<string | undefined>>
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

export const SelectBadge = ({ data, badge, setBadge }: Props) => {

    return (
        <div style={{fontSize: "1.2rem"}}>
            <TagOutlined style={{color: badge ? "black" : "lightgray"}}/>
            <Select
                className='select-head'
                placeholder="Marcação"
                onChange={(e) => setBadge(e)}
                value={badge ? badge : undefined}
                bordered={false}
            >
                {data?.badges ? data?.badges.map((item: ItemBadge, key: number) => {
                    return (
                        <Select.Option value={item.title} label={item.title} key={key}>
                            {item.title}
                        </Select.Option>
                    )
                }) : null}
            </Select>
        </div>
    )
}