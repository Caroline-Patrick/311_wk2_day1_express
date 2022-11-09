
const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid')
// const bodyParser = require('body-parser')
const port = process.env.PORT || 4000;
const moment = require('moment');
// grab users variable from state.js folder (could take multiple variables and put them in the same curly braces separated by comma)
const { users } = require('./state');

const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} was accessed: ${moment().format()}`);
  next();
}

// initiate middleware
      // app.use(logger);

/* BEGIN - create routes here */
// app.get('/', (req, res)=>{
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// });

//body parser middlerware

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// set static folder
app.use(express.static(path.join(__dirname, 'public')));

//route gets all users (can use w/o curly braces b/c just one line)
app.get('/users', (req, res)=> res.json(users));

//get single member
app.get('/users/:_id', (req, res)=> {
  const found = users.some(users=> users._id === parseInt(req.params._id));

  if(found) {
    res.json(users.filter(users => users._id === parseInt(req.params._id)));
  }

  else{
    res.status(400).json({ msg: `No member with the id of ${req.params._id} found`})
  }
  
});


//create member
app.post('/users', (req, res)=> {
 
    const newMember ={
        _id: uuid.v4(),
        name: req.body.name,
        occupation: req.body.occupation,
        status: 'active'
    };
    if(!newMember.name || !newMember.occupation) {
      res.status(400).json({msg: 'Please include a name and occupation'});
    }
    users.push(newMember);
    res.json(users);
});

//Update user
// have to use parseInt, because it is returning a string
app.put('/users/:_id', (req, res)=> {
  const found = users.some(user=> user._id === parseInt(req.params._id));

  if(found) {
    const updateUser = req.body;
    users.forEach(user => {
      if(user._id === parseInt(req.params._id)){
        user.name = updateUser.name ? updateUser.name : user.name;
        user.occupation = updateUser.occupation ? updateUser.occupation : user.occupation;

        res.json({msg: 'User updated', user })
      }
    });
  }

  else{
    res.status(400).json({ msg: `No member with the id of ${req.params._id} found`})
  }
  
});

// Delete User

app.delete('/users/:_id', (req, res)=> {
  const found = users.some(user=> user._id === parseInt(req.params._id));

  if(found) {
    res.json({msg: 'Member deleted', users: users.filter(user => user._id !== parseInt(req.params._id))});
  }
  else{
    res.status(400).json({ msg: `No member with the id of ${req.params._id} found`})
  }
  
});

/* END - create routes here */

app.listen(port, () => 
  console.log(`Example app listening on port ${port}!`))