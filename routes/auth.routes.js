const {Router} = require('express')
const bcrypt = require('bcryptjs') 
const router = Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Minimal passwords length is 6 symbols').isLength(6)
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect registration data'
            })
        }
        const {email, password} = req.body

        const candidate = await User.findOne({ email })

        if(candidate) {
            return res.status(400).json({message: 'Such user already exists!'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })

        await user.save()

        return res.status(201).json({message: 'User is created'})
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong, try again'
        })
        console.log(error)
    }
})

// /api/auth/login
router.post(
    '/login',
    [
       check('email', 'Enter correct email').normalizeEmail().isEmail(),
       check('password', 'Enter password').exists() 
    ], 
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({ message: 'User is not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({message: 'Incorrect password, try again'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h'}
            )

        res.json({ token, userId: user.id})    
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong, try aggain'
        })
        console.log(error)
    }
})

module.exports = router