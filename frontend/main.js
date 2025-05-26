import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/login';
import { Estoque } from './modules/estoque';
import { Confugurações } from './modules/configuracoes';
import { FazerVenda } from './modules/fazer-venda';

// Inicializa os formulários
const loginForm = new Login('.form-login');
const registerForm = new Login('.form-cadastro');

loginForm.init();
registerForm.init();

const estoque = new Estoque();
estoque.init()

const configuracoes = new Confugurações()
configuracoes.init()

if (window.location.pathname === '/fazer-venda/') {
    const fazer_venda = new FazerVenda();
    fazer_venda.init();
}
