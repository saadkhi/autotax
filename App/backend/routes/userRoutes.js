import express from 'express';
import { 
    createUser, 
    loginUser, 
    logoutCurrentUser, 
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
} from '../controllers/userController.js';
import { authenticate, authorizedAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// More specific routes should be defined first
router.route('/logout').post(logoutCurrentUser);

router.route('/auth').post(loginUser);

router.route('/profile')
.get(authenticate, getCurrentUserProfile)
.put(authenticate, updateCurrentUserProfile);

router.route('/')
.post(createUser)
.get(authenticate, authorizedAdmin);

router
.route('/:id')
.delete(authenticate, authorizedAdmin, deleteUserById)
.get(authenticate, authorizedAdmin, getUserById)
.put(authenticate, authorizedAdmin, updateUserById);

export default router;