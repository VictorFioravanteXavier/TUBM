const express = require('express');
const router = express.Router();

const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const estoqueController = require('./src/controllers/estoqueController');
const produtoController = require('./src/controllers/produtoController');
const vendasController = require('./src/controllers/vendasController');
const configuracoesController = require('./src/controllers/configuracoesController');
const fazerVendaController = require('./src/controllers/fazerVendaController');
const choicesScreenController = require('./src/controllers/choicesScreenController');
const UserScreenController = require('./src/controllers/UserScreenController');

const { loginRequired, roleFind } = require('./src/middlewares/middleware')

// Rotas da Login
router.get('/', loginController.index);
router.post('/login', loginController.login); // <- ESSENCIAL para autenticação
router.get('/logout', loginController.logout)
router.get('/cadastro', loginController.cadastro)
router.post('/register', loginController.register)

// Rotas Choices User
router.get('/escolha', loginRequired, roleFind, choicesScreenController.index)
router.get('/financeiroValid', loginRequired, roleFind, choicesScreenController.financeiro)

/* Users */
router.get("/usuarios/", loginRequired, roleFind, UserScreenController.index)
router.get("/usuarios/:page", loginRequired, roleFind, UserScreenController.index)
router.post("/usuarios/:id/editar", loginRequired, roleFind, UserScreenController.editUser)
router.get("/usuarios/delete/:id", loginRequired, roleFind, UserScreenController.delete)

/* Rotas Estoque */
router.get('/estoque', loginRequired, roleFind, estoqueController.index);

/* Rotas Produto */
router.get('/produto/', loginRequired, produtoController.index);
router.post('/produto/register/', loginRequired, produtoController.registrar);
router.get('/produto/:id', loginRequired, produtoController.editIndex);
router.post('/produto/edit/:id', loginRequired, produtoController.edit);
router.get('/produto/delete/:id', loginRequired, produtoController.delete);

/* Rotas Vendas */
router.get('/vendas/', loginRequired, vendasController.index);

/* Rotas Fazer Venda */
router.get('/fazer-venda/', loginRequired, fazerVendaController.index);
router.post('/fazer-venda/register', loginRequired, fazerVendaController.registrar);

/* Rotas Confugurações */
router.get('/configuracoes/', loginRequired, configuracoesController.index);
router.post('/configuracoes/register/', loginRequired, configuracoesController.registrar);
router.get('/configuracoes/:id', loginRequired, configuracoesController.editIndex);
router.post('/configuracoes/edit/:id', loginRequired, configuracoesController.edit);
router.get('/configuracoes/delete/:id', loginRequired, configuracoesController.delete);

// Rotas contato
router.get('/contato/index', loginRequired, contatoController.index)
router.post('/contato/register', loginRequired, contatoController.register)
router.get('/contato/index/:id', loginRequired, contatoController.editIndex)
router.post('/contato/edit/:id', loginRequired, contatoController.edit)
router.get('/contato/delete/:id', loginRequired, contatoController.delete)


module.exports = router;