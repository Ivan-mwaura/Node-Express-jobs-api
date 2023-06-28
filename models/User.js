const moongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new moongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'please provide email'],
       match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide valid email',],
       unique:true,
    },
    password:{
        type:String,
        required:[true, 'Please provide password'],
        minlength:5,
    },
})

//(pre)middleware to hash our password before storing it to our database
userSchema.pre('save', async function(next){

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//instance method to get the name from our document
userSchema.methods.getName = function (){
    return this.name
}

userSchema.methods.createJWT = function(){
    return jwt.sign(
        {
            userId: this._id, name: this.name},process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_LIFETIME
        }
    )
}

userSchema.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword ,this.password)
    
    return isMatch
}

module.exports = moongoose.model('User',userSchema)