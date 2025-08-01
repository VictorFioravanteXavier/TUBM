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
    }


    cacheSelectors() {
        this.form_search_name = document.querySelector("#search-form-name")
        this.inp_search_name = document.querySelector("#search-input-name")

        this.form_search_number = document.querySelector("#search-form-number")
        this.inp_search_number = document.querySelector("#search-input-number")

        this.btn_status_pago = document.querySelector(".btn-active")
        this.btn_status_pendente = document.querySelector(".btn-inactive")
        this.btn_status_all = document.querySelector(".btn-all")

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
}