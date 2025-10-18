export class EsqueciSenha {
    constructor() {}

    init() {
        this.cacheSelectors();
        this.events();
    }

    cacheSelectors() {
        this.form = document.querySelector(".form-esqueci-senha"); // ID correto do form
        this.pEmail = document.querySelector("#p-email"); // parágrafo para mensagens
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
        console.log("AAAAA");
        
        const el = e.target;
        const inp_email = el.querySelector('input[name="email"]');
        const p = this.pEmail;
        const errors = [];

        p.innerHTML = "";
        p.hidden = true;

        // 🔍 Verificação de campo vazio
        if (!inp_email || inp_email.value.trim() === "") {
            errors.push("O campo de e-mail não pode ficar vazio.");
        } else {
            const email = inp_email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // 🔍 Verificação de formato
            if (!emailRegex.test(email)) {
                errors.push("Formato de e-mail inválido.");
            }
        }

        // ❌ Caso haja erros, mostra no <p> e não envia
        if (errors.length > 0) {
            p.textContent = errors.join(" ");
            p.hidden = false;
            p.style.color = "red";
            return; // impede envio
        }

        // ✅ Tudo certo → pode enviar
        p.textContent = "";
        p.hidden = true;
        console.log("Formulário válido — enviando...");
        el.submit();
    }
}
