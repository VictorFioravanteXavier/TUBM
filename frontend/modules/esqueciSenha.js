export class EsqueciSenha {
    constructor() {}

    init() {
        this.cacheSelectors();
        this.events();
    }

    cacheSelectors() {
        this.form = document.querySelector(".form-esqueci-senha"); 
        this.pEmail = document.querySelector("#p-email");
    }

    events() {
        if (!this.form) {
            console.warn("Formulário não encontrado!");
            return;
        }

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        
        const el = e.target;
        const inp_email = el.querySelector('input[name="email"]');
        const p = this.pEmail;
        const errors = [];

        p.innerHTML = "";
        p.hidden = true;

        if (!inp_email || inp_email.value.trim() === "") {
            errors.push("O campo de e-mail não pode ficar vazio.");
        } else {
            const email = inp_email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                errors.push("Formato de e-mail inválido.");
            }
        }

        if (errors.length > 0) {
            p.textContent = errors.join(" ");
            p.hidden = false;
            p.style.color = "red";
            return; 
        }

        p.textContent = "";
        p.hidden = true;
        el.submit();
    }
}
