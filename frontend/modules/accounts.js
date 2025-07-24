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

        this.openEditModal()


        const self = this
        document.addEventListener("DOMContentLoaded", function () {
            const formEditAccount = document.getElementById("create-new-account-form");

            formEditAccount.addEventListener("submit", function (e) {
                e.preventDefault();
                self.submitFormModalAccount(); // usa a instância correta
            });

        });
    }

    cacheSelectors() {
        this.form_search_name = document.getElementById("search-form-name")
        this.inp_search_name = document.getElementById("search-input-name")

        this.form_search_number = document.getElementById("search-form-number")
        this.inp_search_number = document.getElementById("search-input-number")

        this.btn_status_active = document.querySelector(".btn-active")
        this.btn_status_inactive = document.querySelector(".btn-inactive")
        this.btn_status_all = document.querySelector(".btn-all")

        this.btn_edit = document.querySelector(".edit-count");

        this.inp_data_modal_account = document.querySelector("#data-modal-account")
        this.inp_selected_user_id = document.querySelector("#selected-user-id")
        this.inp_register_account_users = document.querySelector("#register-account-users")
        this.inp_register_account_name = document.querySelector("#register-account-name")
        this.inp_deleted_users = document.getElementById("data-modal-account-deleted");

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

        this.account_id = document.querySelector("#account-id")
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

    openEditModal() {
        document.addEventListener('DOMContentLoaded', () => {
            $('#registerAccount').on('show.bs.modal', (event) => {
                const button = $(event.relatedTarget);
                const modal = $(event.target);

                const userMap = new Map();

                const account = button.data("account");

                modal.find('#account-id').val(account._id);
                modal.find('#register-account-name').val(account.name);

                modal.find("#registerAccountLabel").text("Edit Conta");
                modal.find("#btn-create").text("Salvar Alterações");

                const formattedUsers = account.users.map(user => ({
                    id: user._id,
                    name: user.name
                }));
                modal.find('#data-modal-account').val(JSON.stringify(formattedUsers));

                this.attListUser(formattedUsers)


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

                            hiddenInput.value = "";
                            input.value = "";

                            datalist.innerHTML = "";
                            userMap.clear();

                            data.users.users.forEach(user => {
                                const label = `${user.name}`;
                                const option = document.createElement("option");
                                option.value = `${user.name}`;
                                option.label = `${user.cpf}`;
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

                // Remove da lista de usuários
                dadosArray = dadosArray.filter(user => user.id !== idToRemove);
                this.inp_data_modal_account.value = JSON.stringify(dadosArray);

                // Atualiza visual
                this.attListUser(dadosArray);

                // Lê input dos deletados
                let deletedArray = [];
                try {
                    deletedArray = this.inp_deleted_users.value ? JSON.parse(this.inp_deleted_users.value) : [];
                } catch (e) {
                    console.error("Erro ao ler dados JSON de deletados:", e);
                }

                // Adiciona à lista de deletados se não estiver já
                if (!deletedArray.includes(idToRemove)) {
                    deletedArray.push(idToRemove);
                    this.inp_deleted_users.value = JSON.stringify(deletedArray);
                }
            });

            this.list_users.appendChild(div);
        });

        // 👇 Após listar todos os usuários, limpa os que foram re-adicionados da lista de deletados
        let deletedArray = [];
        try {
            deletedArray = this.inp_deleted_users.value ? JSON.parse(this.inp_deleted_users.value) : [];
        } catch (e) {
            console.error("Erro ao ler dados JSON de deletados:", e);
        }

        const currentIds = list.map(user => user.id);

        // Remove da lista de deletados quem está na lista atual
        deletedArray = deletedArray.filter(deletedId => !currentIds.includes(deletedId));

        this.inp_deleted_users.value = JSON.stringify(deletedArray);
    }

    validaFormModalAccount() {
        let accounts = [];

        try {
            accounts = JSON.parse(this.inp_data_modal_account.value || "[]");
        } catch (e) {
            console.error("Erro ao fazer parse dos usuários:", e);
            alert("Erro ao processar os usuários. Tente novamente.");
            return false;
        }

        const users = accounts.map(user => user.id);

        const data = {
            name: this.inp_register_account_name.value.trim(),
            users
        };

        if (!data.name || typeof data.name !== "string") {
            alert("É obrigatório a conta ter um nome.");
            return false;
        }

        if (!Array.isArray(data.users) || data.users.length === 0) {
            alert("Para salvar as alterações uma conta, é necessário pelo menos um usuário.");
            return false;
        }

        return true;
    }

    submitFormModalAccount() {
        if (!this.validaFormModalAccount()) return;

        let usersRaw = [];
        let deletedUsersRaw = [];
        let deletedUsers = [];

        try {
            usersRaw = JSON.parse(this.inp_data_modal_account.value || "[]");
        } catch (e) {
            console.error("Erro ao fazer parse dos usuários:", e);
            alert("Erro ao processar os usuários. Tente novamente.");
            return false;
        }

        try {
            deletedUsersRaw = JSON.parse(this.inp_deleted_users.value || "[]");
            deletedUsers = deletedUsersRaw;
        } catch (e) {
            console.error("Erro ao fazer parse dos usuários deletados:", e);
            alert("Erro ao processar os usuários deletados. Tente novamente.");
            return false;
        }

        const data = {
            name: this.inp_register_account_name.value.trim(),
            users: usersRaw.map(user => ({ _id: user.id })),
            deletedUsers: deletedUsers
        };

        const token = document.querySelector('input[name="_csrf"]').value;
        const id_account = this.account_id.value;

        fetch(`/contas/edit/${id_account}`, {
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
                } else {
                    alert("Erro ao salvar as alterações.");
                    location.reload();
                }
            });
    }

}