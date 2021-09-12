
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const { validate } = require('../models/user');
const SECRET = 'this is my secret find it if you can'
const maxAge = 3 * 24 * 60 * 60;
var nodemailer = require('nodemailer');


const createToken = (id) => {
    return jwt.sign({ id }, SECRET, {
        expiresIn: maxAge
    })
}

const handleErrors = (err) => {
    console.log(err.code, err.message)
    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'that email is not registered'
    }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect'
    }

    //duplicate error code
    if (err.code === 11000) {
        errors.email = "that email is already registered"
        return errors;
    }
    console.log(err.message)
    // validation errors
    if (err.message.includes('failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors;
}


const signup_post = async (req, res) => {
    const { email, password, username, phone, address } = req.body;
    try {
        const user = await User.create({ email, password, username, phone, address })
        console.log(user)
        const token = createToken(user.id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
    } catch (error) {
        const errors = handleErrors(error)
        res.status(404).json(errors)
    }

}
const update_user = async (req, res) => {
    const { _id, email, password, username, phone, address } = req.body;
    try {
        const user = await User.findByIdAndUpdate({ _id },
            { email, password, username, phone, address },
            {
                runValidators: true,
                new: true,
                strict: "throw"

            })
        console.log(user)
        res.status(201).json({ user: user._id })
    } catch (error) {
        const errors = handleErrors(error)
        console.log(errors)
        res.status(404).json(errors)
    }

}
const login_post = async (req, res) => {
    console.log("login_post")
    const { email, password, remember } = req.body;

    try {
        const user = await User.login(email, password)
        const token = createToken(user.id)

        if (!remember) res.cookie('jwt', token, { httpOnly: true })
        else res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        res.status(200).json({ user: user._id })

    } catch (err) {
        const errors = handleErrors(err)
        console.log(err)
        res.status(400).json(errors)
    }
}

const logout_get = async (req, res, next) => {
    console.log("logout_post")
    const { email, password } = req.body;
    try {
        res.cookie('jwt', '', { httpOnly: true, maxAge: 1 })
        res.redirect("/")
    } catch (err) {
        const errors = handleErrors(err)
        console.log(err)
        res.status(400).json(err)
    }
}

const forgot_password = async (req, res) => {
    const transporter = nodemailer.createTransport(transport)
    const ejs = require("ejs");
    var email = req.body.email

    let user = await User.findOne({ email })
    if (!user) {
        res.status(404).json({ msg: 'fail' })
        return
    }
    user = await User.findOneAndUpdate(
        { email },
        { "otp": Math.floor(1000 + Math.random() * 9000) },
        { new: true }
    )
    ejs.renderFile(__dirname + "/emailTemplate.ejs",
        {
            username: user.username,
            confirm_link: `http://localhost:3000/resetPassword/${user.email}/${user.otp}`
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from: `"Zishan"${creds.USER} `,
                    to: email,
                    subject: 'Reset your password',
                    html: data
                };
                //console.log("html data ======================>", mainOptions.html);

                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        res.json({
                            msg: 'fail'
                        })
                    } else {
                        res.json({
                            msg: 'success'
                        })
                    }
                });
            }
        });

}

const reset_password = async (req, res) => {
    const { email, otp, password, confirmPassword } = req.body
    console.log(req.body)
    if (password !== confirmPassword) {
        res.status(404).json({ msg: "passwords don't match!", code: 0 })
    }
    try {
        let user = await User.findOne({ email }).lean()
        if (user.otp == otp) {
            delete user.otp
            user.password = password
            user = await User.findOneAndUpdate(
                { email },
                user,
                { new: true }
            )
            console.log(user)
            res.status(200).json({ msg: "success" })
        }
        else {
            res.status(404).json({ msg: "Could not update password, please try again" })
        }
    }
    catch (error) {
        res.status(404).json({ msg: "user not found by that email" })
    }

}

module.exports = {
    signup_post,
    update_user,
    login_post,
    logout_get,
    forgot_password,
    reset_password

}