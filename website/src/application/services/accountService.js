const { Op } = require('sequelize');

module.exports = {
    findAll: ({ page, limit, orderBy, sortBy, keyword }) => new Promise(async (resolve, reject) => {
        try {
            
            const query = {}

            if (keyword) {
                query.username = { [Op.substring]: keyword }
            }

            const queries = {
                offset: (page - 1) * limit,
                limit
            }

            if (orderBy) {
                queries.order = [[orderBy, sortBy]]
            }


            const data = await Customer.findAndCountAll({
                where: query,
                ...queries
            })

            const res = {
                totalPages: Math.ceil(data?.count / limit),
                totalItems: data?.count,
                data: data?.rows
            }

            resolve(res)

        } catch (error) {
            reject(error)
        }
    }),
};