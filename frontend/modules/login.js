import validator from 'validator';

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validate(e)
        });

        document.querySelector('#showPassword')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.showPassword();
        });

    }

    validate(e) {
        const el = e.target
        const passwordInput = el.querySelector('input[name="password"]')

        let error = false


        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            alert('Senha precisa ter entre 3 a 50 caracteres ')
            error = true
        }

        if (!error) el.submit()
    }

    showPassword() {
        const passwordInput = document.getElementById("password-login");
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
}