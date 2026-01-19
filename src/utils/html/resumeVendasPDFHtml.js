const formatDate = require("../formatDate");

module.exports = (data) => {

    const created_in = new Date();

    const created_in_formated = formatDate(created_in, true)

    let total_value = 0;
    let total_contas = new Set();
    const total_vendas = data.vendas.length
    let list_elements = ""

    data.vendas.forEach((venda) => {
        total_value += venda.valor_total / 100

        total_contas.add(venda.account_id._id)


        list_elements += `
            <tr>
                <td>${venda.cod_venda}</td>
                <td>${venda.account_id.name}</td>
                <td>${venda.status ? formatDate(venda.date_pay, false) : "-"}</td>
                <td class="${venda.status ? "status-paid" : "status-pending"}">${venda.status ? "Paga" : "Pendente"}</td>
                <td>${formatDate(venda.data_venda, false)}</td>
                <td>${(venda.valor_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
        `
    })

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <meta charset="UTF-8">
        <title>Relatório de Vendas</title>
        <style>
            * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
            }

            body {
            color: #333;
            }

            /* ===== HEADER ===== */
            header {
            border-bottom: 3px solid #B82627;
            padding-bottom: 15px;
            margin-bottom: 25px;
            }

            .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            }

            .brand {
            font-size: 26px;
            font-weight: bold;
            color: #B82627;
            }

            .date {
            font-size: 14px;
            color: #555;
            }

            .header-info {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 15px;
            background: #f8f8f8;
            padding: 12px;
            border-left: 5px solid #B82627;
            }

            .info-box {
            font-size: 14px;
            }

            .info-box strong {
            color: #B82627;
            }

            /* ===== TABLES ===== */
            table {
            width: 100%;
            border-collapse: collapse;
            margin-botton: 30px;
            }

            thead {
            background-color: #B82627;
            color: #fff;
            }

            th, td {
            padding: 10px;
            border: 1px solid #ddd;
            font-size: 13px;
            text-align: left;
            }

            tbody tr:nth-child(even) {
            background-color: #f9f9f9;
            }

            .status-paid {
            color: green;
            font-weight: bold;
            }

            .status-pending {
            color: #B82627;
            font-weight: bold;
            }

            /* ===== SECTION TITLES ===== */
            .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #B82627;
            }

            /* ===== FOOTER ===== */
            footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            }
        </style>
        </head>
        <body>
            <!-- ===== HEADER ===== -->
            <header>
                    <div class="header-top">
                        <div class="brand">Sistema TUBM</div>
                            <div class="date">
                                <strong>Criado em:</strong> 
                                ${created_in_formated}
                            </div>
                        </div>

                        <div class="header-info">
                            <div class="info-box">
                                <strong>Valor Total da Conta:</strong><br>
                                ${total_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            <div class="info-box">
                                <strong>Total de Vendas:</strong><br>
                                ${total_vendas}
                            </div>
                            <div class="info-box">
                                <strong>Total de Contas no Escopo:</strong><br>
                                ${total_contas.size}
                            </div>
                            ${data.initial_date ?
            `
                                <div class="info-box">
                                    <strong>Data Inicial:</strong><br>
                                    ${formatDate(data.initial_date, false)}
                                </div>
                                ` : ""
        }

                            ${data.final_date ?
            `
                                <div class="info-box">
                                    <strong>Data Final:</strong><br>
                                    ${formatDate(data.final_date, false)}
                                </div>
                                ` : ""
        }
                            
                        </div>
                    </div>
                </header>

                <!-- ===== TABELA DE VENDAS ===== -->
                <div class="section-title">Resumo das Vendas</div>
                <table>
                    <thead>
                    <tr>
                        <th>Cód. Venda</th>
                        <th>Conta</th>
                        <th>Data do Pagamento</th>
                        <th>Status</th>
                        <th>Data de Criação</th>
                        <th>Valor da Venda</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${list_elements}
                    </tbody>
                </table>

                <!-- ===== FOOTER ===== -->
                <footer>
                    Relatório gerado automaticamente • Sistema TUBM
                </footer>

        </body>
    </html>

    `

    return html
}