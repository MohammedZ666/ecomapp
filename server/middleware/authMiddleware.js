const jwt = require('jsonwebtoken');
const User = require('../models/user')
const SECRET = 'this is my secret find it if you can'

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    //check json web token exists
    if (token) {
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            }
            else {
                console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    //check json web token exists
    if (token) {
        jwt.verify(token, SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(404).json({ "user": null })

            }
            else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id).lean();
                delete user.password
                res.json(user)
            }
        })
    } else {
        console.log("here")
        res.status(404).json({ "user": null })
    }

}

module.exports = { requireAuth, checkUser }