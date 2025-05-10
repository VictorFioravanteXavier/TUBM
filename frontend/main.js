import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/login';
import { Estoque } from './modules/estoque';

// Inicializa os formulários
const loginForm = new Login('.form-login');
const registerForm = new Login('.form-cadastro');

loginForm.init();
registerForm.init();

const estoque = new Estoque();
estoque.init()