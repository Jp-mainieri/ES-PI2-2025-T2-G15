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
const estudantes_1 = require("./db/estudantes");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
// rota para obter todos os estudantes
app.get('/estudantes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudantes = yield (0, estudantes_1.getAllEstudantes)();
        res.json(estudantes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar estudantes"
        });
    }
}));
// rota para obter um estudante por id
app.get('/estudantes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const estudante = yield (0, estudantes_1.getEstudanteById)(id);
        if (estudante) {
            res.json(estudante);
        }
        else {
            res.status(404).json({
                message: "Estudante nao foi encontrado com o id fornecido."
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar estudante pelo ID fornecido."
        });
    }
}));
// rota para inserir um estudante
app.post('/estudantes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ra, nome, email } = req.body;
        if (!ra || !nome || !email) {
            return res.status(400).json({
                error: "Campos RA, Nome e Email são Obrigatórios."
            });
        }
        const id = yield (0, estudantes_1.addEstudante)(ra, nome, email);
        res.status(200).json({
            message: "Estudante Adicionado com sucesso.", id
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir estudante."
        });
    }
}));
app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
