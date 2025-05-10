const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const estoqueController = require('./src/controllers/estoqueController');
const produtoController = require('./src/controllers/produtoController');

const { loginRequired } = require('./src/middlewares/middleware')

// Rotas da Login
router.get('/', loginController.index);
router.post('/login', loginController.login); // <- ESSENCIAL para autenticação
router.get('/logout', loginController.logout)
router.post('/register', loginController.register)

/* Rotas Estoque */
router.get('/estoque', loginRequired, estoqueController.index);

/* Rotas Produto */
router.get('/produto/', loginRequired, produtoController.index);
router.post('/produto/register/', loginRequired, produtoController.registrar);
router.get('/produto/:id', loginRequired, produtoController.editIndex);
router.post('/produto/edit/:id', loginRequired, produtoController.edit);
router.get('/produto/delete/:id', loginRequired, produtoController.delete);


// Rotas contato
router.get('/contato/index', loginRequired, contatoController.index)
router.post('/contato/register', loginRequired, contatoController.register)
router.get('/contato/index/:id', loginRequired, contatoController.editIndex)
router.post('/contato/edit/:id', loginRequired, contatoController.edit)
router.get('/contato/delete/:id', loginRequired, contatoController.delete)


module.exports = router;