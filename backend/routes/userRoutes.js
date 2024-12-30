const express =require('express');
const router =express.Router()
const {authUser,registerUser,allUsers}=require('../controllers/userControllers');
const {protect} =require('../middleware/authMiddleware');
const validateRegistration  =require ('../middleware/validateUser.js');
router.post('/',validateRegistration,registerUser);
 router.post('/login',authUser);
router.get('/',protect,allUsers);

module.exports=router;