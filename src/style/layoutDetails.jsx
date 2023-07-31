import {styled} from 'styled-components';

export const LayoutDetails = styled.div`

header{ 
    height: 150px;
    width: 100%;

    color: ${({theme}) => theme.font};
    font-size: 3rem;

    display: flex;
    align-items: center;
    justify-content: center;
}


.children{
    width: 100%;

    display: flex;
    margin-top: 10px;
    padding: 0px 30px;
    justify-content: center;
}

`