const { UnauthenticatedError, BadRequestError } = require('../errors')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')


const register = async(req, res) =>{
    const body = req.body   
    const user = await User.create({...body})

    const token = user.createJWT()//calls the createJWT FUNCTION
    res.status(StatusCodes.CREATED).json({user : {user : user.getName()}, token})
}

const login = async(req, res)=>{
    const {email, password} =  req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
   
    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const isPasswordCorrect = await  user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }
    //compare passwords
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user:{name : user.name},token ,msg:'login successful'})

}

module.exports = {
    register,
    login
}