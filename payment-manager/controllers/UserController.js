const { Helpers } = require("../helpers/Helpers");
const prisma = require("../prismaClient");
const bcrypt = require('bcryptjs');

class UserController {
    static async register(req, res){
        try {
            const { email, password } = req.body;
            if(!email || !password) throw "Input Email and Password"

            const user = await prisma.user.create({
                data: {
                    email,
                    password : bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                }
            })
            res.status(200).json({ message: "User has been created", user })
        } catch (error) {
            console.error('Registration failed:', error)
            // if(error.name === "PrismaClientKnownRequestError") {
            //     return res.status(400).json({ errorMessage: "Email must be unique"})
            // }
            res.status(400).json({ errorMessage: "Register failed", error})
        }
    }

    static async login(req, res){
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({ where: {email} })
            if(!user) throw "Email/Password invalid"

            const passCheck = Helpers.comparedPassword(password, user.password)
            if(!passCheck) throw "Email/Password invalid"

            const payload = {
                id: user.id
            }
            
            const access_token = Helpers.signToken(payload)

            res.status(200).json({message: "Login Success", token: access_token})
        } catch (error) {
            console.error('Login failed:', error)
            res.status(400).json({errorMessage: error})
        }
    }
}

module.exports = { UserController }