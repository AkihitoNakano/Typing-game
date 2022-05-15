const res = require('express/lib/response')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

require('dotenv').config()
const secretKey = process.env.SECRET

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, secretKey)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e.message)
        res.status(401).send({ error: 'Please authenticate' })
    }
}

// req, res, next以外の引数を取る場合は要注意
function authRole(role) {
    try {
        return (req, res, next) => {
            if (req.user.role === role) {
                next()
            } else {
                res.status(401).send('Please authenticate')
            }
        }
    } catch (e) {
        res.status(500)
    }
}

module.exports = {
    auth,
    authRole,
}
