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
// Not deleting this part of code so that you can see its working without any issue 
// even though its calling the same model in 2 different file.
// Check ideas.js and you will see this duplicate code in there.
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars middleware code
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');

//Routes
// Load routes
const ideas = require('./routes/ideas'); // ideas or ideas.js its same
const users = require('./routes/users');

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

// Using loaded routes
app.use('/ideas',ideas);
app.use('/users',users);

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
