export class ShippingReporting {
    constructor() {
        this.filtros = {};
        this.errors = []
    }

    init() {
        this.events();
    }

    events() {
        this.cacheSelectors();
    }

    cacheSelectors() {
        this.token = document.querySelector("input[name='_csrf']").value;

        this.inp_inital_date = document.querySelector("#initial-date")
        this.inp_final_date = document.querySelector("#final-date")
        this.inp_status = document.querySelector("#status")
        this.inp_min_val = document.querySelector("#min-val")
        this.inp_max_val = document.querySelector("#max-val")
        this.inp_account = document.querySelector("#account")

        this.form = document.querySelector("form")

        this.manesage_table = document.querySelector(".manesage-table")

        this.form.addEventListener("submit", async (e) => {
            e.preventDefault()

            await this.saveFiltros()
        })

        this.table = document.querySelector("tbody")

        this.pagination = document.querySelector(".pagination");

        this.limparFiltrosButton = document.querySelector(".limpar-filtros")
        this.limparFiltrosButton.addEventListener("click", (e) => {
            e.preventDefault()
            this.limparFiltros()
        })
    }

    async saveFiltros(page = 1) {
        this.valida();

        try {
            const response = await fetch(`/envio-relatorios/getFiltred/${page}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify(this.filtros)
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar relatórios filtrados");
            }

            const data = await response.json();

            if (data.vendas.length !== 0) {
                this.attTable(data.vendas)
                this.attPagination(data.currentPage, data.totalPages)
            } else {
                this.table.innerHTML = ""
                this.manesage_table.style.display = "flex"
                this.manesage_table.style.color = "#B82627"
                this.manesage_table.textContent = "Nenhum item encontrado"
                this.pagination.style.display = "none"
            }

        } catch (error) {
            console.error(error);
        }
    }

    attTable(vendas) {
        this.manesage_table.style.display = "none"
        this.table.innerHTML = ""
        vendas.forEach(venda => {
            const tds_tabela = `
                <td>${new Date(venda.data_venda).toLocaleDateString('pt-BR')}</td>
        
                <td>${venda.cod_venda}</td>
            
                <td>${venda.account_id.name}</td>

                <td>${(venda.valor_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>

                <td>
                    ${venda.status ?
                    `<div class="pay status">Paga</div>` :
                    `<div class="pending status">Pendente</div>`
                }
                </td>
            `

            this.table.innerHTML += tds_tabela
        });
    }

    attPagination(currentPage, totalPages) {
        this.pagination.innerHTML = ""
        this.pagination.style.display = "flex"

        const left_index = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" data-page="${currentPage - 1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `

        const right_index = `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a href="#" class="page-link" data-page="${currentPage + 1}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `

        let indexes = ""

        for (let i = 1; i <= totalPages; i++) {
            const index = ` 
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            </li>
        `
            indexes += index
        }

        this.pagination.innerHTML += left_index
        this.pagination.innerHTML += indexes
        this.pagination.innerHTML += right_index

        this.funcionalidadesPagination()
    }

    funcionalidadesPagination() {
        const buttons = this.pagination.querySelectorAll(".page-link")
        const self = this

        buttons.forEach(element => {
            element.addEventListener("click", function (event) {
                event.preventDefault()
                const page = this.dataset.page
                if (page) {
                    self.saveFiltros(parseInt(page, 10))
                }
            })
        })
    }

    limparFiltros() {
        this.inp_account.value = ""
        this.inp_final_date.value = ""
        this.inp_inital_date.value = ""
        this.inp_max_val.value = ""
        this.inp_min_val.value = ""
        this.inp_status.selectedIndex = 0;

        this.filtros = {}
    }

    valida() {
        this.filtros = {}

        const initialDate = new Date(this.inp_inital_date.value);
        const finalDate = new Date(this.inp_final_date.value);
        const minVal = parseFloat(this.inp_min_val.value);
        const maxVal = parseFloat(this.inp_max_val.value);
        const status = this.inp_status.value.trim();
        const value = this.inp_account.value.trim();

        // procura o option correspondente dentro do datalist
        const option = document.querySelector(`#accounts-list option[value="${value}"]`);

        if (option) {
            const accountId = option.dataset.id;
            this.filtros.account = accountId;
        }


        if (!isNaN(initialDate.getTime()) && !isNaN(finalDate.getTime())) {
            if (initialDate > finalDate) {
                alert("A data inicial não pode ser maior que a final");
            } else {
                this.filtros.initial_date = initialDate.toISOString();
                this.filtros.final_date = finalDate.toISOString();
            }
        } else if (!isNaN(initialDate.getTime())) {
            this.filtros.initial_date = initialDate.toISOString();
        } else if (!isNaN(finalDate.getTime())) {
            this.filtros.final_date = finalDate.toISOString();
        }

        if (!isNaN(minVal) && !isNaN(maxVal)) {
            if (minVal > maxVal) {
                alert("O valor mínimo não pode ser maior que o máximo");
            } else {
                this.filtros.min_val = minVal
                this.filtros.max_val = maxVal
            }
        } else if (!isNaN(minVal)) {
            this.filtros.min_val = minVal
        } else if (!isNaN(maxVal)) {
            this.filtros.max_val = maxVal
        }

        if (status === 'true' || status === "false") {
            this.filtros.status = status
        }
    }
}