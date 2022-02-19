const asyncHandler = require("express-async-handler");
const Note = require("../models/NoteModel");
const User = require("../models/UserModel");

const createNote = asyncHandler(async function (req, res) {
    const noteCreator = await User.findOne({ email: req.user.email });

    if (!noteCreator) {
        res.status(401);
        throw new Error("Invalid user!");
    }

    const note = {
        owner: req.user._id,
        title: req.body.note.title,
        desc: req.body.note.desc,
    };
    const newNote = await Note.create(note);
    if (newNote) {
        res.status(201).json({
            ok: true,
            note: {
                _id: newNote._id,
                title: newNote.title,
                desc: newNote.desc,
                owner: newNote.owner,
            },
        });
    } else {
        res.status(400);
        throw new Error("Invalid note data!");
    }
});

const deleteNote = asyncHandler(async function (req, res) {
    const _id = req.params.id;
    const deleted = await Note.deleteOne({ _id, owner: req.user._id });

    if (deleted.deletedCount == 1) {
        res.json({
            ok: true,
        });
    } else {
        res.status(404);
        throw new Error("You are not owner or note not found!");
    }
});

module.exports = { createNote, deleteNote };
