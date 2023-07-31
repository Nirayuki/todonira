import { styled } from "styled-components";

export const HomeDetails = styled.div`

.title{
    font-size: 1rem;
    text-align: center;

    margin-bottom: 15px;
    color: ${({theme}) => theme.font};
}

.card{
    background: ${({theme}) => theme.bg_card};
}

.checks{
    margin: 30px 0px;
    
}

.check{
    color: ${({theme}) => theme.font};
}

.passw{
    margin-bottom: 30px;
    position: relative;
}

.passw input{
    width: 100%;

    outline: none;
    border: 1px solid #58585a;

    padding: 5px 10px;
    padding-right: 27px;
}

.icon{
    position: absolute;

    right: 10px;
    top: 7px;

    cursor: pointer;
}

.icon:hover{
    opacity: 0.7;
}

`