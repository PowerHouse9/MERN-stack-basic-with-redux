const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Tour_package = require('../../models/Tour_package');

// @route GET api/tour_Package
// Getting all package
// @access public
router.get('/', async (req, res) => {
    try{
        //this returns all posts, you can add a filter by adding extra function if you want
        const packages = await Tour_package.find();
        res.json (packages);
    }
    catch(err){
        res.json({message: err});
    }
});

// @route POST api/tour_Package
// Create a post request
// @access private
router.post('/', auth, (req, res) => {
    const newPackage = new Tour_package({
        name: req.body.name,
        destination: req.body.destination,
        days: req.body.days,
        agent_email: req.body.agent_email,
        description: req.body.description
    });

    newPackage.save().then(package => res.json(package));
});

// @route DELETE api/tour_Package/:id
// Delete a request, after authenticated
// @access private
router.delete('/:id', auth, async (req, res) => {
    try{
    const removedPackage = await Tour_package.remove({_id: req.params.id });
    res.json(removedPackage);
    }
    catch(err){
        res.status(404);
        res.json({message: err})
    }
});

module.exports = router;