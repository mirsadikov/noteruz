const mongoose = require("mongoose");
const Note = require("../models/NoteModel");
const User = require("../models/UserModel");

class Conterollers {
    static async MessageController(bot, msg) {
        const chat_id = msg.chat.id;

        // if bot gets msg in private chat
        // if (msg.chat.type == "private") {
        //     await bot.sendmsg(chat_id, "Hey, add me to the group!");
        // }

        // if msg is command
        if (msg.text.startsWith("/")) {
            await this.CommandController(msg, bot, chat_id);
        } // if msg is text
        else {
            await this.TextController(msg, bot, chat_id);
        }
    }

    static async CommandController(msg, bot, chat_id) {
        if (msg.text == "/start" || msg.text == "/start") {
            const _id = await User.exists({ telegramId: chat_id });

            if (!_id) {
                const text = `Please first link your account <a href="${process.env.DOMEN}">here</a>!`;
                bot.sendMessage(chat_id, text, {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard: [["/start"]],
                        resize_keyboard: true,
                    },
                });
            } else {
                bot.sendMessage(chat_id, "<b>Welcome!</b>", {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard: [["My notes"], ["Create note"]],
                        resize_keyboard: true,
                    },
                });
            }
        }
        if (msg.text.includes("/start ")) {
            const [_id, code] = msg.text.split(" ")[1].split("_");

            const foundUser = await User.findOne({ _id });
            const userAlreadyLinked = await User.findOne({
                telegramId: chat_id,
            });

            if (userAlreadyLinked) {
                bot.sendMessage(
                    chat_id,
                    "You have already linked another account!"
                );
            } else if (!foundUser) {
                bot.sendMessage(chat_id, "User not found!");
            } else {
                if (
                    code &&
                    code == foundUser.verificationCode &&
                    Date.now() < foundUser.verificationCodeExpiration
                ) {
                    foundUser.telegramId = chat_id;
                    foundUser.verificationCode = undefined;
                    foundUser.verificationCodeExpiration = undefined;
                    const updated = foundUser.save();
                    if (!updated) throw new Error("Cannot link telegram!");
                    else
                        bot.sendMessage(chat_id, "Successfully linked!", {
                            reply_markup: {
                                keyboard: [["My notes"], ["Create note"]],
                                resize_keyboard: true,
                            },
                        });
                } else bot.sendMessage(chat_id, "Wrong or expired code!");
            }
        }
    }

    static async TextController(msg, bot, chat_id) {
        try {
            if (msg.text == "My notes") {
                const foundUser = await User.findOne({ telegramId: chat_id });

                if (!foundUser)
                    throw new Error("Please link your account again!");
                const userNotes = await Note.find({ owner: foundUser._id });

                const notesStr = userNotes
                    .map(
                        (note) =>
                            `<b>Note title:</b> ${note.title ?? "None"} 
<b>Description:</b> ${note.desc}`
                    )
                    .join("\n---------------\n");

                bot.sendMessage(
                    chat_id,
                    notesStr ? notesStr : "You don't have any notes!",
                    { parse_mode: "HTML" }
                );
            }

            if (msg.text == "Create note") {
                const { _id: owner } = await User.findOne({
                    telegramId: chat_id,
                });
                await Note.create({
                    stage: 0,
                    desc: "desc",
                    title: "title",
                    owner,
                });

                bot.sendMessage(chat_id, "<b>Send note title:</b>", {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard: [["Cancel"]],
                        resize_keyboard: true,
                        remove_keyboard: true,
                    },
                });
            } else if (msg.text == "Cancel") {
                const { _id: owner } = await User.findOne({
                    telegramId: chat_id,
                });
                await Note.deleteMany({
                    owner,
                    stage: { $ne: null },
                });
                bot.sendMessage(chat_id, "Cancelled!", {
                    reply_markup: {
                        keyboard: [["My notes"], ["Create note"]],
                        resize_keyboard: true,
                    },
                });
            } else if (
                (await Note.count({
                    telegramId: chat_id,
                    stage: { $ne: null },
                })) > 0
            ) {
                const note = await Note.findOne({
                    telegramId: chat_id,
                    stage: { $ne: null },
                });

                if (note.stage == 0) {
                    note.title = msg.text;
                    note.stage += 1;
                    await note.save();

                    bot.sendMessage(chat_id, "<b>Send note description:</b>", {
                        parse_mode: "HTML",
                        // reply_markup: {
                        //     keyboard: [
                        //         [
                        //             {
                        //                 text: "Cancel",
                        //                 remove_keyboard: true,
                        //             },
                        //         ],
                        //     ],
                        //     resize_keyboard: true,
                        // },
                    });
                } else if (note.stage == 1) {
                    note.desc = msg.text;
                    note.stage = null;
                    await note.save();

                    bot.sendMessage(chat_id, "Successfully created!", {
                        reply_markup: {
                            keyboard: [["My notes"], ["Create note"]],
                            resize_keyboard: true,
                        },
                    });
                }
            }
        } catch (err) {
            console.log(err);
            bot.sendMessage(chat_id, "Failed!");
        }
    }
}

module.exports = Conterollers;
