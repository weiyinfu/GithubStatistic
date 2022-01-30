const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');

// Express 是通过 next(error) 来表达出错的，无法识别 async 函数抛出的错误
// wrap 函数的作用在于将 async 函数抛出的错误转换为 next(error)
function wrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

// 组装路由
router.put('/:id/done', wrap(todoController.done));
router.put('/:id/undone', wrap(todoController.undone));
router.get('/', wrap(todoController.listAll));
router.post('/', wrap(todoController.create));
router.delete('/:id', wrap(todoController.delete));
router.delete('/', wrap(todoController.deleteAll));

module.exports = router;
