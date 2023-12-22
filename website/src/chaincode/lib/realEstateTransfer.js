'use strict';

const { Contract } = require('fabric-contract-api');
class RealEstateTransfer extends Contract {
    async initLedger(ctx) {

        const iterations = Array.from({ length: 3 }, (_, i) => i + 1);

        await Promise.all(
            iterations.map(async (i) => {
                await this.createUser(ctx, `ACCOUNT_000${i}`, 500000, 0);
                // await this.createToken(ctx, `TOKEN_000${i}`, `LP_000${i}`, 500);
                // await this.createPropertyTokenOwner(ctx, `PTO_000${i}`, 500, `TOKEN_000${i}`, `ACCOUNT_000${i}`);
            })
        );
    }

    async createUser(ctx, id, cash_balance, token_balance) {
        const exists = await ctx.stub.getState(`user:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The user ${id} already exists`);
        }
        const user = {
            docType: "user",
            id,
            cash_balance,
            token_balance
        };
        await ctx.stub.putState(`user:${id}`, Buffer.from(JSON.stringify(user)));
        await this.createRentalIncomeWallet(ctx, id);
    }

    async createRentalIncomeWallet(ctx, user_id) {
        const exists = await ctx.stub.getState(`rentalIncomeWallet:${user_id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The rental income wallet ${user_id} already exists`);
        }
        const rentalIncomeWallet = {
            docType: "rentalIncomeWallet",
            user_id,
            total_current_balance: 0
        };
        await ctx.stub.putState(`rentalIncomeWallet:${user_id}`, Buffer.from(JSON.stringify(rentalIncomeWallet)));
    }

    async createRentalDailyIncomeTransaction(ctx, id, income_amount, is_withdrawn, rental_income_wallet_id, listing_property_id, transaction_date) {
        const exists = await ctx.stub.getState(`rentalDailyIncomeTransaction:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The rentalDailyIncomeTransaction ${id} already exists`);
        }
        const rentalDailyIncomeTransaction = {
            docType: "rentalDailyIncomeTransaction",
            id,
            income_amount,
            is_withdrawn,
            rental_income_wallet_id,
            listing_property_id,
            transaction_date
        };
        await ctx.stub.putState(`rentalDailyIncomeTransaction:${id}`, Buffer.from(JSON.stringify(rentalDailyIncomeTransaction)));
    }

    async createWithdrawIncome(ctx, id, withdraw_amount, withdraw_type_option, rental_income_wallet_id, withdraw_date) {
        const exists = await ctx.stub.getState(`withdrawIncome:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The WithdrawIncome ${id} already exists`);
        }
        const withdrawIncome = {
            docType: "withdrawIncome",
            id,
            withdraw_amount,
            withdraw_type_option,
            rental_income_wallet_id,
            withdraw_date
        };
        await ctx.stub.putState(`withdrawIncome:${id}`, Buffer.from(JSON.stringify(withdrawIncome)));
    }

    async createPropertyTokenOwner(ctx, id, own_number, token_id, user_id) {
        const exists = await ctx.stub.getState(`propertyTokenOwner:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The property Token Owner ${id} already exists`);
        }
        const propertyTokenOwner = {
            docType: "propertyTokenOwner",
            id,
            own_number,
            token_id,
            user_id
        };
        await ctx.stub.putState(`propertyTokenOwner:${id}`, Buffer.from(JSON.stringify(propertyTokenOwner)));
    }

    async createToken(ctx, id, listing_property_id, quantity) {
        let exists = await ctx.stub.getState(`token:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The Token ${id} already exists`);
        }
        exists = await this.getTokenByListingPropertyId(ctx, listing_property_id);
        if (exists && exists.length > 0) {
            throw new Error(`The Listing Property ${id} already exists`);
        }
        const token = {
            docType: "token",
            id,
            listing_property_id,
            quantity,
            token_price: 50
        };
        await ctx.stub.putState(`token:${id}`, Buffer.from(JSON.stringify(token)));
    }

    async createTokenTransaction(ctx, id, quantity, at_price, seller_id, buyer_id, token_id, transaction_date) {
        const exists = await ctx.stub.getState(`tokenTransaction:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The token Transaction ${id} already exists`);
        }
        const tokenTransaction = {
            docType: "tokenTransaction",
            id,
            quantity,
            at_price,
            seller_id,
            buyer_id,
            transaction_date,
            token_id
        };
        await ctx.stub.putState(`tokenTransaction:${id}`, Buffer.from(JSON.stringify(tokenTransaction)));
    }
    async createOffer(ctx, id, userID, tokenID, quantity, at_price, isBuy, offer_time) {
        const exists = await ctx.stub.getState(`offer:${id}`);
        if (exists && exists.length > 0) {
            throw new Error(`The offer ${id} already exists`);
        }
        const offer = {
            docType: "offer",
            id,
            user_id: userID,
            token_id: tokenID,
            quantity,
            at_price,
            is_buy: isBuy,
            is_active: true,
            is_finished: false,
            offer_time
        };

        // Convert the offer to JSON and save to the ledger
        await ctx.stub.putState(`offer:${id}`, Buffer.from(JSON.stringify(offer)));
    }
    async generateID(key, count) {
        let id;
        if (count > 9) {
            id = key + "_00" + count;
        }
        else if (count > 99 && count < 1000) {
            id = key + "_0" + count;
        }
        else if (count > 1000) {
            id = key + "_" + count;
        }
        else {
            id = key + "_000" + count;
        }
        return id;
    }
    async getTokenizeProperty(ctx, user_id, listing_property_id, house_price) {
        const tokenPriceInit = 50;
        const tokens = await this.getAllByEntity(ctx, "token");

        // create new token
        const token = {
            docType: "token",
            id: await this.generateID("TOKEN", tokens.length + 1),
            listing_property_id,
            quantity: house_price / tokenPriceInit,
            token_price: tokenPriceInit
        };
        await ctx.stub.putState(`token:${token.id}`, Buffer.from(JSON.stringify(token)));
        const tokenOwns = await this.getAllByEntity(ctx, "propertyTokenOwner");

        // create new property
        const propertyTokenOwner = {
            docType: "propertyTokenOwner",
            id: await this.generateID("PTO", tokenOwns.length),
            own_number: token.quantity,
            token_id: token.id,
            user_id
        };
        await ctx.stub.putState(`propertyTokenOwner:${propertyTokenOwner.id}`, Buffer.from(JSON.stringify(propertyTokenOwner)));

        // update token balance user
        let user = await this.queryUser(ctx, user_id);
        user.token_balance += propertyTokenOwner.own_number * tokenPriceInit;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));
    }
    async getOwnPropertyTokenByUserId(ctx, user_id) {
        const query = {
            docType: "propertyTokenOwner",
            user_id
        }
        let property = await this.getQueryResult(ctx, query);
        if (property.length === 0) {
            throw new Error(`No property token owner found for user ID ${user_id}`);
        }
        for (let element of property) {
            let token = await this.queryToken(ctx, element.token_id);
            let query = {
                docType: "rentalDailyIncomeTransaction",
                rental_income_wallet_id: user_id,
                listing_property_id: token.listing_property_id
            }
            let rentalDailyIncomeTransaction = await this.getQueryResult(ctx, query);
            let total_earned = rentalDailyIncomeTransaction.reduce((total, element) => {
                return total + element.income_amount;
            }, 0);
            let total_current_balance = rentalDailyIncomeTransaction.reduce((total, element) => {
                if (!element.is_withdrawn) {
                    return total + element.income_amount;
                }
                return total;
            }, 0);
            element.token_price = token.token_price;
            element.total_current_balance = total_current_balance;
            element.total_earned = total_earned;
            element.token_supply = token.quantity;
        }
        return property;
    }
    async getOwnPropertyTokenByTokenAndUserId(ctx, token_id, user_id) {
        const query = {
            docType: "propertyTokenOwner",
            token_id,
            user_id
        }
        let property = await this.getQueryResult(ctx, query);
        if (property.length === 0) {
            throw new Error(`No property token owner ID ${token_id} found for user ID ${user_id}`);
        }
        for (let element of property) {
            let token = await this.queryToken(ctx, element.token_id);
            element.token_price = token.token_price;
        }
        return property;
    }

    async getTokenByListingPropertyId(ctx, listing_property_id) {
        const query = {
            docType: "token",
            listing_property_id
        }
        let token = await this.getQueryResult(ctx, query);
        return token[0];
    }

    async getDepositByUserId(ctx, user_id, money) {
        let user = await this.queryUser(ctx, user_id);
        user.cash_balance += money;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));
    }
    async getWithDrawByUserId(ctx, user_id, money) {
        let user = await this.queryUser(ctx, user_id);
        if (money > user.cash_balance) {
            throw new Error(`User with ID ${user_id} does not have enough cash balance to withdraw ${money}`);
        }
        user.cash_balance -= money;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));
    }
    async getWithDrawRentalIncome(ctx, user_id, withdraw_date) {
        let user = await this.queryUser(ctx, user_id);
        let query = {
            docType: "rentalDailyIncomeTransaction",
            rental_income_wallet_id: user_id

        }
        let rentalDailyIncomeTransaction = await this.getQueryResult(ctx, query);
        let total_current_balance = rentalDailyIncomeTransaction.reduce((total, element) => {
            if (!element.is_withdrawn) {
                return total + element.income_amount;
            }
            return total;
        }, 0);
        user.cash_balance += total_current_balance;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));

        // update status rentalDailyIncomeTransaction
        for (let element of rentalDailyIncomeTransaction) {
            element.is_withdrawn = true;
            await ctx.stub.putState(`rentalDailyIncomeTransaction:${element.id}`, Buffer.from(JSON.stringify(element)));
        }
        // create withdraw income
        let withdrawIncome = {
            docType: "withdrawIncome",
            id: "WITHDRAW_RI_" + user_id + "_" + withdraw_date,
            withdraw_amount: total_current_balance,
            withdraw_type_option: "CASH",
            rental_income_wallet_id: user_id,
            withdraw_date
        }

        const rentalIncomeWallet = {
            docType: "rentalIncomeWallet",
            id: user_id,
            total_current_balance: 0            
        };

        await ctx.stub.putState(`rentalIncomeWaller:${rentalIncomeWallet.id}`, Buffer.from(JSON.stringify(rentalIncomeWallet)));

        await ctx.stub.putState(`withdrawIncome:${withdrawIncome.id}`, Buffer.from(JSON.stringify(withdrawIncome)));
        console.log(`Withdraw rental income for user ID: ${user_id} successful`);
    }

    async getPaymentRentDaily(ctx, listing_property_id, monthly_rent, transaction_date) {
        const daily_rent = monthly_rent / 30.0;
        // query find token by listing_property_id
        let query = {
            docType: "token",
            listing_property_id
        }
        const tokens = await this.getQueryResult(ctx, query);
        if (tokens.length === 0) {
            throw new Error(`Token with listing_property_id ${listing_property_id} not found `);
        }
        const token = tokens[0];
        // query find all propertyTokenOwner by token_id
        query = {
            docType: "propertyTokenOwner",
            token_id: token.id
        }
        const propertyTokenOwner = await this.getQueryResult(ctx, query);
        // payment rent daily
        for (const property of propertyTokenOwner) {
            // create transaction
            let transactionId = "TRANSACTION_RDIT" + property.user_id + "_" + property.id + "_" + transaction_date;
            let rentalDailyIncomeTransaction = {
                docType: "rentalDailyIncomeTransaction",
                id: transactionId,
                income_amount: (daily_rent * property.own_number) / token.quantity,
                is_withdrawn: false,
                rental_income_wallet_id: property.user_id,
                listing_property_id,
                transaction_date
            };
            await ctx.stub.putState(`rentalDailyIncomeTransaction:${rentalDailyIncomeTransaction.id}`, Buffer.from(JSON.stringify(rentalDailyIncomeTransaction)));

            // update rental income wallet
            let rentalIncomeWallet = await this.queryRentalIncomeWallet(ctx, property.user_id)
            rentalIncomeWallet.total_current_balance = parseFloat(rentalIncomeWallet.total_current_balance) +
                ((daily_rent * property.own_number) / token.quantity);
            rentalIncomeWallet.total_current_balance = rentalIncomeWallet.total_current_balance.toFixed(2);
            await ctx.stub.putState(`rentalIncomeWallet:${rentalIncomeWallet.user_id}`, Buffer.from(JSON.stringify(rentalIncomeWallet)));
        }
        console.log(`Payment daily rent for list property have ID: ${listing_property_id} successful`)
    }

    async matchingOffers(ctx, transaction_date) {
        // Query all active buy offers
        let query = {
            docType: "offer",
            is_buy: "true",
            is_active: true,
            is_finished: false
        }
        const buyOffers = await this.getQueryResult(ctx, query);

        // Convert the iterator to an array and sort by offer_time in descending order
        const sortedBuyOffersDesc = await buyOffers.sort((offerA, offerB) => {
            return offerB.offer_time - offerA.offer_time;
        });
        // Iterate through buy offers
        for await (let buyOffer of sortedBuyOffersDesc) {
            // Query matching active sell offers
            query = {
                docType: "offer",
                is_buy: "false",
                is_active: true,
                is_finished: false,
                token_id: buyOffer.token_id,
                quantity: buyOffer.quantity
            }
            const sellOffers = await this.getQueryResult(ctx, query);
            // Iterate through sell offers
            for await (let sellOffer of sellOffers) {
                if (sellOffer.user_id !== buyOffer.user_id
                    && buyOffer.at_price >= sellOffer.at_price
                ) {

                    let transactionId = "TRANSACTION_" + sellOffer.user_id + "_" + buyOffer.user_id + "_" + transaction_date;
                    try {
                        await this.transferToken(ctx, transactionId, buyOffer.user_id, sellOffer.user_id, sellOffer.token_id, sellOffer.quantity, sellOffer.at_price, transaction_date);
                        buyOffer.is_finished = true;
                        buyOffer.is_active = false;
                        sellOffer.is_finished = true;
                        sellOffer.is_active = false;
                        // Update the ledger with the modified buy and sell offers
                        await ctx.stub.putState(`offer:${buyOffer.id}`, Buffer.from(JSON.stringify(buyOffer)));
                        await ctx.stub.putState(`offer:${sellOffer.id}`, Buffer.from(JSON.stringify(sellOffer)));
                        console.log(`Token transfer successful for transaction ID: ${transactionId}`);
                        break;
                    } catch (error) {
                        console.error(`Error transferring tokens for transaction ID ${transactionId}: ${error.message}`);
                    }
                }
            }
        }
    }

    async transferToken(ctx, transactionId, buyerId, sellerId, tokenId, quantity, atPrice, transaction_date) {
        // Get information about the token and buyer/seller
        const token = await this.queryToken(ctx, tokenId);
        let buyer = await this.queryUser(ctx, buyerId);
        let seller = await this.queryUser(ctx, sellerId);

        const totalPrice = token.token_price * atPrice
        // Check if the buyer has enough cash balance
        if (buyer.cash_balance < totalPrice) {
            throw new Error(`Buyer with ID ${buyerId} does not have enough cash balance to buy the token`);
        }

        // Deduct token price from buyer's cash balance
        buyer.cash_balance -= totalPrice;
        buyer.token_balance += totalPrice;

        // Add token price to seller's cash balance
        seller.cash_balance += totalPrice;
        seller.token_balance -= totalPrice;
        // Update token ownership
        let query = {
            docType: 'propertyTokenOwner',
            user_id: sellerId,
            token_id: tokenId
        };
        const sellerProperties = await this.getQueryResult(ctx, query);
        let sellerProperty = sellerProperties[0]
        sellerProperty.own_number -= quantity;
        await ctx.stub.putState(`propertyTokenOwner:${sellerProperty.id}`, Buffer.from(JSON.stringify(sellerProperty)));
        query = {
            docType: 'propertyTokenOwner',
            user_id: buyerId,
            token_id: tokenId
        };
        const buyerProperties = await this.getQueryResult(ctx, query);
        if (buyerProperties.length !== 0) {
            let buyerProperty = buyerProperties[0];
            buyerProperty.own_number += quantity;
            await ctx.stub.putState(`propertyTokenOwner:${buyerProperty.id}`, Buffer.from(JSON.stringify(buyerProperty)));
        }
        else {
            const props = await this.getAllByEntity(ctx, "propertyTokenOwner");
            const propertyId = await this.generateID("PTO", props.length);
            await ctx.stub.putState(`propertyTokenOwner:${propertyId}`, Buffer.from(JSON.stringify({
                docType: 'propertyTokenOwner',
                id: propertyId,
                own_number: quantity,
                token_id: tokenId,
                user_id: buyerId,
            })));
        }

        // Update buyer and seller information
        await ctx.stub.putState(`user:${buyerId}`, Buffer.from(JSON.stringify(buyer)));
        await ctx.stub.putState(`user:${sellerId}`, Buffer.from(JSON.stringify(seller)));

        // Record the token transaction
        await this.createTokenTransaction(ctx, transactionId, quantity, token.at_price, sellerId, buyerId, tokenId, transaction_date);
    }

    async queryUser(ctx, id) {
        const userAsBytes = await ctx.stub.getState(`user:${id}`);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`User with ID ${id} does not exist`);
        }
        return JSON.parse(userAsBytes.toString());
    }
    async queryRentalIncomeWallet(ctx, user_id) {
        const userAsBytes = await ctx.stub.getState(`rentalIncomeWallet:${user_id}`);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`User with ID ${user_id} does not exist`);
        }
        return JSON.parse(userAsBytes.toString());
    }


    async queryToken(ctx, id) {
        const tokenAsBytes = await ctx.stub.getState(`token:${id}`);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`Token with ID ${id} does not exist`);
        }
        return JSON.parse(tokenAsBytes.toString());
    }

    async queryOffer(ctx, id) {
        const userAsBytes = await ctx.stub.getState(`offer:${id}`);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`Offer with ID ${id} does not exist`);
        }
        return JSON.parse(userAsBytes.toString());
    }

    async getAllByEntity(ctx, entity) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allEntity = [];

        let result = await iterator.next();
        while (!result.done) {
            const res = result.value;
            const obj = JSON.parse(res.value.toString('utf8'));

            if (obj.docType === entity) {
                allEntity.push(obj);
            }
            result = await iterator.next();
        }
        return allEntity;
    }

    async getQueryResult(ctx, query) {
        const allEntity = await this.getAllByEntity(ctx, query.docType);
        return allEntity.filter(obj => {
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    if (obj[key] !== query[key]) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    async getQueryResultV2(ctx, queryString) {
        const query = JSON.parse(queryString);
        const allEntity = await this.getAllByEntity(ctx, query.docType);
        return allEntity.filter(obj => {
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    if (obj[key] !== query[key]) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    async deleteOffer(ctx, offer_id) {
        let offer = await this.queryOffer(ctx, offer_id);
        offer.is_active = false;
        await ctx.stub.putState(`offer:${offer_id}`, Buffer.from(JSON.stringify(offer)));        
    }
}

module.exports = RealEstateTransfer;
