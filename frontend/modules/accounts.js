export class Accounts {
    constructor() {

    }

    init() {
        this.events()
    }

    events() {
        this.cacheSelectors()
        this.searchAccountName()
        this.searchAccountNumber()
        this.buttonsStatsEvents()
        this.buttonsStatsEventsActivated()
    }

    cacheSelectors() {
        this.form_search_name = document.getElementById("search-form-name")
        this.inp_search_name = document.getElementById("search-input-name")

        this.form_search_number = document.getElementById("search-form-number")
        this.inp_search_number = document.getElementById("search-input-number")

        this.btn_status_active = document.querySelector(".btn-active")
        this.btn_status_inactive = document.querySelector(".btn-inactive")
        this.btn_status_all = document.querySelector(".btn-all")
    }

    searchAccountName() {
        this.form_search_name.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_name.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchName");
                window.location.href = `/contas/?${params.toString()}`;
                return;
            }

            params.set("searchName", value);
            window.location.href = `/contas/?${params.toString()}`;
        });
    }

    searchAccountNumber() {
        this.form_search_number.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_number.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchNumber");
                window.location.href = `/contas/?${params.toString()}`;
                return;
            }

            params.set("searchNumber", value);
            window.location.href = `/contas/?${params.toString()}`;
        });
    }

    buttonsStatsEvents() {
        this.btn_status_active.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "ativo");
            window.location.href = `/contas/?${params.toString()}`;
        });

        this.btn_status_inactive.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "inativo");
            window.location.href = `/contas/?${params.toString()}`;
        });

        this.btn_status_all.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("status");
            window.location.href = `/contas/?${params.toString()}`;
        });
    }

    buttonsStatsEventsActivated() {
        const params = new URLSearchParams(window.location.search);
        switch (params.get("status")) {
            case "ativo":
                this.btn_status_active.classList.add("selected");
                break;

            case "inativo":
                this.btn_status_inactive.classList.add("selected");
                break;

            default:
                this.btn_status_all.classList.add("selected");
                break;
        }
    }

}