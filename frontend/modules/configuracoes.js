export class Confugurações {
    constructor() { }

    init() {
        this.events();
    }

    events() {
        this.cpfStyle();
        this.telStyle();
        this.buttonsActionsConfigure();
    }

    cpfStyle() {
        const cpfInput = document.getElementById('cpf-configuracoes');

        if (cpfInput) {
            cpfInput.addEventListener('input', function () {
                let value = this.value.replace(/\D/g, ''); // Remove tudo que não for dígito

                if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                this.value = value;
            });
        }
    }

    telStyle() {
        const telInput = document.getElementById('tel-configuracoes');

        if (telInput) {
            telInput.addEventListener('input', function () {
                let value = this.value.replace(/\D/g, ''); // Remove tudo que não for dígito

                if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

                if (value.length >= 2) {
                    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // DDD
                }
                if (value.length >= 7) {
                    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2'); // Número
                }

                this.value = value;
            });
        }
    }

    buttonsActionsConfigure() {
        document.querySelectorAll('.btn-edit-conta').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                window.location.href = `/configuracoes/${id}`
            });
        });

        document.querySelectorAll('.btn-delete-conta').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm("Deseja realmente excluir essa conta?")) {
                    window.location.href = `/configuracoes/delete/${id}`
                }
            });
        });
    }

}