const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  createCardCelebrate, deleteCardCelebrate, likeCardCelebrate, dislikeCardCelebrate,
} = require('../utils/celebrate');

router.get('/', getCards);
router.post('/', createCardCelebrate, createCard);
router.delete('/:cardId', deleteCardCelebrate, deleteCard);
router.put('/:cardId/likes', likeCardCelebrate, likeCard);
router.delete('/:cardId/likes', dislikeCardCelebrate, dislikeCard);

module.exports = router;
