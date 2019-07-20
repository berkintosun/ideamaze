const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// DB connection via mongoose
mongoose.connect('mongodb://localhost/ideamaze',{
    useNewUrlParser: true
})
.then(()=> console.log('Db Connected'))
.catch(err => console.log(err));

//Load Models
require('./models/Idea');
const Idea = mongoose.model('ideas');




//Handlebars middleware code
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

app.get('/ideas',(req,res)=>{
    Idea.find({})
      .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas',{
            ideas:ideas
        });
    })
})

//Add Idea
app.get('/ideas/add',(req,res) => {
    res.render('ideas/add');
});

app.post('/ideas',(req,res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add some title for your idea'});
    }
    
    if(!req.body.details){
        errors.push({text:'Add some detailed information for this awesome idea!'});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }
    else{
        const newIdea = {
            title:req.body.title,
            details:req.body.details
        };
        new Idea(newIdea)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            });
    }
})

// Edit idea

app.get('ideas/edit/:id',(req,res) => {
    res.render('ideas/edit');
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});