export class FazerVenda {
    constructor() {
        this.listaItens = [];
        this.valor_total = 0;
        this.total_itens = 0
    }

    init() {
        this.cacheSelectors();
        this.events();
        this.handleSubmit()
    }

    cacheSelectors() {
        this.inputCliente = document.getElementById('cliente-fazer-venda');
        this.inputClienteId = document.getElementById('cliente-id');

        this.inputProduto = document.getElementById('itens-fazer-venda');
        this.btnAdd = document.getElementById('add-item');
        this.tabelaItens = document.getElementById('lista-itens-venda');
        this.inputHidden = document.getElementById('itens-venda-hidden');
        this.produtos = document.querySelectorAll('#lista-produtos option');

        this.enviar_back_dados = document.getElementById('enviar-back');

    }

    events() {
        this.getIdConta();
        this.setupTable();
    }

    getIdConta() {
        const verificarCliente = () => {
            const valorDigitado = this.inputCliente.value.trim();
            const options = document.querySelectorAll('#lista-contas option');
            let encontrado = false;

            options.forEach(option => {
                if (option.value === valorDigitado) {
                    this.inputClienteId.value = option.getAttribute('data-id');
                    encontrado = true;
                }
            });

            if (!encontrado) {
                this.inputClienteId.value = '';
            }
        };

        this.inputCliente.addEventListener('blur', verificarCliente);
    }

    setupTable() {
        this.btnAdd.addEventListener('click', () => {
            const nome_produto = this.inputProduto.value;
            const option = Array.from(this.produtos).find(opt => opt.value === nome_produto);

            if (!option) {
                alert('Selecione um produto válido!');
                return;
            }

            const produto_id = option.getAttribute('data-id');
            const preco_unitario = parseFloat(option.getAttribute('data-valor_venda')) / 100;

            const existente = this.listaItens.find(item => item.produto_id === produto_id);
            if (existente) {
                existente.quantidade += 1;
                existente.subtotal = existente.quantidade * existente.preco_unitario;
            } else {
                this.listaItens.push({
                    produto_id,
                    nome_produto,
                    preco_unitario,
                    quantidade: 1,
                    subtotal: preco_unitario * 1
                });
            }

            this.inputProduto.value = '';
            this.renderTabela();
        });
    }

    renderTabela() {
        this.tabelaItens.innerHTML = '';
        this.listaItens.forEach((item, index) => {
            const row = document.createElement('tr');
            const colNome = `<td class="nome-item">${item.nome_produto}</td>`;
            const colQtd = `
                <td>
                    Qtd:
                    <input type="number" min="1" value="${item.quantidade}" 
                           data-index="${index}" class="input-qtd">
                </td>`;
            const colAcoes = `
                <td>
                    <button type="button" class="btn-remove circle-plus" data-index="${index}">
                        <i class="fas fa-x"></i>
                    </button>
                </td>`;
            const colPreco = `<td>R$ ${(item.subtotal).toFixed(2)}</td>`;

            row.innerHTML = colNome + colQtd + colPreco + colAcoes;
            this.tabelaItens.appendChild(row);
        });

        this.inputHidden.value = JSON.stringify(this.listaItens);

        this.addTableEvents();
        this.renderInformacoes();
    }

    addTableEvents() {
        const inputsQtd = this.tabelaItens.querySelectorAll('.input-qtd');
        const btnsRemove = this.tabelaItens.querySelectorAll('.btn-remove');

        inputsQtd.forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.getAttribute('data-index');
                this.alterarQuantidade(index, e.target.value);
            });
        });

        btnsRemove.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                this.removerItem(index);
            });
        });
    }

    alterarQuantidade(index, quantidade) {
        const item = this.listaItens[index];
        item.quantidade = parseInt(quantidade);
        item.subtotal = item.quantidade * item.preco_unitario;
        this.renderTabela();
    }


    removerItem(index) {
        this.listaItens.splice(index, 1);
        this.renderTabela();
    }

    alterarValorTotal() {
        this.valor_total = 0;
        this.listaItens.forEach(item => {
            this.valor_total += item.subtotal;
        });
    }

    alterarQuantidadeTotalItens() {
        this.total_itens = 0;
        this.listaItens.forEach(item => {
            this.total_itens += item.quantidade;
        });
    }

    getStatusVenda() {
        const status = document.querySelector('input[name="status-fazer-venda"]:checked').value;
        return status === 'true';
    }

    getObservacoesVenda() {
        const observacoes = document.querySelector('#observacoes-fazer-venda').value;
        return observacoes;
    }

    enviarBack() {
        const dados = {
            account_id: this.inputClienteId.value,
            valor_total: this.valor_total,
            status: this.getStatusVenda(),
            observacoes: this.getObservacoesVenda(),
            itens: this.listaItens
        };

        this.enviar_back_dados.value = JSON.stringify(dados);

        // Se quiser também, pode manter no localStorage para testes
        localStorage.setItem('teste', this.enviar_back_dados.value);
    }


    renderInformacoes() {
        this.alterarQuantidadeTotalItens();
        const total_itens_span = document.querySelector('#total-itens-venda');
        total_itens_span.textContent = this.total_itens;

        this.alterarValorTotal();
        const valor_total_span = document.querySelectorAll('.valor-total-venda');
        valor_total_span.forEach(element => {
            element.textContent = this.valor_total.toFixed(2);
        });

        this.enviarBack();
    }

    handleSubmit() {
        const form = document.querySelector('#form-fazer-venda');
        form.addEventListener('submit', (e) => {
            if (!this.inputClienteId.value) {
                e.preventDefault();
                alert('Selecione um cliente!');
                return;
            }

            if (this.listaItens.length === 0) {
                e.preventDefault();
                alert('Adicione ao menos um item na venda!');
                return;
            }

            this.enviarBack();
        });
    }


}
