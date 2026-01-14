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

        this.showTotalValueAccountButton = document.querySelector("#showTotalValueAccount")
        this.showTotalValueAccountButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const response = this.getDataForModalTotlaAcount();

            if (response.success) {
                this.showModalTotalAccount(response.data);
                $('#totalValueAccount').modal('show');
            }
        });

        this.makeAsPaidButton = document.querySelector("#make-as-paid")
        this.makeAsPaidButton.addEventListener("click", async (e) => {
            e.preventDefault;
            await this.makeAsPaid()
        })

        this.markAsPendingButton = document.querySelector("#make-as-pending")
        this.markAsPendingButton.addEventListener("click", async (e) => {
            e.preventDefault;
            await this.markAsPending()
        })

        this.dueDateInput = document.querySelector("#due-date")
        this.penaltyIntput = document.querySelector("#penalty")
        this.typePenaltyInput = document.querySelector("#type-penalty")

        this.downloadPDFButton = document.querySelector("#generate-pdf")
        this.downloadPDFButton.addEventListener("click", async (e) => {
            e.preventDefault
            await this.downloadPDF()
        })
    }

    async saveFiltros(page = 1) {
        if (!this.valida()) {
            alert("Tem que ter dados validos para os dados poderem ser encontrados!")
            return
        }

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
                alert("Erro ao buscar relatórios filtrados")
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
        this.pagination.innerHTML = "";
        this.pagination.style.display = "flex";

        const start = Math.max(1, currentPage - 5);
        const end = Math.min(totalPages, currentPage + 5);

        const firstPage = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" data-page="1">&laquo;</a>
        </li>
    `;

        const prevPage = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" data-page="${currentPage - 1}"><</a>
        </li>
    `;

        let indexes = "";

        for (let i = start; i <= end; i++) {
            indexes += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            </li>
        `;
        }

        const nextPage = `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a href="#" class="page-link" data-page="${currentPage + 1}">></a>
        </li>
    `;

        const lastPage = `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a href="#" class="page-link" data-page="${totalPages}">&raquo;</a>
        </li>
    `;

        this.pagination.innerHTML += firstPage;
        this.pagination.innerHTML += prevPage;
        this.pagination.innerHTML += indexes;
        this.pagination.innerHTML += nextPage;
        this.pagination.innerHTML += lastPage;

        this.funcionalidadesPagination();
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

    getDataForModalTotlaAcount() {
        let data = {}

        if (!this.valid) {
            alert("Adicione um filtro para acessar a funcionalidade")
            return false
        }

        const validFilter = this.valida()

        if (!validFilter) {
            return false
        }

        if (!this.filtros.account) {
            alert("Adicione uma conta. Não pode ser usada em mais de uma conta simultaneamente.")
            return false
        }

        if (this.filtros.initial_date) {
            data.initial_date = this.filtros.initial_date
        }

        if (this.filtros.final_date) {
            data.final_date = this.filtros.final_date
        }

        if (this.filtros.status === "true" || this.filtros.status === "false") {
            data.status = this.filtros.status
        }


        return { success: true, data: data }
    }

    async getTotalValueAccount(filter) {
        try {
            const response = await fetch(`/envio-relatorios/getTotalValueAccount/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify({ filter: filter })
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar as contas filtrados");
            }

            const res = await response.json();

            return res
        } catch (err) {
            console.error(err);
        }
    }

    async showModalTotalAccount(data) {
        $('#totalValueAccount').off('show.bs.modal').on('show.bs.modal', async (event) => {
            const modal = $(event.target);

            modal.find("#account-name-modal").html("")
            modal.find("#users-modal").html("")
            modal.find("#value-modal").html("")
            modal.find(".dates").show();
            modal.find(".initial-date-div-modal").show();
            modal.find(".final-date-div-modal").show();
            modal.find("#initial-date-modal").text("00/00/0000");
            modal.find("#final-date-modal").text("00/00/0000");

            const day_initial = String(new Date(data.initial_date).getUTCDate()).padStart(2, '0');
            const month_initial = String(new Date(data.initial_date).getUTCMonth() + 1).padStart(2, '0');
            const year_initial = new Date(data.initial_date).getUTCFullYear();

            const formattedDate_initial = `${day_initial}/${month_initial}/${year_initial}`;

            const day_final = String(new Date(data.final_date).getUTCDate()).padStart(2, '0');
            const month_final = String(new Date(data.final_date).getUTCMonth() + 1).padStart(2, '0');
            const year_final = new Date(data.final_date).getUTCFullYear();

            const formattedDate_final = `${day_final}/${month_final}/${year_final}`;

            if (data.initial_date && data.final_date) {
                modal.find("#initial-date-modal").text(
                    formattedDate_initial
                );
                modal.find("#final-date-modal").text(
                    formattedDate_final
                );
            } else if (data.initial_date || data.final_date) {
                if (data.initial_date) {
                    modal.find("#initial-date-modal").text(
                        new Date(data.initial_date).toLocaleDateString("pt-BR")
                    );
                    modal.find(".final-date-div-modal").hide();
                } else {
                    modal.find("#final-date-modal").text(
                        new Date(data.final_date).toLocaleDateString("pt-BR")
                    );
                    modal.find(".initial-date-div-modal").hide();
                }
            } else {
                modal.find(".dates").hide();
            }


            if (!data.status) {
                modal.find("#status-show-accounts-modal").text("Pendentes/Pagas")
            } else if (data.status === "true") {
                modal.find("#status-show-accounts-modal").text("Pagas")
            } else {
                modal.find("#status-show-accounts-modal").text("Pendentes")
            }

            const res = await this.getTotalValueAccount(this.filtros);

            const account = res.data.account
            const total_value = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(res.data.total_value);

            modal.find("#account-name-modal").show().text(account.name);
            modal.find("#value-modal").show().text(total_value);

            let users = "";
            account.users.forEach((user) => {
                users += `
                    <div class="user">
                        <p>Nome: <span class="user-name">${user.name}</span></p>
                        <p>CPF: <span class="cpf-user">${user.cpf}</span></p>
                    </div>
                `
            })
            modal.find("#users-modal").html(users)
        })
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

        const penaltyValue = Number(this.penaltyIntput.value);

        try {
            const response = await fetch(`/envio-relatorios/sendEmail/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify({
                    filter: this.filtros,
                    dueDate: this.dueDateInput.value,
                    penalty: !isNaN(penaltyValue) && penaltyValue > 0
                        ? penaltyValue
                        : 0,
                    typePenalty: this.typePenaltyInput.value,
                })
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
                const day_initial = String(new Date(this.filtros.initial_date).getUTCDate()).padStart(2, '0');
                const month_initial = String(new Date(this.filtros.initial_date).getUTCMonth() + 1).padStart(2, '0');
                const year_initial = new Date(this.filtros.initial_date).getUTCFullYear();

                const formattedDate_initial = `${day_initial}/${month_initial}/${year_initial}`;

                date_initial_menssage = `
                    <div class="menssage-date-initial">
                        Compras feitas a partir de <span style="font-weight: bold;">${formattedDate_initial}</span>
                    </div>
                `;
            }

            let date_final_menssage = "";
            if (this.filtros.final_date) {
                const day_final = String(new Date(this.filtros.final_date).getUTCDate()).padStart(2, '0');
                const month_final = String(new Date(this.filtros.final_date).getUTCMonth() + 1).padStart(2, '0');
                const year_final = new Date(this.filtros.final_date).getUTCFullYear();

                const formattedDate_final = `${day_final}/${month_final}/${year_final}`;
                date_final_menssage = `
                    <div class="menssage-date-final">
                        Compras feitas até <span style="font-weight: bold;">${formattedDate_final}</span>
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

            modal.find("#btn-confirm").off("click").on("click", async () => {
                await callback();
                modal.modal("hide");
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
            console.error(e);
        }
    }


    async makeAsPaid() {
        if (!this.valid) {
            alert("Tem que ter dados validos para poder ser enviado!")
            return
        }

        if (!confirm("Você realmente deseja trocar as contas para Pagas?")) {
            return
        }

        try {
            const response = await fetch('/envio-relatorios/markAsPaid/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify({ filter: this.filtros })
            });
            const data = await response.json()


            if (!response.ok) {
                alert(data.error)
                throw new Error(data.error);
            }


            if (data.success) {
                alert(
                    `Venda(s) marcadas como pagas com sucesso! ${data.data.modified} registros alterados.`
                );
                await this.saveFiltros()
            }

        } catch (e) {
            console.error(e);
        }
    }

    async markAsPending() {
        if (!this.valid) {
            alert("Tem que ter dados validos para poder ser enviado!")
            return
        }

        if (!confirm("Você realmente deseja trocar as contas para Pendentes?")) {
            return
        }

        try {
            const response = await fetch('/envio-relatorios/markAsPending/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.token
                },
                body: JSON.stringify({ filter: this.filtros })
            });
            const data = await response.json()


            if (!response.ok) {
                alert(data.error)
                throw new Error(data.error);
            }


            if (data.success) {
                alert(
                    `Venda(s) marcadas como pendentes com sucesso! ${data.data.modified} registros alterados.`
                );
                await this.saveFiltros()
            }

        } catch (e) {
            console.error(e);
        }
    }

    async downloadPDF() {
        try {
            const response = await fetch('/envio-relatorios/pdf/', {
                method: 'GET',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao baixar PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio.pdf';
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (e) {
            console.error('Erro no download do PDF:', e);
            alert('Erro ao baixar o PDF');
        }
    }

}