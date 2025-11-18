export class TrocarSenha {
    constructor() { }

    init() {
        this.cacheSelectors();
        this.events();
    }

    cacheSelectors() {
        this.form = document.querySelector(".form-trocar-senha");
        this.pSenha = document.querySelector("#p-senha");
        this.pRepSenha = document.querySelector("#p-repSenha");

        this.inp_senha = document.querySelector("[name='senha']");
        this.inp_rep_senha = document.querySelector("[name='rep_senha']");

        this.toggleButton = document.getElementById("showPassword");
        this.toggleRepButton = document.getElementById("showPassword-repeat");
    }

    events() {
        if (!this.form) {
            console.warn("Formulário não encontrado!");
            return;
        }

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.validate();
        });

        this.toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPassword();
        });

        this.toggleRepButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPasswordRepeat();
        });
    }

    validate() {
        const valid_password = this.validPassword();
        if (!valid_password) {
            alert("Senha inválida");
            return;
        }

        const valid_rep_password = this.validRepeatPassword();
        if (!valid_rep_password) {
            return;
        }

        console.log("Enviado");

        // Agora sim envia o formulário
        this.form.submit();
    }

    showPassword() {
        const icon = this.toggleButton.querySelector('i');

        if (this.inp_senha.type === "password") {
            this.inp_senha.type = "text";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        } else {
            this.inp_senha.type = "password";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    }

    showPasswordRepeat() {
        const icon = this.toggleRepButton.querySelector('i');

        if (this.inp_rep_senha.type === "password") {
            this.inp_rep_senha.type = "text";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        } else {
            this.inp_rep_senha.type = "password";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    }

    validPassword() {
        const errors = [];
        this.pSenha.innerHTML = "";

        if (!this.inp_senha || this.inp_senha.value.trim() === "") {
            errors.push("A senha não pode estar vazia.");
        } else {
            const password = this.inp_senha.value.trim();

            if (password.length < 8) {
                errors.push("A senha deve ter pelo menos 8 caracteres.");
            }

            if (!/[A-Z]/.test(password)) {
                errors.push("A senha deve conter ao menos uma letra maiúscula.");
            }

            if (!/[a-z]/.test(password)) {
                errors.push("A senha deve conter ao menos uma letra minúscula.");
            }

            if (!/[0-9]/.test(password)) {
                errors.push("A senha deve conter ao menos um número.");
            }

            if (!/[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                errors.push("A senha deve conter ao menos um caractere especial.");
            }
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                const div = document.createElement("div");
                div.textContent = error;
                this.pSenha.appendChild(div);
            });
            this.pSenha.hidden = false;
            return false;
        }

        this.pSenha.hidden = true;
        return true;
    }

    validRepeatPassword() {
        const errors = [];
        this.pRepSenha.innerHTML = "";

        if (
            !this.inp_rep_senha || this.inp_rep_senha.value.trim() === "" ||
            !this.inp_senha || this.inp_senha.value.trim() === ""
        ) {
            errors.push("O campo não pode estar vazio.");
        } else if (this.inp_rep_senha.value !== this.inp_senha.value) {
            errors.push("As duas senhas devem ser iguais.");
        }

        if (errors.length > 0) {
            this.pRepSenha.hidden = false;
            errors.forEach(error => {
                const div = document.createElement("div");
                div.textContent = error;
                this.pRepSenha.appendChild(div);
            });
            return false;
        }

        this.pRepSenha.hidden = true;
        return true;
    }
}
