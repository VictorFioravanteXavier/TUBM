const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    create_date: { type: Date, default: Date.now }
})

const RoleModule = mongoose.model('Role', RoleSchema);

class Role {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.role = null;
    }

    async create() {
        this.valida()
        if (this.errors.length > 0) return;

        try {
            this.role = await RoleModule.create({ name: this.body.name });
        } catch (e) {
            this.errors.push('Erro ao criar role: ' + e.message);
        }
    }

    static async findOne(obj) {
        if (typeof obj !== 'object' || obj === null) return null;

        const query = {};

        if (obj.id) {
            if (!mongoose.Types.ObjectId.isValid(obj.id)) return null;
            query._id = obj.id;
        }

        if (obj.name) {
            query.name = obj.name;
        }

        if (Object.keys(query).length === 0) return null;

        const role = await RoleModule.findOne(query);
        return role;
    }

    static async findAll() {
        const roles = await RoleModule.find().sort({ create_date: -1 });
        return roles;
    }

    valida() {
        if (!this.body.name || typeof this.body.name !== 'string') {
            this.errors.push("A Role precisa ter um nome válido.");
        }
    }
}

module.exports = Role