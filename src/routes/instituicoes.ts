import express, {Request, Response} from "express";
import bodyParser from "body-parser"

//import {getAllInstituicoes, addInstituicao} from ../db/instituicoes.ts

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rota para listar todas as instituições
app.get("/instituicoes", async (req:Request,res:Response) => {
    try {
        //const instituicoes = await getAllInstituicoes();
        //res.json(instituicoes);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            Error:"Erro ao buscar instituições"
        })
    }
})

app.post("/instituicoes", async (req:Request,res:Response) => {
    try {
        //const {nome, ...} = req.body();
        /*
        if (!nome || ...) {
            return res.status(400).json({
                erro: "Campos Nome, ... são Obrigatórios."
            })
        }
        const id = await addInstituicao(nome, ...);
        res.status(200).json({
            message: "Instituição inserida com sucesso.", id
        })
        */
    }catch (err) {
        console.error(err);
        res.status(500).json({
            error:"Erro ao inserir instituição."
        })
    }
})

app.listen(port, ()=>{
    console.log(`Servidor rodando: http://localhost:${port}`)
})