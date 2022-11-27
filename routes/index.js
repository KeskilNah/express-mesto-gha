const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const notFoundControllers = require('../controllers/notFoundControllers');
const { loginCelebrate, createUserCelebrate } = require('../utils/celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', loginCelebrate, login);
router.post('/signup', createUserCelebrate, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', notFoundControllers);

module.exports = router;
