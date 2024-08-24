"use client"
import Image from "next/image"
import { Container, FormContainer, Input, LabelForm, Select, TextArea, Title } from "./styles"

export default function Form () {
    return (
        <Container>
        <Image src="/LogotipoORTOFERNANDES2.png" alt="Logo" width={200} height={200}></Image>
        <Title>Pesquisa de Satisfação</Title>
            <FormContainer>
                <LabelForm>Nome (opcional)</LabelForm>
                <Input type="text" placeholder="Coloque seu nome/"/>
                <LabelForm>E-mail (opcional)</LabelForm>
                <Input type="email" placeholder="Coloque seu email"/>
                <LabelForm>Satisfação em Geral</LabelForm>
                <Select name="satisfation" id="satisfation" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
                <LabelForm htmlFor="quanlity">Qualidade do Produto</LabelForm>
                <Select name="quanlity" id="quality" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
                <LabelForm>Comunicação e atendimento</LabelForm>
                <Select name="quanlity" id="quality" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
                <LabelForm>Sugestão de melhorias</LabelForm>
                <Input type="text" required/>
                <LabelForm>Nos Recomendaria?</LabelForm>
                <Select name="probability" id="probability" required>
                    <option value="0">Escolha um número de 1 à 5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>                
                <LabelForm>Comentários Adicionais</LabelForm>
                <TextArea />
                
                <div>
                    <Input type="reset" value="Limpar"/>
                    <Input type="submit"/>  
                </div>
            </FormContainer>
        </Container>
    )
}