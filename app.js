const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./firebase-creds.json')
initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()
const agendamentosRef = db.collection('agendamentos');

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res)
{
    res.render("create")
})
app.get("/read", async function(req, res, )
{
    const snapshot = await agendamentosRef.get()
    const data = [];
    snapshot.forEach(doc => 
    {
        data.push({
            id: doc.id,
            nome: doc.get('nome'),
            telefone: doc.get('telefone'),
            origem: doc.get('origem'),
            data_contato: doc.get('data_contato'),
            observacao: doc.get('observacao'),
        })
    })
    res.render("read", { data })
})


app.get("/delete/:id", function(req, res){})
app.post("/create", function(req, res)
{
    var result = agendamentosRef.add(
    {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    })
    .then(function()
    {
        console.log('Added document');
        res.redirect('/read')
    })
})
app.get("/edit/:id", function(req, res){

})
app.post("/update", function(req, res){
    
})
app.listen(8081, function(){
    console.log("Servidor ativo!")
})