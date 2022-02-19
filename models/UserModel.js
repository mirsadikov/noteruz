const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // firstName: {
    //     type: String,
    //     required: true,
    // },
    // lastName: {
    //     type: String,
    //     required: true,
    // },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // phone: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    // isVerified: {
    //     type: Boolean,
    //     default: false,
    // },
    verificationCode: {
        type: Number,
    },
    verificationCodeExpiration: {
        type: Number,
    },
    telegramId: {
        type: String,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
