const express = require('express');
const bodyParser  = require('body-parser');
const cors = require('cors');
const app = express();

const port = 3000; //Define o número da porta

app.use(bodyParser.json());
app.use(cors());

//ROTAS

app.get('/', (req, res) => {
    res.send('Tudo Funcionando');
});

app.listen(port, () => {
    console.log(`servidor rodando na porta: ${port}`);
});



