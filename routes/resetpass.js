const express = require ("express");

const {passLogin,passVerify,isEmailRegister,passwordChange} = require("../controllers/resetpassword");



const router = express.Router();

router.use("/resetpassword",isEmailRegister);

router.post("/resetpassword/sendotp",passLogin);

router.post("/resetpassword/getotp",passVerify);

router.post("/resetpassword/password",passwordChange);



module.exports = router;