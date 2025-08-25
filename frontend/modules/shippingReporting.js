export class ShippingReporting {
    constructor() {
        this.filtros = {};
        this.valid = false
        this.errors = []
    }

    init() {
        this.events();
    }

    events() {
        this.cacheSelectors();
        this.confirmSend();
    }

    cacheSelectors() {
        const self = this

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

        this.confirmSendButton = document.querySelector("#btn-confirm")
        this.sendEmailButton = document.querySelector(".sendEmail")
        this.sendEmailButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.confirmSend(async () => await self.sendEmail());
        });

        this.sendWhatsapplButton = document.querySelector(".sendWhatsapp")
        this.sendWhatsapplButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.confirmSend(async () => await self.sendWhatsapp());
        });

        this.removeButtonNumberWhatsapp = document.querySelector(".removeNumber")
        this.removeButtonNumberWhatsapp.addEventListener("click", async (e) => {
            e.preventDefault()
            await this.removeNumberWhatsapp()
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
                this.valid = true
            } else {
                this.valid = false
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
                return false
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
                return false
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

        return true
    }

    async sendEmail() {
        if (!this.valid) {
            alert("Tem que ter dados validos para poder ser enviado!")
            return
        }

        try {
            const response = await fetch(`/envio-relatorios/sendEmail/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify(this.filtros)
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar relatórios filtrados");
            } else {
                alert("Email(s) enviado(s) com sucesso!")
            }


        } catch (error) {
            console.error(error);
        }
    }

    confirmSend(callback) {
        const self = this;
        $('#confirmSend').off('show.bs.modal').on('show.bs.modal', (event) => {
            const modal = $(event.target);
            modal.find(".variables-vals").html("")

            let account_menssage = "";
            if (!this.filtros.account) {
                account_menssage = "Todas as contas de usuários";
            } else {
                account_menssage = `a conta ${this.inp_account.value}`;
            }

            let status_menssage = "";
            if (this.filtros.status === "true") {
                status_menssage = "Pagas";
            } else if (this.filtros.status === "false") {
                status_menssage = "Pendentes";
            } else {
                status_menssage = "Pagas e Pendentes";
            }

            let date_initial_menssage = "";
            if (this.filtros.initial_date) {
                date_initial_menssage = `
                <div class="menssage-date-initial">
                    Compras feitas a partir de <span style="font-weight: bold;">${new Date(this.filtros.initial_date).toLocaleDateString("pt-BR")}</span>
                </div>
            `;
            }

            let date_final_menssage = "";
            if (this.filtros.final_date) {
                date_final_menssage = `
                <div class="menssage-date-final">
                    Compras feitas até <span style="font-weight: bold;">${new Date(this.filtros.final_date).toLocaleDateString("pt-BR")}</span>
                </div>
            `;
            }

            let min_val_menssage = "";
            if (this.filtros.min_val) {
                min_val_menssage = `
                <div class="menssage-min-val">
                    Compras com valor mínimo de <span style="font-weight: bold;">${parseFloat(this.filtros.min_val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            `;
            }

            let max_val_menssage = "";
            if (this.filtros.max_val) {
                max_val_menssage = `
                <div class="menssage-max-val">
                    Compras com valor máximo de <span style="font-weight: bold;">${parseFloat(this.filtros.max_val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            `;
            }

            modal.find(".menssage-account").html(`
            Você irá enviar para <span style="font-weight: bold;">${account_menssage}</span>
        `);

            modal.find(".menssage-status").html(`
            Você irá enviar as contas <span style="font-weight: bold;">${status_menssage}</span>
        `);

            modal.find(".variables-vals").html(`
            ${date_initial_menssage}
            ${date_final_menssage}
            ${min_val_menssage}
            ${max_val_menssage}
        `);

            // Usando jQuery para tratar o clique
            modal.find("#btn-confirm").off("click").on("click", async () => {
                await callback(); // só aqui realmente chama o sendEmail
                modal.modal("hide"); // fecha depois se quiser
            });
        });
    }

    openQrCodeModal(qrDataUrl) {
        // Atualiza a imagem do QR Code com o mais recente
        const qrImg = document.getElementById('qrCodeImage');
        qrImg.src = qrDataUrl;

        // Abre o modal
        $('#qrCodeModal').modal('show');
    }

    async sendWhatsapp() {
        if (!this.valid) {
            alert("Tem que ter dados validos para poder ser enviado!")
            return
        }

        try {
            const res = await fetch('/envio-relatorios/sendWhats/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify(this.filtros)
            });
            const data = await res.json();

            if (data.qr) {
                this.openQrCodeModal(data.qr); // envia o QR base64 para o modal
            } else if (data.error) {
                alert("⚠️ Cliente ainda não está pronto. Tente enviar novamente em alguns segundos.")
            } else {
                alert(data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async removeNumberWhatsapp() {
        if (confirm("Você realmete deseja deletar o número salvo para enviar as contas por Whatsapp?")) {
            try {
                const res = await fetch('/envio-relatorios/removeNumber/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();

                if (data.error) {
                    console.error(data.error);
                } else {
                    alert(data.message);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}