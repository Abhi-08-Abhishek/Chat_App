import express from 'express'
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router();

// all user get gor sidebar
router.get('/users',protectRoute, getUsersForSidebar);
// user by id perticular user to get message
router.get('/:id',protectRoute, getMessages);
//message send to user to send message
router.post('/send/:id',protectRoute, sendMessage);

export default router;