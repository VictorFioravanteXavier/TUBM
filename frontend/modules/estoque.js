
export class Estoque {
    constructor() { }

    init() {
        this.events()
    }

    events() {
        this.cacheSelectors()
        this.buttonsActionsConfigure()
        this.searchProductName()
        this.searchProductNumber()
    }

    cacheSelectors() {
        const params = new URLSearchParams(window.location.search);

        this.buttons_edit = document.querySelectorAll('.btn-edit-estoque')
        this.buttons_delete = document.querySelectorAll('.btn-delete-estoque')

        this.form_search_name = document.querySelector("#search-form-name")
        this.inp_search_name = document.querySelector("#search-input-name")

        if (params.get("searchName")) {
            this.inp_search_name.value = params.get("searchName");
        }

        this.form_search_number = document.querySelector("#search-form-number")
        this.inp_search_number = document.querySelector("#search-input-number")

        if (params.get("searchNumber")) {
            this.inp_search_number.value = params.get("searchNumber");
        }
    }

    buttonsActionsConfigure() {
        this.buttons_edit.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                window.location.href = `/produto/${id}`
            });
        });

        this.buttons_delete.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm("Deseja realmente excluir esse produto?")) {
                    window.location.href = `/produto/delete/${id}`
                }
            });
        });
    }

    searchProductName() {
        this.form_search_name.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_name.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchName");
                window.location.href = `/estoque/?${params.toString()}`;
                return;
            }

            params.set("searchName", value);
            window.location.href = `/estoque/?${params.toString()}`;
        });
    }

    searchProductNumber() {
        this.form_search_number.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_number.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchNumber");
                window.location.href = `/estoque/?${params.toString()}`;
                return;
            }

            params.set("searchNumber", value);
            window.location.href = `/estoque/?${params.toString()}`;
        });
    }
}

