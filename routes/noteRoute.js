const router = require("express").Router();
const {
    createNote,
    deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create", protect, createNote);
router.delete("/delete/:id", protect, deleteNote);

module.exports = router;
