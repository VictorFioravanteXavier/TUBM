import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/login';
import { Estoque } from './modules/estoque';
import { FazerVenda } from './modules/fazer-venda';
import { Cadastro } from './modules/cadastro';
import { UsersScreen } from './modules/usersScreen';
import { Accounts } from './modules/accounts';
import { Vendas } from './modules/vendas';
import { Compras } from './modules/compras';
import { MinhaConta } from './modules/minhaConta';
import { ShippingReporting } from './modules/shippingReporting';
import { EsqueciSenha } from './modules/esqueciSenha';
import { TrocarSenha } from './modules/trocarSenha';

// Classes
if (window.location.pathname === '/') {
    const loginForm = new Login('.form-login');
    loginForm.init();
}

if (window.location.pathname === "/cadastro") {
    const cadastro = new Cadastro();
    cadastro.init()
}

if (window.location.pathname.includes("estoque")) {
    const estoque = new Estoque();
    estoque.init()
}

if (window.location.pathname === '/fazer-venda/') {
    const fazer_venda = new FazerVenda();
    fazer_venda.init();
}

if (window.location.pathname.includes("usuarios")) {
    const users_screen = new UsersScreen();
    users_screen.init();
}

if (window.location.pathname.includes("contas")) {
    const accounts = new Accounts();
    accounts.init();
}

if (window.location.pathname.includes("vendas")) {
    const vendas = new Vendas();
    vendas.init();
}

if (window.location.pathname.includes("minhas-compras")) {
    const compras = new Compras();
    compras.init();
}


if (window.location.pathname.includes("minha-conta")) {
    const minhaConta = new MinhaConta();
    minhaConta.init();
}

if (window.location.pathname.includes("envio-relatorios")) {
    const shippingReporting = new ShippingReporting();
    shippingReporting.init();
}

if (window.location.pathname.includes("esqueci-senha")) {
    const esqueci_senha = new EsqueciSenha();
    esqueci_senha.init();
}

if (window.location.pathname.includes("trocar-senha")) {
    const trocar_senha = new TrocarSenha();
    trocar_senha.init();
}



// Funções fixas
const cpfStyle = () => {
    const cpfInputs = document.querySelectorAll('.cpf-style');
    if (cpfInputs) {
        cpfInputs.forEach(cpfInput => {
            cpfInput.addEventListener('input', function () {
                let value = this.value.replace(/\D/g, ''); 

                if (value.length > 11) value = value.slice(0, 11); 

                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                this.value = value;
            });
        });
    }
};

const phoneStyle = () => {
    const phoneInputs = document.querySelectorAll('.phone-style');

    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');

            if (value.length > 11) value = value.slice(0, 11); 

            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }

            this.value = value;
        });
    });
};


document.addEventListener("DOMContentLoaded", () => {
    cpfStyle();
    phoneStyle();
});

