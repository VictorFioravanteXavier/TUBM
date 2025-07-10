export class UsersScreen {
    constructor() {

    }

    init() {
        this.events()
    }

    events() {
        this.cacheSelectors()
        this.buttonsStatsEvents()
        this.buttonsStatsEventsActivated()
        this.buttonsRoleEvents()
        this.buttonsRoleEventsActivated()
        this.searchUserName();
    }

    cacheSelectors() {
        this.btn_status_active = document.querySelector(".btn-active");
        this.btn_status_no_count = document.querySelector(".btn-no-count");
        this.btn_status_all = document.querySelector(".btn-all");

        this.btn_role_financeiro = document.querySelector(".btn-role-financeiro");
        this.btn_role_venda = document.querySelector(".btn-role-venda");
        this.btn_role_user = document.querySelector(".btn-role-user");
        this.btn_role_todos = document.querySelector(".btn-role-todos");
    }

    buttonsStatsEvents() {
        this.btn_status_active.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "ativo");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_status_no_count.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "sem-conta");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_status_all.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("status");
            window.location.href = `/usuarios/?${params.toString()}`;
        });
    }

    buttonsStatsEventsActivated() {
        const params = new URLSearchParams(window.location.search);
        switch (params.get("status")) {
            case "ativo":
                this.btn_status_active.classList.add("selected");
                break;

            case "sem-conta":
                this.btn_status_no_count.classList.add("selected");
                break;

            default:
                this.btn_status_all.classList.add("selected");
                break;
        }
    }


    buttonsRoleEvents() {

        this.btn_role_financeiro.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("cargo", "financeiro");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_role_venda.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("cargo", "venda");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_role_user.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("cargo", "user");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_role_todos.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("cargo"); // remove apenas o status, mantém os outros (como cargo)
            window.location.href = `/usuarios/?${params.toString()}`;
        });
    }


    buttonsRoleEventsActivated() {
        const params = new URLSearchParams(window.location.search);
        switch (params.get("cargo")) {
            case "financeiro":
                this.btn_role_financeiro.classList.add("selected");
                break;

            case "venda":
                this.btn_role_venda.classList.add("selected");
                break;

            case "user":
                this.btn_role_user.classList.add("selected");
                break;

            default:
                this.btn_role_todos.classList.add("selected");
                break;
        }
    }

    searchUserName() {
        document.getElementById("search-form").addEventListener("submit", function (e) {
            e.preventDefault(); // sempre previne o envio padrão

            const input = document.getElementById("search-input");
            const value = input.value.trim();

            // Pega os parâmetros atuais da URL para preservar filtros
            const params = new URLSearchParams(window.location.search);

            if (!value) {
                // Se vazio, remove o parâmetro "search" da URL e redireciona
                params.delete("search");
                window.location.href = `/usuarios/?${params.toString()}`;
                return;
            }

            // Se tem valor, seta o parâmetro search e redireciona
            params.set("search", value);
            window.location.href = `/usuarios/?${params.toString()}`;
        });
    }



}