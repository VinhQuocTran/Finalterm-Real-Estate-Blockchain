const { Op } = require('sequelize');

class APIFeatures {
    constructor(model, queryString) {
        this.model = model;
        this.queryString = queryString;
        this.queryOptions = {};
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let where = {};
        for (let key in queryObj) {
            if (queryObj.hasOwnProperty(key)) {
                const customOperatorKeys = ['gte', 'gt', 'lte', 'lt'];

                if (customOperatorKeys.some(operator => queryObj[key][operator] !== undefined)) {
                    // If any custom operators are present, create conditions object
                    const conditionObject = {};
                    for (const customOperatorKey of customOperatorKeys) {
                        if (queryObj[key][customOperatorKey] !== undefined) {
                            conditionObject[Op[customOperatorKey]] = queryObj[key][customOperatorKey];
                        }
                    }

                    where[key] = conditionObject;
                } else if (queryObj[key].includes(',')) {
                    // If the value contains a comma, treat it as a list of values
                    const values = queryObj[key].split(',').map(val => val.trim());
                    where[key] = {
                        [Op.in]: values,
                    };
                } else {
                    // If no custom operators and no comma, default to Op.eq
                    where[key] = {
                        [Op.eq]: queryObj[key],
                    };
                }

                console.log('key:', key);
                console.log('conditions:', where[key]);
            }
        }

        this.queryOptions.where = where;
        return this;
    }


    sort() {
        if (this.queryString.sort) {
            const order = this.queryString.sort.split(',').map(field => {
                let [key, value] = field.split(':');
                value = value || 'ASC';
                return [key, value.toUpperCase()];
            });
            this.queryOptions.order = order;
        } else {
            this.queryOptions.order = [['createdAt', 'DESC']];
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const attributes = this.queryString.fields.split(',');
            this.queryOptions.attributes = attributes;
        } else {
            this.queryOptions.attributes = { exclude: ['__v'] };
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const offset = (page - 1) * limit;

        this.queryOptions.offset = offset;
        this.queryOptions.limit = limit;
        return this;
    }

    async execute() {
        return await this.model.findAll(this.queryOptions);
    }
}

module.exports = APIFeatures;