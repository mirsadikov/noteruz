const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        requred: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    stage: {
        type: Number,
    },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
