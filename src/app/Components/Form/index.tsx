"use client"
import Image from "next/image"
import { Container, FormContainer, Input, LabelForm, Select, TextArea, Title } from "./styles"
import { useState } from "react"

export default function Form () {

    const [inputName, setInputName] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputSatisfation, setInputSatisfation] = useState("");
    const [inputQuality, setInputQuality] = useState("");
    const [inputComunication, setInputComunication] = useState("");
    const [inputProbability, setInputProbability] = useState("");
    const [inputTestimonial, setInputTestimonial] = useState("");
    const [inputSugestion, setInputSugestion] = useState("");


    function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        let dataForm = {
            inputName,
            inputEmail,
            inputSatisfation,
            inputQuality,
            inputComunication,
            inputProbability,
            inputTestimonial,
            inputSugestion
        }
        console.log(dataForm); 
    }

    function clearInputs(event: { preventDefault: () => void; }) {
        event.preventDefault();
        console.log("oi");
        setInputComunication("");
        setInputEmail("");
        setInputName("");
        setInputProbability("");
        setInputQuality("");
        setInputSatisfation("");
        setInputSugestion("");
        setInputTestimonial("");
    }

    return (
        <Container>
        <Image src="/LogotipoORTOFERNANDES2.png" alt="Logo" width={200} height={200}></Image>
        <Title>Pesquisa de Satisfação</Title>
            <FormContainer onSubmit={handleSubmit}>
                <LabelForm>Nome (opcional)</LabelForm>
                <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Coloque seu nome"/>
                <LabelForm>E-mail (opcional)</LabelForm>
                <Input type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="Coloque seu email"/>
                <LabelForm>Satisfação em Geral</LabelForm>
                <Select name="satisfation" value={inputSatisfation} onChange={(e) => setInputSatisfation(e.target.value)} id="satisfation" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
                <LabelForm htmlFor="quality">Qualidade do Produto</LabelForm>
                <Select name="quality" value={inputQuality} onChange={(e) => setInputQuality(e.target.value)} id="quality" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
                <LabelForm>Comunicação e atendimento</LabelForm>
                <Select name="comunication" value={inputComunication} onChange={(e) => setInputComunication(e.target.value)} id="comunication" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
                <LabelForm>Sugestão de melhorias</LabelForm>
                <Input type="text" value={inputSugestion} onChange={(e) => setInputSugestion(e.target.value)} required/>
                <LabelForm>Nos Recomendaria?</LabelForm>
                <Select name="probability" value={inputProbability} onChange={(e) => setInputProbability(e.target.value)} id="probability" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>                
                <LabelForm>Comentários Adicionais</LabelForm>
                <TextArea value={inputTestimonial} onChange={(e) => setInputTestimonial(e.target.value)}/>
                
                <div>
                    <Input type="reset" value="Limpar" onClick={(e) => clearInputs(e)}/>
                    <Input type="submit"/>  
                </div>
            </FormContainer>
        </Container>
    )
}