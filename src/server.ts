import express, {Request, Response} from "express";
import bodyParser from "body-parser"

import {
    getAllEstudantes,
    getEstudanteById,
    addEstudante
} from "./db/estudantes";

const app = express();
const port = 3000;

app.use(bodyParser.json());

// rota para obter todos os estudantes
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

// rota para obter um estudante por id
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

// rota para inserir um estudante
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

app.listen(port, ()=>{
    console.log(`Servidor rodando: http://localhost:${port}`)
})