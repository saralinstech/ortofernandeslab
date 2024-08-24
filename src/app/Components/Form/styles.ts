import styled, { css } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 90%;
    height: 60rem;
    border-radius: 30px;
    padding: 0rem 1rem 1rem;

    background-image: url("public/background.png");
    background-repeat: no-repeat, repeat;

    @media (min-width: 600px) {
        width: 25%;
    }
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
    font-size: 1rem;
    padding: 0.5rem 0;
`

export const Input = styled.input`
    width: 100%;
    border: none;
    color: grey;
    border-radius: 5px;
    padding: 0 0.5rem;
    
    &:focus {
        outline: 1px solid blue;
    }

    ${(props) => props.type === "submit" ?
        css`
            background-color: blue;
            color: white;
            height: 2.5rem;
        `
        : props.type === "reset" ?
            css`
            background-color: blue;
            color: white;
            filter: opacity(30%);
            height: 2.5rem;
        `
            : css`
            background-color: #f3f5f9;
            color: blue;
            height: 2rem;
        `
    };
`;

export const TextArea = styled.textarea`
    padding: 0.5rem;
    width: 100%;
    height: 3.5rem;
    background-color: #f3f5f9;
    border: none;
    color: grey;
    border-radius: 5px;
    outline: 1px solid blue;
`;

export const Select = styled.select`
    width: 100%;
    height: 2rem;
    background-color: #f3f5f9;
    border: none;
    color: grey;
    outline: blue;
    border-radius: 5px;
`;

export const Title = styled.h1`
    color: blue;
    font-size: 1.2rem;
    padding: 0 0 1rem;
`