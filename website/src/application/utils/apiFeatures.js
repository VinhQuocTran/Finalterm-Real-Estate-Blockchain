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
                // Convert filtering keys to Sequelize operators
                const attr = key.match(/\b(gte|gt|lte|lt)\b/) ? `$${key}` : key;
                where[attr] = queryObj[key];
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