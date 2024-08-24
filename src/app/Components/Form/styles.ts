import styled, { css } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 90%;
    height: 50rem;
    border-radius: 30px;
    padding: 2rem 1rem;

    background-image: url("public/background.png");
    background-repeat: no-repeat, repeat;
`;

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 90%;
    height: 90%;
    
    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }
`;

export const LabelForm = styled.label`
    width: 100%;
    height: 1.5rem;
    color: blue;
    font-size: 0.8rem;
`

export const Input = styled.input`
    width: 100%;
    height: 1.5rem;
    border: none;
    color: grey;
    border-radius: 5px;
    padding: 0 0.5rem;
    
    &:focus {
        outline: 1px solid blue;
    }

    ${(props) => props.type === "submit" || props.type === "reset" ? css`
        background-color: blue;
        color: white;
        :hover {
            background-color: cadetblue;
        }
    `: css`
        background-color: #f3f5f9;
        color: blue;
        
    `}
    `
export const TextArea = styled.textarea`
    padding: 0.5rem;
    width: 100%;
    height: 3.5rem;
    background-color: #f3f5f9;
    border: none;
    color: grey;
    outline: blue;
    `

export const Select = styled.select`
    width: 100%;
    height: 2rem;
    background-color: #f3f5f9;
    border: none;
    color: grey;
    outline: blue;
`;