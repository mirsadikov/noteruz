const router = require("express").Router();
const {
    registerUser,
    loginUser,
    getUserNotes,
    getProfile,
    // requestVerification,
    // verify,
    linkTg,
    logOut,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/notes", protect, getUserNotes);
router.get("/profile", protect, getProfile);
// router.post("/requestverification", protect, requestVerification);
// router.post("/verify", protect, verify);
router.post("/linktg", protect, linkTg);
router.get("/logout", logOut);

module.exports = router;
