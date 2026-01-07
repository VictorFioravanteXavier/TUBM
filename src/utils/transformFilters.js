const mongoose = require('mongoose');

module.exports = (filter = {}) => {
    const valid_filters = { delete: false };


    const initialDate = filter.initial_date ? new Date(filter.initial_date) : null;
    const finalDate = filter.final_date ? new Date(filter.final_date) : null;

    const isValidInitial = initialDate instanceof Date && !isNaN(initialDate);
    const isValidFinal = finalDate instanceof Date && !isNaN(finalDate);

    if (isValidInitial || isValidFinal) {
        if (isValidInitial && isValidFinal && initialDate > finalDate) {
            return {
                success: false,
                error: "Data inicial maior que a data final."
            };
        }

        valid_filters.data_venda = {};

        if (isValidInitial) {
            valid_filters.data_venda.$gte = initialDate;
        }

        if (isValidFinal) {
            const end = new Date(finalDate);
            end.setHours(23, 59, 59, 999); // fim do dia
            valid_filters.data_venda.$lte = end;
        }
    }

    const min = Number(filter.min_val);
    const max = Number(filter.max_val);

    if (!isNaN(min) || !isNaN(max)) {
        valid_filters.valor_total = {};

        if (!isNaN(min)) {
            valid_filters.valor_total.$gte = min * 100;
        }

        if (!isNaN(max)) {
            valid_filters.valor_total.$lte = max * 100;
        }

        if (!isNaN(min) && !isNaN(max) && min > max) {
            return {
                success: false,
                error: "Valor mínimo maior que o valor máximo."
            };
        }
    }

    if (filter.status === "true" || filter.status === "false") {
        valid_filters.status = filter.status === "true";
    }

    if (mongoose.isValidObjectId(filter.account)) {
        valid_filters.account_id = filter.account;
    }

    return {
        success: true,
        data: valid_filters
    };
};
