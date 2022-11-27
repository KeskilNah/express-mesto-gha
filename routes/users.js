const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  userInfo,
} = require('../controllers/users');
const { getUserByIdCelebrate, updateUserCelebrate, updateAvatarCelebrate } = require('../utils/celebrate');

router.get('/', getUsers);
router.get('/me', userInfo);
router.get('/:userId', getUserByIdCelebrate, getUserById);
router.patch('/me', updateUserCelebrate, updateUser);
router.patch('/me/avatar', updateAvatarCelebrate, updateAvatar);

module.exports = router;
