const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const vendasController = require('./src/controllers/vendasController');

const { loginRequired } = require('./src/middlewares/middleware')

// Rotas da Login
router.get('/', loginController.index);
router.post('/login', loginController.login); // <- ESSENCIAL para autenticação
router.get('/logout', loginController.logout)
router.post('/register', loginController.register)

/* Rotas Vendas */
router.get('/vendas', loginRequired,vendasController.index);

// Rotas contato
router.get('/contato/index', loginRequired, contatoController.index)
router.post('/contato/register', loginRequired, contatoController.register)
router.get('/contato/index/:id', loginRequired, contatoController.editIndex)
router.post('/contato/edit/:id', loginRequired, contatoController.edit)
router.get('/contato/delete/:id', loginRequired, contatoController.delete)


module.exports = router;