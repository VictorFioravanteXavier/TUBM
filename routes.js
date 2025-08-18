const express = require('express');
const router = express.Router();

const loginController = require('./src/controllers/loginController');
const estoqueController = require('./src/controllers/estoqueController');
const produtoController = require('./src/controllers/produtoController');
const vendasController = require('./src/controllers/vendasController');
const fazerVendaController = require('./src/controllers/fazerVendaController');
const choicesScreenController = require('./src/controllers/choicesScreenController');
const UserScreenController = require('./src/controllers/UserScreenController');
const accountsController = require('./src/controllers/accountsController');
const comprasController = require('./src/controllers/comprasController');
const minhaContaController = require('./src/controllers/minhaContaController');
const shippingReportingController = require('./src/controllers/shippingReportingController');

const { loginRequired, roleFind } = require('./src/middlewares/middleware')

// Rotas da Login
router.get('/', loginController.index);
router.post('/login', loginController.login);
router.get('/logout', loginController.logout)
router.get('/cadastro', loginController.cadastro)
router.post('/register', loginController.register)

// Rotas Choices User
router.get('/escolha', loginRequired, roleFind, choicesScreenController.index)
router.get('/financeiroValid', loginRequired, roleFind, choicesScreenController.financeiro)
router.get('/vendaValid', loginRequired, roleFind, choicesScreenController.venda)
router.get('/userValid', loginRequired, roleFind, choicesScreenController.user)

/* Users */
router.get("/usuarios/", loginRequired, roleFind, UserScreenController.index)
router.get("/usuarios/:page", loginRequired, roleFind, UserScreenController.index)
router.post("/usuarios/:id/editar", loginRequired, roleFind, UserScreenController.editUser)
router.get("/usuarios/delete/:id", loginRequired, roleFind, UserScreenController.delete)
router.get("/usuarios/api/getAll", loginRequired, roleFind, UserScreenController.getAll)

/* Accounts */
router.get("/contas/", loginRequired, roleFind, accountsController.index)
router.get("/contas/:page", loginRequired, roleFind, accountsController.index)
router.post("/contas/register", loginRequired, roleFind, accountsController.register)
router.post("/contas/edit/:id", loginRequired, roleFind, accountsController.edit)
router.get("/contas/delete/:id", loginRequired, roleFind, accountsController.delete)
router.get("/contas/deactivate/:id", loginRequired, roleFind, accountsController.deactivate)
router.get("/contas/activate/:id", loginRequired, roleFind, accountsController.activate)

/* Rotas Estoque */
router.get('/estoque/', loginRequired, roleFind, estoqueController.index);
router.get('/estoque/:page', loginRequired, roleFind, estoqueController.index);

/* Rotas Produto */
router.get('/produto/', loginRequired, produtoController.index);
router.post('/produto/register/', loginRequired, produtoController.registrar);
router.get('/produto/:id', loginRequired, produtoController.editIndex);
router.post('/produto/edit/:id', loginRequired, produtoController.edit);
router.get('/produto/delete/:id', loginRequired, produtoController.delete);

/* Rotas Vendas */
router.get('/vendas/', loginRequired, roleFind, vendasController.index);
router.get("/vendas/:page", loginRequired, roleFind, vendasController.index)
router.get('/vendas/delete/:id', loginRequired, vendasController.delete);

/* Rotas Fazer Venda */
router.get('/fazer-venda/', loginRequired, fazerVendaController.index);
router.post('/fazer-venda/register', loginRequired, fazerVendaController.registrar);

/* Rotas Minhas Compras  */
router.get('/minhas-compras/', loginRequired, comprasController.index)
router.get('/minhas-compras/:page', loginRequired, comprasController.index)

/* Rotas Minha Conta */
router.get('/minha-conta/', loginRequired, minhaContaController.index)

/* Rotas Envio & Relatórios */
router.get('/envio-relatorios/', loginRequired, shippingReportingController.index)
router.get('/envio-relatorios/getFiltred/', loginRequired, shippingReportingController.getDataFiltred)
router.post('/envio-relatorios/getFiltred/:page', loginRequired, shippingReportingController.getDataFiltred)


module.exports = router;