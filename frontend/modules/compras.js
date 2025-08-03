export class Compras {
    constructor() {

    }

    init() {
        this.events()
    }

    events() {
        this.cacheSelectors();
        this.searchBuyCode();
        this.buttonsStatsEvents();
        this.buttonsStatsEventsActivated();
        this.openDescriptionModal()
    }


    cacheSelectors() {
        this.form_search_code = document.querySelector("#search-form-compra")
        this.inp_search_code = document.querySelector("#search-input-compra")

        this.btn_status_pago = document.querySelector(".compras-pagas")
        this.btn_status_pendente = document.querySelector(".compras-pendentes")
        this.btn_status_all = document.querySelector(".compras-todas")
    }

    searchBuyCode() {
        const params = new URLSearchParams(window.location.search);
        this.inp_search_code.value = params.get("searchCode")

        this.form_search_code.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = this.inp_search_code.value.trim();

            const params = new URLSearchParams(window.location.search);

            if (!value) {
                params.delete("searchCode");
                window.location.href = `/minhas-compras/?${params.toString()}`;
                return;
            }

            params.set("searchCode", value);
            window.location.href = `/minhas-compras/?${params.toString()}`;
        });
    }

    buttonsStatsEvents() {
        this.btn_status_pago.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "pago");
            window.location.href = `/minhas-compras/?${params.toString()}`;
        });

        this.btn_status_pendente.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "pendente");
            window.location.href = `/minhas-compras/?${params.toString()}`;
        });

        this.btn_status_all.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("status");
            window.location.href = `/minhas-compras/?${params.toString()}`;
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

    openDescriptionModal() {
        $('#completDescripionVendaModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const modal = $(this);
            modal.find("#description-item-tbody").empty();

            const venda = button.data("compra");

            modal.find("#description-account-name").text(venda.account_id.name)
            modal.find("#description-account-number").text(venda.account_id.number)
            modal.find("#description-data-venda").text(new Date(venda.data_venda).toLocaleDateString('pt-BR'))
            modal.find("#description-valor-total").text(`R$${(venda.valor_total / 100).toFixed(2)}`)
            modal.find("#description-status").text(`${venda.status ? "Pago" : "Pendente"}`)
            modal.find("#description-data-pagamento").text(`${venda.status ? new Date(venda.date_pay).toLocaleDateString('pt-BR') : "----"}`)
            modal.find("#codigo-produto").remove();

            venda.itens.forEach(item => {
                const dadosTable = `
                    <tr>
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
                                R$${(item.produto_id.valor_venda / 100).toFixed(2)}
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