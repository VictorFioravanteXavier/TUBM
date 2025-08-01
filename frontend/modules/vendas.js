export class Vendas {
    constructor() {

    }

    init() {
        this.events()
    }

    events() {
        this.cacheSelectors();
        this.searchAccountName()
        this.searchAccountNumber()
        this.buttonsStatsEvents()
        this.buttonsStatsEventsActivated()
        this.deleteVendasButton()
    }


    cacheSelectors() {
        this.form_search_name = document.querySelector("#search-form-name")
        this.inp_search_name = document.querySelector("#search-input-name")

        this.form_search_number = document.querySelector("#search-form-number")
        this.inp_search_number = document.querySelector("#search-input-number")

        this.btn_status_pago = document.querySelector(".btn-active")
        this.btn_status_pendente = document.querySelector(".btn-inactive")
        this.btn_status_all = document.querySelector(".btn-all")

        this.delete_accounts_buttons = document.querySelectorAll(".delete-venda")
    }

    searchAccountName() {
        this.form_search_name.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_name.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchName");
                window.location.href = `/vendas/?${params.toString()}`;
                return;
            }

            params.set("searchName", value);
            window.location.href = `/vendas/?${params.toString()}`;
        });
    }

    searchAccountNumber() {
        this.form_search_number.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_number.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchNumber");
                window.location.href = `/vendas/?${params.toString()}`;
                return;
            }

            params.set("searchNumber", value);
            window.location.href = `/vendas/?${params.toString()}`;
        });
    }

    buttonsStatsEvents() {
        this.btn_status_pago.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "pago");
            window.location.href = `/vendas/?${params.toString()}`;
        });

        this.btn_status_pendente.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "pendente");
            window.location.href = `/vendas/?${params.toString()}`;
        });

        this.btn_status_all.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("status");
            window.location.href = `/vendas/?${params.toString()}`;
        });
    }

    buttonsStatsEventsActivated() {
        const params = new URLSearchParams(window.location.search);
        switch (params.get("status")) {
            case "pago":
                this.btn_status_pago.classList.add("selected");
                break;

            case "pendente":
                this.btn_status_pendente.classList.add("selected");
                break;

            default:
                this.btn_status_all.classList.add("selected");
                break;
        }
    }

    deleteVendasButton() {
        this.delete_accounts_buttons.forEach(delete_account_button => {
            delete_account_button.addEventListener('click', (e) => {
                const button = e.target;

                const name = button.dataset.name;
                const id = button.dataset.id;


                if (confirm(`Você realmente deseja deletar a compra de "${name}"?`)) {
                    fetch(`/vendas/delete/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                location.reload();
                            } else {
                                alert("Erro ao deletar o usuário.");
                            }
                        })
                        .catch(err => {
                            console.error("Erro na requisição:", err);
                        });
                }
            });
        })
    }
}