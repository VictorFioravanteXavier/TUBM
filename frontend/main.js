import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/login';

// Inicializa os formulários
const loginForm = new Login('.form-login');
const registerForm = new Login('.form-cadastro');

loginForm.init();
registerForm.init();