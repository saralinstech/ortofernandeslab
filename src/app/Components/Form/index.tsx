"use client"
import Image from "next/image"
import { Container, FormContainer, Input, LabelForm, Select, TextArea } from "./styles"

export default function Form () {
    return (
        <Container>
        <Image src="/LogotipoORTOFERNANDES.png" alt="Logo" width={200} height={200}></Image>
            <FormContainer>
                <LabelForm>Name (opcional)</LabelForm>
                <Input type="text" placeholder="Coloque seu nome/"/>
                <LabelForm>Email (opcional)</LabelForm>
                <Input type="email" placeholder="Coloque seu email"/>
                <LabelForm>Satisfação em Geral com o serviço</LabelForm>
                <Input type="text" />
                <LabelForm htmlFor="quanlity">Qualidade do Produto</LabelForm>
                <Select name="quanlity" id="quality">
                    <option value="0">Selecione um número</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </Select>
                <LabelForm>Comunicação e atendimento</LabelForm>
                <Input type="text" />
                <LabelForm>Sugestão de melhorias</LabelForm>
                <Input type="text" />
                <LabelForm>Probabilidade de Recomendação</LabelForm>
                <Select name="probability" id="probability">
                    <option value="0">Selecione um número</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
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