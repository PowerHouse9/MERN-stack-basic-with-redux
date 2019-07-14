const config = require('config');
const jwt = require ('jsonwebtoken');

//This middleware is used to whenever we want a private route we can simply add this middleware as the second parameter in the endpoints
//example in the tour_Packages routes api
function auth(req, res, next) {
    const token = req.header('x-auth-token');

    //check for token
    if(!token) return res.status(401).json({msg: 'No token, Authorization Denied'});

        try{
            //Verify Token
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            //Add user from payload
            req.user = decoded;
            next();
        } catch(e) {
            res.status(400).json({msg: 'Token is not valid'});
        }
}

module.exports = auth;