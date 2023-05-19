const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User")
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const fetchUsers = require("../Middlewares/fetchUsers");
require('dotenv').config()




const JWT_SECRET = 'shhhhh';
// here we are using validations from""express validator"

// Route for creating user
router.post('/createUser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'enter a valid password with atleast 6 characters').isLength({ min: 6 }),],
    async (req, res) => {
            let success = false;
        // here we are using bcrypt to protect our password . you can learn more about this at 'npm bcrypt.js'

        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(req.body.password, salt);

        //here we are checking duplicate email from db models

        try {
            let user = await User.findOne({ email: req.body.email });
            //if user exists then send res as error
            if (user) {
                return res.json({success, err: 'duplicate email' })
            } else {
                success = true;
                // we are creating user here
                user = await User.create({
                    name: req.body.name,
                    password: hash,
                    email: req.body.email
                })
                const data = {
                    user: {
                        id: user.id
                    }
                }
                
                //here we are using jsonwebtoken to hash our data and convert into token ,so that we can use this token to authenticate user.
                const token = jwt.sign(data, JWT_SECRET);
                console.log(token)


                // res.json(user)
                res.json({success, token })

            }
        } catch {
            err => {
                console.error(err.message)
                res.status(500).send("some error occurs")
            }
        }



    })

// Route for login user

router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'invalid credentials').exists(),],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }

        const { password, email } = req.body;
        //here we are checking duplicate email from db models

        try {
            let user = await User.findOne({ email });
            //if user exists then we have to decrypt password and compare it with password from req.body
            if (!user) {
                
                return res.status(400).json({ success,err: "invalid credentials" })
            }
            const passwordexists = await bcrypt.compareSync(password, user.password); // true

            if (!passwordexists) {
                success = false
                res.status(400).json({ success,err: "invalid credentials" })

            }

            const data = {
                user: {
                    id: user.id
                }
            }

            //here we are using jsonwebtoken to hash our data and convert into token ,so that we can use this token to authenticate user.
            const token = jwt.sign(data, JWT_SECRET);
            success=true;

            // res.json(user)
            res.json({ success,token })

        }
        catch {
            err => {
                console.error(err.message)
                res.status(500).send("some error occurs")
            }
        }



    })

    router.post('/getuser', fetchUsers,  async (req, res) => {

        try {
          userId = req.user.id;
          const user = await User.findById(userId).select("-password")
          res.send(user)
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
        }
      })


module.exports = router