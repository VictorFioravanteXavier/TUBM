export class EsqueciSenha {
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
        const el = e.target;
        const inp_email = el.querySelector('input[name="email"]');
        const p = document.querySelector("#p-email");
        const errors = [];

        p.innerHTML = "";
        let error = false;

        if (!inp_email || inp_email.value.trim() === "") {
            errors.push("Não é aceito o email vazio");
            error = true;
        } else {
            const email = inp_email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                errors.push("Formato de e-mail inválido");
                error = true;
            }
        }

        if (errors.length > 0) {
            errors.forEach(errorMsg => {
                const div = document.createElement("div");
                div.textContent = errorMsg;
                p.appendChild(div);
            });
            p.hidden = false;
            return;
        }

        p.hidden = true;
        el.submit();
    }
    

}