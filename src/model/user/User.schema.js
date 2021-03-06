const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 50,
        required: true
    },
    company: {
        type: String,
        maxlength: 100
    },
    address: {
        type: String,
        maxlength: 100
    },
    phone: {
        type: String,
        maxlength: 15
    },
    email: {
        type: String,
        maxlength: 50,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 100,
        required: true
    },
    refreshJWT:{
        token: {
            type:String,
            maxlength: 500,
            default:''
        },
        addedAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = {
    UserSchema: mongoose.model('User', UserSchema)
}