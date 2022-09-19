const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const SolariServer = require('./server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const solarichain = new Blockchain();
const solariserver = new SolariServer(solarichain);

app.use(bodyParser.json());

app.get('/solarichain', (req, res) => {
    res.json(solarichain.chain);
});

app.post('/mine', (req, res) => {
    const block = solarichain.add(req.body.data);
    console.log(`New solaricoin block added ${block.toString()}`);
    solariserver.syncChains();

    res.redirect('/solarichain');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
solariserver.listen();
