const express = require('express');
const router = express.Router();
const Order_tour = require('../../models/Order_tour');
var bodyParser = require('body-parser');
var fs = require('fs');
xml2js = require('xml2js');
const path = "D:/Javascript Projects/Node.js Project/Travel&Flight Booking System/order.xml";
var DOMParser = require('xmldom').DOMParser;


router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// @route GET api/order
// Getting all package
// @access public
router.get('/', async (req, res) => {
    try{
        //this returns all posts, you can add a filter by adding extra function if you want
        const packages = await Order_tour.find();
        res.json (packages);
    }
    catch(err){
        res.json({message: err});

        //it is used as back up for order if internet is down so user order is still saved
        fs.readFile('order.xml', "utf-8", (err, data) => {
            // too complicated using this code
            // var order = new DOMParser().parseFromString(data, 'text/xml');

            // for (name in order.getElementsByTagName("name").childNodes.nodeValue && 
            //     orderId in order.getElementsByTagName("orderId").childNodes.nodeValue && 
            //     person in order.getElementsByTagName("person").childNodes.nodeValue){
            //         res.json({
            //             name: name,
            //             orderId: orderId,
            //             person: person
            //         });
            // }

            //convert all data inside root and pass it as response in json
            var parseString = xml2js.parseString;
            parseString(data, function (err, result) {
                res.json(result.root);
            });
        });
    }
});

// @route DELETE api/order
// Getting all package
// @access public
router.delete('/:id', async (req, res) => {
    try{
        const removedPackage = await Order_tour.remove({_id: req.params.id });
        res.json(removedPackage);

       fs.readFile('order.xml', "utf-8", (err, data) => {
        var order = new DOMParser().parseFromString(data, 'text/xml');
        var found = false;
        var number = 0;
        while (found != true) {
            var x = order.getElementsByTagName("_id")[number];
            var y = x.childNodes[0].nodeValue;
            console.log(y);
            console.log('req.params.id :' + req.params.id);
            if (y == req.params.id) {
                console.log('condition reached: delete selected file');
                found = true;
                x.parentNode.removeChild(x);
                break;
            }
            console.log('current array for delete order:' + number);
            number++;
        }

       });
    }
    catch(err){
        res.json({message: err});
    }
});


// @route POST api/tour_Package/order
// Create a post request for ordering
// @access public
router.post('/', (req, res) => {
    const newPackage = new Order_tour({
        name: req.body.name,
        orderId: req.body.orderId,
        email: req.body.email,
        telephone: req.body.telephone,
        person: req.body.person
    });

    newPackage.save()
    .then(package => {
        res.json(package);

        console.log(JSON.stringify(package));

        //lower detail, only provide every data needed in the model
        var xmlobj = JSON.parse(JSON.stringify(package));
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(xmlobj);

        // detailed xml package, resulting in bigger file
        // var builder = new xml2js.Builder();
        // var xml = builder.buildObject(package);

        try{
            if (fs.existsSync(path)) {
                //File Exist
                fs.appendFile('order.xml', xml, (err) => {
                    // throws an error
                    if (err) throw err;
                    //in success log to console
                    console.log('Order Updated in Local Files');
                });
            }
            else {
            //if file doesnt exist
            fs.writeFile('order.xml', xml, (err) => {
                // throws an error
                if (err) throw err;
                //in success log to console
                console.log('Order Saved in Local Files');
            });
            }
        } catch(err) {
            console.log(err);
        }

        
    });
});

module.exports = router;