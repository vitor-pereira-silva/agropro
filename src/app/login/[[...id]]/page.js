'use client';

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { IoMdAirplane } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
import { v4 as uuidv4 } from "uuid";
import Pagina from "@/components/Pagina";

export default function Page({ params }) {
    const router = useRouter();
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState({ imagem: '', nome: '', validade: '', descrição: '', lote: '', valor: '' });

    useEffect(() => {
        const storedProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
        const dados = storedProdutos.find(item => item.id == params.id);
        setProdutos(storedProdutos);
        setProduto(dados || { imagem: '', nome: '', validade: '', descrição: '', lote: '', valor: '' });
    }, [params.id]);

    function salvar(dados) {
        if (produto.id) {
            const index = produtos.findIndex(item => item.id === produto.id);
            produtos[index] = { ...produto, ...dados };
        } else {
            dados.id = uuidv4();
            produtos.push(dados);
        }
        localStorage.setItem('produtos', JSON.stringify(produtos));
        router.push('login/produtos');
    }

    return (
        <Pagina titulo="Produto">
            <Formik
                key={produto.id || 'novo-produto'}
                initialValues={produto}
                onSubmit={values => salvar(values)}
            >
                {({ values, handleChange, handleSubmit, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                        {/* Campos do formulário */}
                        <Form.Group className="mb-3" controlId="imagem">
                            <Form.Label>Imagem</Form.Label>
                            <Form.Control
                                type="file"
                                name="imagem"
                                accept=".jpg, .jpeg, .png, .gif, .bmp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.size > 2 * 1024 * 1024) {
                                        alert("A imagem deve ter no máximo 2 MB");
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => setFieldValue("imagem", reader.result);
                                    file && reader.readAsDataURL(file);
                                }}
                            />
                            {values.imagem && (
                                <img
                                    src={values.imagem}
                                    alt="Pré-visualização"
                                    style={{ width: '200px', height: '200px', objectFit: 'cover', marginTop: '10px' }}
                                />
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="nome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={values.nome}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button type="submit" variant="success">
                                <IoMdAirplane /> Salvar
                            </Button>
                            <Link href="/produtos" className="btn btn-danger ms-2">
                                <TiArrowBack /> Voltar
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
