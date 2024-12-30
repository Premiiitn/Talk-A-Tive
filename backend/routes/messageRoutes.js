const express =require('express');
const router =express.Router()
const {sendMessage,allMessage} =require('../controllers/messageControllers');
const {protect} =require ("../middleware/authMiddleware.js");
router.post('/',protect,sendMessage);
router.get('/:chatId',protect,allMessage);

module.exports=router;