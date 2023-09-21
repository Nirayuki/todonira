import React, {CSSProperties} from "react";

interface Props{
    width?: string,
    height?: string,
    style?: CSSProperties,
    className?: string 
}

const Skeleton = ({width, height, style, className}: Props) => {
    return(
        <div className={`skeleton ${className}`} style={{...style, width: width ? width : "auto", height: height ? height : "auto"}}/>
    )
}


export default Skeleton;