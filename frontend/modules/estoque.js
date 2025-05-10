
export class Estoque {
    constructor() { }

    init() {
        this.events()
    }

    events() {
        this.buttonsActionsConfigure()
        this.searchConfigure()
    }

    buttonsActionsConfigure() {
        document.querySelectorAll('.btn-edit-estoque').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                window.location.href = `/produto/${id}`
            });
        });

        document.querySelectorAll('.btn-delete-estoque').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm("Deseja realmente excluir esse produto?")) {
                    window.location.href = `/produto/delete/${id}`
                }
            });
        });
    }

    searchConfigure() {
        const searchInput = document.getElementById('search-estoque');

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('table tbody tr');

                rows.forEach(row => {
                    const cols = row.querySelectorAll('td');
                    if (cols.length >= 2) {
                        const nome = cols[0].innerText.toLowerCase();
                        const codigo = cols[1].innerText.toLowerCase();

                        const match = nome.includes(searchTerm) || codigo.includes(searchTerm);

                        row.style.display = match ? '' : 'none';
                    }
                });
            });
        }
    }

}

