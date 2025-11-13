import { isValidCPF } from "../assets/util/validCpf"

export class Cadastro {
  constructor() {

  }

  init() {
    this.events()
  }

  events() {
    document.querySelector('#showPassword')?.addEventListener('click', (event) => {
      event.preventDefault();
      this.showPassword();
    });

    document.querySelector('#showPassword-repeat')?.addEventListener('click', (event) => {
      event.preventDefault();
      this.showPasswordRepeat();
    });

    document.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();

      if (!this.validForm()) {
        console.log("Formulário com erros. Envio cancelado.");
        return;
      }

      event.target.submit();
    }.bind(this));

  }

  showPassword() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("showPassword");
    const icon = toggleButton.querySelector('i');

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  }

  showPasswordRepeat() {
    const passwordInput = document.getElementById("password-repeat");
    const toggleButton = document.getElementById("showPassword-repeat");
    const icon = toggleButton.querySelector('i');

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  }

  validName() {
    const form = document.querySelector("form");
    const inp_name = form.querySelector('[name="name"]');
    const p = document.querySelector("#p-name");

    p.innerHTML = "";
    p.hidden = true;

    if (!inp_name || inp_name.value.trim() === "") {
      const div = document.createElement('div');
      div.textContent = "Adicione um nome válido";
      p.appendChild(div);
      p.hidden = false;
      return false;
    }

    return true;
  }

  validCPF() {
    const form = document.querySelector("form");
    const inp_cpf = form.querySelector('[name="cpf"]');
    const p = document.querySelector("#p-cpf");
    const errors = [];

    p.innerHTML = "";

    if (!inp_cpf || inp_cpf.value.trim() === "") {
      errors.push("Adicione um CPF");
    } else {
      const cpf = inp_cpf.value.trim();

      if (!isValidCPF(cpf)) {
        errors.push("CPF inválido");
      }
    }

    if (errors.length > 0) {
      p.hidden = false;
      errors.forEach(error => {
        const div = document.createElement("div");
        div.textContent = error;
        p.appendChild(div);
      });
      return false;
    } else {
      p.hidden = true;
      return true;
    }
  }


  validEmail() {
    const form = document.querySelector("form");
    const inp_email = form.querySelector('[name="email"]');
    const p = document.querySelector("#p-email");
    const errors = [];

    p.innerHTML = "";

    if (!inp_email || inp_email.value.trim() === "") {
      errors.push("Não é aceito o email vazio");
    } else {
      const email = inp_email.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        errors.push("Formato de e-mail inválido");
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        const div = document.createElement("div");
        div.textContent = error;
        p.appendChild(div);
      });
      p.hidden = false;
      return false;
    } else {
      p.hidden = true;
      return true;
    }
  }

  validTel() {
    const form = document.querySelector("form");
    const inp_tel = form.querySelector('[name="tel"]');
    const p = document.querySelector("#p-tel");
    const errors = [];

    p.innerHTML = ""; // limpa mensagens anteriores

    if (!inp_tel || inp_tel.value.trim() === "") {
      errors.push("O telefone não pode estar vazio.");
    } else {
      const tel = inp_tel.value.trim();
      const telRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[-\s]?\d{4}$/;

      if (!telRegex.test(tel)) {
        errors.push("Formato de telefone inválido. Exemplo válido: (11) 91234-5678");
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        const div = document.createElement("div");
        div.textContent = error;
        p.appendChild(div);
      });
      p.hidden = false;
      return false;
    } else {
      p.hidden = true;
      return true;
    }
  }

  validPassword() {
    const form = document.querySelector("form");
    const inp_password = form.querySelector('[name="password"]');
    const p = document.querySelector("#p-password");
    const errors = [];

    p.innerHTML = ""; 

    if (!inp_password || inp_password.value.trim() === "") {
      errors.push("A senha não pode estar vazia.");
    } else {
      const password = inp_password.value.trim();

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
        p.appendChild(div);
      });
      p.hidden = false;
      return false;
    } else {
      p.hidden = true;
      return true;
    }
  }

  validRepeatPassword() {
    const form = document.querySelector("form");
    const inp_password = form.querySelector('[name="password"]');
    const inp_password_repeat = form.querySelector('[name="password-repeat"]');
    const p = document.querySelector("#p-password-repeat");
    const errors = [];

    p.innerHTML = "";

    if (
      !inp_password_repeat || inp_password_repeat.value.trim() === "" ||
      !inp_password || inp_password.value.trim() === ""
    ) {
      errors.push("O campo não pode estar vazio.");
    } else if (inp_password_repeat.value !== inp_password.value) {
      errors.push("As duas senhas devem ser iguais.");
    }

    if (errors.length > 0) {
      p.hidden = false;
      errors.forEach(error => {
        const div = document.createElement("div");
        div.textContent = error;
        p.appendChild(div);
      });
      return false;
    } else {
      p.hidden = true;
      return true;
    }
  }

  validTerms() {
    const checkbox = document.querySelector('[name="termos-uso"]');
    const p = document.querySelector("#p-termos");
    p.innerHTML = "";
    p.hidden = true;

    if (!checkbox.checked) {
      const div = document.createElement("div");
      div.textContent = "Você deve aceitar os termos de uso.";
      p.appendChild(div);
      p.hidden = false;
      return false;
    }

    return true;
  }

  validForm() {
    let valid = true;

    if (!this.validName()) {
      valid = false
    }

    if (!this.validCPF()) {
      valid = false
    }

    if (!this.validEmail()) {
      valid = false
    }

    if (!this.validTel()) {
      valid = false
    }

    if (!this.validPassword()) {
      valid = false
    }

    if (!this.validRepeatPassword()) {
      valid = false
    }

    if (!this.validTerms()) {
      valid = false
    }

    return valid;
  }

}
