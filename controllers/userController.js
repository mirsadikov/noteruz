const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/UserModel");
const Note = require("../models/NoteModel");
const getRandomInt = require("../utils/codeGenerator");
const sendSms = require("../utils/smsSender");

const registerUser = asyncHandler(async function (req, res) {
    const { user } = req.body;
    const usersExists = await User.findOne({ email: user.email });
    // || (await User.findOne({ phone: user.phone }));

    if (usersExists) {
        res.status(400);
        throw new Error("User already exists!");
    }

    const newUser = await User.create(user);
    if (newUser) {
        res.status(201)
            .cookie("token", generateToken(newUser._id), {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true,
            })
            .json({
                ok: true,
                profile: {
                    _id: newUser._id,
                    // firstName: newUser.firstName,
                    // lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                },
            });
    } else {
        res.status(400);
        throw new Error("Invalid user data!");
    }
});

const loginUser = asyncHandler(async function (req, res) {
    const { user } = req.body;
    const foundUser = await User.findOne({ email: user.email });

    if (foundUser && user.password === foundUser.password) {
        res.status(201)
            .cookie("token", generateToken(foundUser._id), {
                expires: new Date(Date.now() + 86400000),
            })
            .json({
                ok: true,
                profile: {
                    _id: foundUser._id,
                    // firstName: foundUser.firstName,
                    // lastName: foundUser.lastName,
                    email: foundUser.email,
                    telegramId: foundUser.telegramId,
                },
            });
    } else {
        res.status(401);
        throw new Error("Invalid email or password!");
    }
});

const getUserNotes = asyncHandler(async function (req, res) {
    const userNotes = await Note.find({ owner: req.user._id });

    res.json({
        notes: userNotes,
    });
});

const getProfile = asyncHandler(async function (req, res) {
    res.json({
        ok: true,
        profile: req.user,
    });
});

// const requestVerification = asyncHandler(async function (req, res) {
//     const code = getRandomInt(100000, 999999);
//     console.log(req.user.phone + " : " + code);
//     // sendSms(req.user.phone, code);

//     const foundUser = await User.findOne({ phone: req.user.phone });

//     foundUser.verificationCode = code;
//     foundUser.verificationCodeExpiration = Date.now() + 300000;

//     const saved = await foundUser.save();
//     if (saved) {
//         res.json({
//             ok: true,
//         });
//     }
// });
// const verify = asyncHandler(async function (req, res) {
//     const foundUser = await User.findOne({ phone: req.user.phone });

//     const recievedCode = req.body.verificationCode;
//     if (
//         recievedCode &&
//         recievedCode == foundUser.verificationCode &&
//         Date.now() < foundUser.verificationCodeExpiration
//     ) {
//         foundUser.isVerified = true;
//         foundUser.verificationCode = undefined;
//         foundUser.verificationCodeExpiration = undefined;
//         const saved = await foundUser.save();
//         if (saved) {
//             res.json({
//                 ok: true,
//                 saved,
//             });
//         } else {
//             res.status(400);
//             throw new Error("Something went wrong!");
//         }
//     } else {
//         res.status(400);
//         throw new Error("Invalid code or expired!");
//     }
// });

const linkTg = asyncHandler(async function (req, res) {
    const code = getRandomInt(10000000, 99999999);

    const foundUser = await User.findOne({ email: req.user.email });

    foundUser.verificationCode = code;
    foundUser.verificationCodeExpiration = Date.now() + 300000;

    const saved = await foundUser.save();
    if (saved) {
        res.json({
            ok: true,
            url: `https://t.me/noter_uz_bot?start=${foundUser._id}_${code}`,
        });
    }
});

const logOut = function (req, res) {
    res.clearCookie("token").json({ logOut: true });
};

module.exports = {
    registerUser,
    loginUser,
    getUserNotes,
    getProfile,
    // requestVerification,
    // verify,
    linkTg,
    logOut,
};
