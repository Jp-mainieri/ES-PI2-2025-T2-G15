import express, {Request, Response} from "express";
import bodyParser from "body-parser"

// Imports de funções do CRUD
import {
    getAllEstudantes,
    getEstudanteById,
    addEstudante
} from "./db/estudantes";

import {
    getAllInstituicoes,
    addInstituicao,
    getInstituicaoById,
    updateInstituicao,
    deleteInstituicao
} from "./db/instituicoes";

const app = express();
const port = 3000;

app.use(bodyParser.json());

// ROTAS:

// Rotas de Estudantes:

// Rota para obter todos os estudantes
app.get('/estudantes', async (req :Request,res:Response)=>{
    try {
        const estudantes = await getAllEstudantes();
        res.json(estudantes);
    }catch (err){
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar estudantes"
        })
    }
})

// Rota para obter um estudante por id
app.get('/estudantes/:id', async(req:Request,res:Response)=>{
    try{
        
    const id = Number(req.params.id);
    const estudante = await getEstudanteById(id);
    if (estudante) {
        res.json(estudante);
    }else {
        res.status(404).json({
            message: "Estudante nao foi encontrado com o id fornecido."
        })
    }
    }catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Erro ao buscar estudante pelo ID fornecido."
        })
    }
})

// Rota para inserir um estudante
app.post('/estudantes', async (req:Request,res:Response)=>{
    try {
        const {ra,nome,email} = req.body;
        if (!ra || !nome || !email){
            return res.status(400).json({
                error: "Campos RA, Nome e Email são Obrigatórios."
            })
        }
        const id = await addEstudante(ra,nome,email);
        res.status(200).json({
            message: "Estudante Adicionado com sucesso.", id
        })

    }catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Erro ao inserir estudante."
        });
    }
})

// Rotas de Instituições:

// Rota para listar todas as instituições
app.get("/instituicoes", async (req:Request,res:Response) => {
    try {
        const instituicoes = await getAllInstituicoes();
        res.json(instituicoes);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            Error:"Erro ao buscar instituições"
        })
    }
})

// Rota para obter uma instituição por id
app.get('/instituicoes/:id', async(req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id);
        const instituicao = await getInstituicaoById(id);
        if (instituicao) {
            res.json(instituicao);
        }else {
            res.status(404).json({
                message: "Instituição nao foi encontrado com o id fornecido."
            })
        }
    }catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Erro ao buscar instituição pelo ID fornecido."
        })
    }
})

// Rota para adicionar uma instituição
app.post("/instituicoes/adicionar", async (req:Request,res:Response) => {
    try {
        const {nome} = req.body;

        if (!nome) {
            return res.status(400).json({
                erro: "Campo Nome é Obrigatórios."
            })
        }
        const id = await addInstituicao(nome);
        res.status(200).json({
            message: "Instituição inserida com sucesso.", id
        })

    }catch (err) {
        console.error(err);
        res.status(500).json({
            error:"Erro ao inserir instituição."
        })
    }
})

// Rota para editar uma instituição
app.post("/instituicoes/editar/:id", async (req:Request,res:Response)=>{
    try{
        const {nome} = req.body;
        const id = Number(req.params.id);
        if (!nome) {
            return res.status(400).json({
                erro: "Campo Nome é Obrigatório"
            });
        }
        await updateInstituicao(id,nome);
        res.status(200).json({
            message: "Instituição alterada com sucesso.", id
        })
    }catch (err) {
        console.error(err);

    }
})

// Rota para excluir uma instituição
app.post("/instituicoes/excluir/:id", async (req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id);
        await deleteInstituicao(id);
        res.status(200).json({
            message: "Instituição exluida com sucesso.", id
        })
    }catch (err) {
        console.error(err);
    }
})


app.listen(port, ()=>{
    console.log(`Servidor rodando: http://localhost:${port}`)
})