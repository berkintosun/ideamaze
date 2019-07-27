const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Idea');
const Idea = mongoose.model('ideas');

// Ideas
router.get('/',(req,res)=>{
    Idea.find({})
      .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas',{
            ideas:ideas
        });
    })
})

//Add Idea
router.get('/add',(req,res) => {
    res.render('ideas/add');
});

router.post('/',(req,res) => {
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
router.get('/edit/:id',(req,res) => {
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

router.put('/:id',(req,res) => {
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
router.delete('/:id',(req,res) => {
    Idea.deleteOne({_id:req.params.id})
    .then(() => {
        req.flash('success_msg','Idea deleted succesfully!');
        res.redirect('/ideas');
    });
})

module.exports = router;