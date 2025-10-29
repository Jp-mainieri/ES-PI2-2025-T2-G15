"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
//import {getAllInstituicoes, addInstituicao} from ../db/instituicoes.ts
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
// Rota para listar todas as instituições
app.get("/instituicoes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const instituicoes = await getAllInstituicoes();
        //res.json(instituicoes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            Error: "Erro ao buscar instituições"
        });
    }
}));
app.post("/instituicoes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir instituição."
        });
    }
}));
app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
