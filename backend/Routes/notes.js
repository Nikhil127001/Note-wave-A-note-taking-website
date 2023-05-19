const express = require("express");
const router = express.Router();
const fetchUsers = require("../Middlewares/fetchUsers");
const { body, validationResult } = require('express-validator');


const Note = require("../models/Notes")


//Route - 1 respond with "hello world" when a GET request is made to the homepage
router.get('/fetchAllnotes', fetchUsers, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note)
  } catch (error) {
    res.status(500).send({ err: error.message })

  }

})


//Route -2  here we are creating api end point to post the notes
router.post('/addnote', fetchUsers, [
  body('title', "please enter a valid title").isLength({ min: 3 }),
  body("description", "please enter a valid description").isLength({ min: 5 })

], async (req, res) => {
  try {


    const { title, description, tag } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // here we are creating  new note
    const note = new Note({
      title, description, tag, user: req.user.id
    })
    console.log(note)
    const saveNote = await note.save()
    res.json(saveNote)

  } catch (error) {
    console.error(error.message);
    res.status(500).send({ err: error.message })
  }


})
//Route-3 here we are creating api end point to update note related to a perticular user ,when logged in
router.put('/updateNote/:id', fetchUsers,  async (req, res) => {
    // creating a new note object

    const { title, description, tag } = req.body;
    const newNote = {};

    if (title) {
      newNote.title = title
    };
    if (description) {
      newNote.description = description
    };
    if (tag) {
      newNote.tag = tag
    };
    // find the note to be updated and update it by using id from the params
    let note = await Note.findById(req.params.id);
    if(!note){
      return res.status(404). send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
       return res.status(401).send("Not Allowed to Access");
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote}, {new:true})
    res.json({note});

 
  
})

// Route -4 here we are going to create api end point to delete a note from the collection


router.delete('/deleteNote/:id', fetchUsers, async (req,res)=>{
  let note = await Note.findById(req.params.id);
    if(!note){
      return res.status(404). send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
       return res.status(401).send("Not Allowed to Access");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({note});
})

module.exports = router