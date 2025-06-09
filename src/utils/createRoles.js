const Role = require('../models/RoleModel');

async function createRoles() {
    const roles = ['user', 'financeiro', 'venda'];

    for (let roleName of roles) {
        const exists = await Role.findOne({ name: roleName });
        const role = new Role({ name: roleName })

        if (!exists) {
            await role.create({ name: roleName });
        }
    }
}

module.exports = createRoles()