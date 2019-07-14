const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//User model
const User = require('../../models/User');

// @route POST api/users
// register a new user
// @access public
router.post('/', (req, res) => {
   const {name, email, password, role } = req.body;

   // Validation
   if (!name || ! email || !password || !role){
    return res.status(400).json({ msg: 'Please enter all fields' });
   }

   //check for existing user
   User.findOne({ email })
    .then(user => {
        if(user) { return res.status(400).json({ msg: 'User already exists' })}

        const newuser = new User({
            name,
            email,
            password,
            role
        });

        //Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newuser.password, salt, (err, hash) => {
                if(err) throw err;
                newuser.password = hash;
                newuser.save()
                    .then(user => {
                        jwt.sign(
                            { 
                                id: user.id,
                                role: user.role 
                            },
                            config.get('jwtSecret'),
                            { expiresIn: 3600 },
                            // callback 
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,
                                    user: {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role
                                    }
                                });
                            }
                        )
                    });
            })
        })

    })
});



module.exports = router;