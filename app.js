const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'))

//Session middleware
app.use(session({
    secret:'shadow',
    resave:true,
    saveUninitialized:true
}));

//Connect flash middleware
app.use(flash());

//Global variables for flash
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


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
// Index
app.get('/', (req,res) => {
    const Param = "Index"
    res.render("index",{
        Param:Param
    });
});

// About
app.get('/about',(req,res) => {
    res.render("about");
})

// Ideas
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
                req.flash('success_msg','Idea added succesfully!');
                res.redirect('/ideas');
            });
    }
})

// Edit idea
app.get('/ideas/edit/:id',(req,res) => {
    console.log(req.params.id)
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        console.log(idea)
        res.render('ideas/edit',{
            idea:idea
        });
    })
})

app.put('/ideas/:id',(req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg','Idea modified succesfully!');
            res.redirect('/ideas');
        })
    })
})

// Delete Idea

app.delete('/ideas/:id',(req,res) => {
    Idea.remove({_id:req.params.id})
    .then(() => {
        req.flash('success_msg','Idea deleted succesfully!');
        res.redirect('/ideas');
    });
})

// Login route

app.get('/users/login',(req,res) => {
    res.send('login ');
})

// Register
app.get('/users/register',(req,res) => {
    res.send('register');
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});