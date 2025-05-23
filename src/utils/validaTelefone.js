export function validarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/[^\d]+/g, ''); // Remove tudo que não for número

    // Valida se tem 11 dígitos (DDD + 9 dígitos do celular)
    const regex = /^\d{11}$/;
    return regex.test(telefoneLimpo);
}