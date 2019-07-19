const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');

//Routes
//Index
app.get('/', (req,res) => {
    const Param = "Index"
    res.render("index",{
        Param:Param
    });
});

//About
app.get('/about',(req,res) => {
    res.render("about");
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});