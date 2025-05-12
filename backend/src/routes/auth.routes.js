import express from 'express'
const router = express.Router();

import {signup , login , logout , updateProfile , checkAuth} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

 router.post('/signup' , signup);
 router.post('/login' , login);
 router.post('/logout' , logout);

 router.put('/update-profile' , protectRoute, updateProfile);
 // check user in login or not
 router.get('/check', protectRoute , checkAuth)   // http://localhost:3000/api/auth/check

export default router;