import { validarCPF } from "../../src/utils/validaCpf"
import { validarTelefone } from "../../src/utils/validaTelefone"

export class UsersScreen {
    constructor() {

    }

    init() {
        this.events()
    }

    events() {
        this.cacheSelectors();
        this.buttonsStatsEvents();
        this.buttonsStatsEventsActivated();
        this.buttonsRoleEvents();
        this.buttonsRoleEventsActivated();
        this.searchUserName();
        this.openEditUserModal();
        this.openRegisterAccountModal();
        this.deleteUserButton();

        // Salva a instância atual da classe
        const self = this;

        document.addEventListener("DOMContentLoaded", function () {
            const formEditUser = document.getElementById("edit-user-form");

            formEditUser.addEventListener("submit", function (e) {
                e.preventDefault();
                self.submtitEditForm(); // usa a instância correta
            });

            const formCreateAccount = document.getElementById("create-new-account-form");

            formCreateAccount.addEventListener("submit", function (e) {
                e.preventDefault();
                self.submitFormModalAccount(); // usa a instância correta
            });

        });
    }


    cacheSelectors() {
        this.btn_status_active = document.querySelector(".btn-active");
        this.btn_status_no_count = document.querySelector(".btn-no-count");
        this.btn_status_all = document.querySelector(".btn-all");

        this.btn_role_financeiro = document.querySelector(".btn-role-financeiro");
        this.btn_role_venda = document.querySelector(".btn-role-venda");
        this.btn_role_user = document.querySelector(".btn-role-user");
        this.btn_role_todos = document.querySelector(".btn-role-todos");

        this.form_modal = document.querySelector("#edit-user-form");

        this.delete_user_buttons = document.querySelectorAll(".delet-count")

        this.inp_data_modal_account = document.querySelector("#data-modal-account")
        this.inp_selected_user_id = document.querySelector("#selected-user-id")
        this.inp_register_account_users = document.querySelector("#register-account-users")
        this.inp_register_account_name = document.querySelector("#register-account-name")

        this.list_users = document.querySelector(".users-selcted")

        this.btn_add_user_to_list = document.querySelector("#add-user-account")
        this.btn_add_user_to_list.addEventListener("click", e => {
            e.preventDefault();

            const name = this.inp_register_account_users.value;
            const id = this.inp_selected_user_id.value;

            if (!name || !id) {
                alert("Selecione um usuário válido da lista.");
                return;
            }

            this.addUserToList(name, id);
        });

    }

    buttonsStatsEvents() {
        this.btn_status_active.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "ativo");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_status_no_count.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("status", "sem-conta");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_status_all.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("status");
            window.location.href = `/usuarios/?${params.toString()}`;
        });
    }

    buttonsStatsEventsActivated() {
        const params = new URLSearchParams(window.location.search);
        switch (params.get("status")) {
            case "ativo":
                this.btn_status_active.classList.add("selected");
                break;

            case "sem-conta":
                this.btn_status_no_count.classList.add("selected");
                break;

            default:
                this.btn_status_all.classList.add("selected");
                break;
        }
    }


    buttonsRoleEvents() {

        this.btn_role_financeiro.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("cargo", "financeiro");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_role_venda.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("cargo", "venda");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_role_user.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.set("cargo", "user");
            window.location.href = `/usuarios/?${params.toString()}`;
        });

        this.btn_role_todos.addEventListener("click", (e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            params.delete("cargo"); // remove apenas o status, mantém os outros (como cargo)
            window.location.href = `/usuarios/?${params.toString()}`;
        });
    }


    buttonsRoleEventsActivated() {
        const params = new URLSearchParams(window.location.search);
        switch (params.get("cargo")) {
            case "financeiro":
                this.btn_role_financeiro.classList.add("selected");
                break;

            case "venda":
                this.btn_role_venda.classList.add("selected");
                break;

            case "user":
                this.btn_role_user.classList.add("selected");
                break;

            default:
                this.btn_role_todos.classList.add("selected");
                break;
        }
    }

    searchUserName() {
        document.getElementById("search-form").addEventListener("submit", function (e) {
            e.preventDefault(); // sempre previne o envio padrão

            const input = document.getElementById("search-input");
            const value = input.value.trim();

            // Pega os parâmetros atuais da URL para preservar filtros
            const params = new URLSearchParams(window.location.search);

            if (!value) {
                // Se vazio, remove o parâmetro "search" da URL e redireciona
                params.delete("search");
                window.location.href = `/usuarios/?${params.toString()}`;
                return;
            }

            // Se tem valor, seta o parâmetro search e redireciona
            params.set("search", value);
            window.location.href = `/usuarios/?${params.toString()}`;
        });
    }

    openEditUserModal() {
        document.addEventListener('DOMContentLoaded', function () {
            $('#editUserModal').on('show.bs.modal', function (event) {
                const button = $(event.relatedTarget); // Botão que acionou o modal
                const modal = $(this);

                // Pegando os dados do botão
                const id = button.data('id');
                const name = button.data('name');
                const cpf = button.data('cpf');
                const tel = button.data('tel');
                const role = button.data('role');

                // Preenchendo os campos do modal
                modal.find('#edit-user-id').val(id);
                modal.find('#edit-user-name').val(name);
                modal.find('#edit-user-cpf').val(cpf);
                modal.find('#edit-user-tel').val(tel);
                modal.find("#edit-user-role").val(role);
            });
        });
    }


    validaFormEdit() {
        const inp_name = this.form_modal.querySelector("#edit-user-name").value;
        const inp_cpf = this.form_modal.querySelector("#edit-user-cpf").value;
        const inp_tel = this.form_modal.querySelector("#edit-user-tel").value;
        const sel_role = this.form_modal.querySelector("#edit-user-role").value;

        if (typeof inp_name !== "string" || inp_name.trim() === "") {
            alert("Coloque um nome válido!");
            return false;
        }

        if (!validarCPF(inp_cpf)) {
            alert("Coloque um CPF válido!");
            return false;
        }

        if (!validarTelefone(inp_tel)) {
            alert("Coloque um telefone válido!");
            return false;
        }

        if (!["financeiro", "venda", "user"].includes(sel_role)) {
            alert("Selecione um cargo válido!");
            return false;
        }

        return true;
    }


    submtitEditForm() {
        if (!this.validaFormEdit()) {
            return; // Se o formulário não for válido, não envia nada
        }

        const id = this.form_modal.querySelector("#edit-user-id").value;
        const nome = this.form_modal.querySelector("#edit-user-name").value;
        const cpf = this.form_modal.querySelector("#edit-user-cpf").value;
        const tel = this.form_modal.querySelector("#edit-user-tel").value;
        const role = this.form_modal.querySelector("#edit-user-role").value;

        const dados = {
            id,
            nome,
            cpf,
            telefone: tel,
            role
        };

        const token = document.querySelector('input[name="_csrf"]').value;

        fetch(`/usuarios/${id}/editar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": token // <- CSRF enviado no header
            },
            body: JSON.stringify({
                id,
                name: nome,
                cpf: cpf,
                tel: tel,
                role: role
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
    }

    deleteUserButton() {
        this.delete_user_buttons.forEach(delete_user_button => {
            delete_user_button.addEventListener('click', (e) => {
                const button = e.target;

                const name = button.dataset.name;
                const id = button.dataset.id;

                if (confirm(`Você realmente deseja deletar o(a) usuário(a) ${name}?`)) {
                    fetch(`/usuarios/delete/${id}`, {
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

    openRegisterAccountModal() {
        document.addEventListener('DOMContentLoaded', () => {
            $('#registerAccount').on('show.bs.modal', (event) => {
                const button = $(event.relatedTarget);

                const userMap = new Map();

                const id = button.data('id');
                const name = button.data('name');

                document.querySelector("#data-modal-account").value = ""

                document.querySelector("#data-modal-account").value = JSON.stringify([{ id, name }]);
                this.attListUser([{ id, name }])
                fetch(`/usuarios/api/getAll`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.users.users)) {
                            const datalist = document.getElementById('users-list');
                            const input = document.getElementById('register-account-users');

                            const hiddenInput = document.getElementById('selected-user-id');

                            hiddenInput.value = ""
                            input.value = ""

                            datalist.innerHTML = "";
                            userMap.clear();

                            data.users.users.forEach(user => {
                                const label = `${user.name}`
                                const option = document.createElement("option");
                                option.value = `${user.name}`;
                                option.label = `${user.cpf}`
                                datalist.appendChild(option);

                                userMap.set(label, user._id);
                            });

                            input.addEventListener("input", () => {
                                const selected = input.value;
                                const id = userMap.get(selected);
                                hiddenInput.value = id || "";
                            });
                        } else {
                            alert("Erro ao buscar os usuários cadastrados.");
                        }
                    })
                    .catch(err => {
                        console.error("Erro na requisição:", err);
                    });
            });
        });
    }

    addUserToList(name, id) {
        let dados = this.inp_data_modal_account.value;

        let dadosArray = [];

        try {
            dadosArray = dados ? JSON.parse(dados) : [];
        } catch (e) {
            console.error("Erro ao ler dados JSON:", e);
            dadosArray = [];
        }

        this.inp_register_account_users.value = ""

        if (dadosArray.some(u => u.id === id)) {
            alert("Usuário já adicionado.");
            return;
        }

        dadosArray.push({ id, name });
        this.inp_data_modal_account.value = JSON.stringify(dadosArray);
        this.attListUser(dadosArray);
    }

    attListUser(list) {
        this.list_users.innerHTML = "";

        list.forEach(e => {
            const div = document.createElement("div");
            div.classList.add("user");
            div.textContent = e.name;
            div.dataset.id = e.id;

            div.addEventListener("click", () => {
                const idToRemove = div.dataset.id;

                let dados = this.inp_data_modal_account.value;
                let dadosArray = [];

                try {
                    dadosArray = dados ? JSON.parse(dados) : [];
                } catch (e) {
                    console.error("Erro ao ler dados JSON:", e);
                }

                dadosArray = dadosArray.filter(user => user.id !== idToRemove);

                this.inp_data_modal_account.value = JSON.stringify(dadosArray);

                this.attListUser(dadosArray);
            });

            this.list_users.appendChild(div);
        });
    }


    validaFormModalAccount() {

        let users = [];

        try {
            users = JSON.parse(this.inp_data_modal_account.value || "[]");
        } catch (e) {
            console.error("Erro ao fazer parse dos usuários:", e);
            alert("Erro ao processar os usuários. Tente novamente.");
            return false;
        }

        const data = {
            name: this.inp_register_account_name.value,
            users
        }

        if (!data.name || typeof data.name !== "string") {
            alert("É obrigatório a conta ter um nome.");
            return false;
        }

        if (!Array.isArray(data.users) || data.users.length === 0) {
            alert("Para adicionar uma conta, é necessário pelo menos um usuário.");
            return false;
        }

        return true;
    }



    submitFormModalAccount() {
        if (!this.validaFormModalAccount()) return;

        let usersRaw = [];
        let users = []; // ✅ Corrigido aqui
        try {
            usersRaw = JSON.parse(this.inp_data_modal_account.value || "[]");
            users = usersRaw.map(user => user.id); // ✅ Agora pode atribuir
        } catch (e) {
            console.error("Erro ao fazer parse dos usuários:", e);
            alert("Erro ao processar os usuários. Tente novamente.");
            return false;
        }

        const data = {
            name: this.inp_register_account_name.value,
            users
        };

        const token = document.querySelector('input[name="_csrf"]').value;

        fetch(`/contas/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": token
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
    }


}