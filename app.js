const express = require('express');
const app = express();

app.use(express.urlencoded({extended : true}));

app.post('/api/v1/ascii', (req, res) => { res.sendStatus(200); });

module.exports = app;
