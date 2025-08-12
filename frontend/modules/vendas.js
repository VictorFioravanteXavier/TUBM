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
        this.openDescriptionModal()
    }


    cacheSelectors() {
        const params = new URLSearchParams(window.location.search);

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

    openDescriptionModal() {
        $('#completDescripionVendaModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const modal = $(this);
            modal.find("#description-item-tbody").empty();

            const venda = button.data("venda");

            modal.find("#description-cod-venda").text(venda.cod_venda)
            modal.find("#description-account-name").text(venda.account_id.name)
            modal.find("#description-account-number").text(venda.account_id.number)
            modal.find("#description-data-venda").text(new Date(venda.data_venda).toLocaleDateString('pt-BR'))
            modal.find("#description-valor-total").text(`R$${(venda.valor_total / 100).toFixed(2)}`)
            modal.find("#description-status").text(`${venda.status ? "Pago" : "Pendente"}`)
            modal.find("#description-data-pagamento").text(`${venda.status ? new Date(venda.date_pay).toLocaleDateString('pt-BR') : "----"}`)

            venda.itens.forEach(item => {
                const dadosTable = `
                    <tr>
                        <td>
                            <div class="description-item-code">
                                ${item.produto_id.code}
                            </div>
                        </td>
                        <td>
                            <div class="description-item-name">
                                ${item.produto_id.name}
                            </div>
                        </td>
                        <td>
                            <div class="description-item-quantidade">
                                ${item.quantidade}
                            </div>
                        </td>
                        <td>
                            <div class="description-item-valor-unitario">
                                R$${(item.valor_venda / 100).toFixed(2)}
                            </div>
                        </td>
                        <td>
                            <div class="description-item-subtotal">
                                R$${(item.subtotal / 100).toFixed(2)}
                            </div>
                        </td>
                    </tr>
                `;

                modal.find("#description-item-tbody").append(dadosTable);
            });

        });
    }

}