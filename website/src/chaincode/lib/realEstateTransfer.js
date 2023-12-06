'use strict';

const { Contract } = require('fabric-contract-api');
class RealEstateTransfer extends Contract {
    async initLedger(ctx) {
        // Create some sample users
        await this.createUser(ctx, 'user1', 1000000, 500*50);
        await this.createUser(ctx, 'user2', 50000, 6000*50);
        await this.createUser(ctx, 'user3', 2000, 8000*50);

        // Create some sample tokens
        await this.createToken(ctx, 'token1','property1',500,100);
        await this.createToken(ctx, 'token2', 'property2',6000,250);
        await this.createToken(ctx, 'token3', 'property3',8000,300);
        //
        // Assign tokens to users
        await this.createPropertyTokenOwner(ctx, 'owner1', 500, 'token1', 'user1');
        await this.createPropertyTokenOwner(ctx, 'owner2', 6000, 'token2', 'user2');
        await this.createPropertyTokenOwner(ctx, 'owner3', 8000, 'token3', 'user3');

        // Assign tokens to offers
        await this.createOffer(ctx, 'offer1', 'user1', 'token1', 50, 50, false);
        await this.createOffer(ctx, 'offer2', 'user3', 'token2', 40, 50, false);
        await this.createOffer(ctx, 'offer3', 'user1', 'token2', 40, 50, true);
        await this.createOffer(ctx, 'offer4', 'user2', 'token2', 40, 50, false);
    }

    async createUser(ctx, id, cash_balance, token_balance) {
        const user = {
            docType: "user",
            id,
            cash_balance,
            token_balance
        };
        await ctx.stub.putState(`user:${id}`, Buffer.from(JSON.stringify(user)));
    }

    async createPropertyTokenOwner(ctx, id, own_number, token_id, user_id) {
        const propertyTokenOwner = {
            docType: "propertyTokenOwner",
            id,
            own_number,
            token_id,
            user_id
        };
        await ctx.stub.putState(`propertyTokenOwner:${id}`, Buffer.from(JSON.stringify(propertyTokenOwner)));
    }

    async createToken(ctx, id, listing_property_id, quantity, money_daily_rent) {
        const token = {
            docType: "token",
            id,
            listing_property_id,
            quantity,
            money_daily_rent,
            token_price: 50
        };
        await ctx.stub.putState(`token:${id}`, Buffer.from(JSON.stringify(token)));
    }

    async createTokenTransaction(ctx, id, quantity, at_price, seller_id, buyer_id, token_id) {
        const tokenTransaction = {
            docType:"tokenTransaction",
            id,
            quantity,
            at_price,
            seller_id,
            buyer_id,
            transaction_date:Date.now().toString(),
            token_id
        };
        await ctx.stub.putState(`tokenTransaction:${id}`, Buffer.from(JSON.stringify(tokenTransaction)));
    }
    async createOffer(ctx, id, userID, tokenID, quantity, at_price, isBuy) {
        const offer = {
            docType:"offer",
            id,
            user_id: userID,
            token_id: tokenID,
            quantity,
            at_price,
            is_buy: isBuy,
            is_active: true,
            is_finished: false,
            offer_time: Date.now().toString(),
        };

        // Convert the offer to JSON and save to the ledger
        await ctx.stub.putState(`offer:${id}`, Buffer.from(JSON.stringify(offer)));
    }

    async getTokenizeProperty(ctx,user_id, listing_property_id, house_price){
        const tokenPriceInit = 50;
        // create new token
        const token = {
            docType: "token",
            id:await this.generateId("token"),
            listing_property_id,
            quantity:house_price/tokenPriceInit,
            token_price: tokenPriceInit
        };
        await ctx.stub.putState(`token:${token.id}`, Buffer.from(JSON.stringify(token)));

        // create new property
        const propertyTokenOwner = {
            docType: "propertyTokenOwner",
            id:await this.generateId("propertyTokenOwner"),
            own_number:token.quantity,
            token_id:token.id,
            user_id
        };
        await ctx.stub.putState(`propertyTokenOwner:${propertyTokenOwner.id}`, Buffer.from(JSON.stringify(propertyTokenOwner)));

        // update token balance user
        let user = await this.queryUser(ctx, user_id);
        user.token_balance += propertyTokenOwner.own_number * tokenPriceInit;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));
    }

    async getDepositByUserId(ctx,user_id,money){
        let user = await this.queryUser(ctx, user_id);
        user.cash_balance += money;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));
    }
    async getOwnPropertyTokenByUserId(ctx,user_id){
        const query = {
            docType:"propertyTokenOwner",
            user_id
        }
        let property = await this.getQueryResult(ctx,query);
        if (property.length === 0) {
            throw new Error(`No property token owner found for user ID ${userId}`);
        }
        for (let element of property) {
            let token = await this.queryToken(ctx,element.token_id);
            element.token_price = token.token_price;
        }
        return property;
    }
    async getWithDrawByUserId(ctx,user_id,money){
        let user = await this.queryUser(ctx, user_id);
        if(money>user.cash_balance){
            throw new Error(`User with ID ${user_id} does not have enough cash balance to withdraw ${money}`);
        }
        user.cash_balance -= money;
        await ctx.stub.putState(`user:${user.id}`, Buffer.from(JSON.stringify(user)));
    }

    async matchingOffers(ctx) {
        // Query all active buy offers
        let query = {
            docType:"offer",
            is_buy:true,
            is_active:true,
            is_finished:false
        }
        const buyOffers = await this.getQueryResult(ctx,query);

        // Convert the iterator to an array and sort by offer_time in descending order
        const sortedBuyOffersDesc = await buyOffers.sort((a, b) => {
            const offerA = JSON.parse(a.value.toString());
            const offerB = JSON.parse(b.value.toString());
            return offerB.offer_time - offerA.offer_time;
        });
        // Iterate through buy offers
        for await (let buyOffer of sortedBuyOffersDesc) {
            // Query matching active sell offers
            query = {
                docType:"offer",
                is_buy:false,
                is_active:true,
                is_finished:false,
                token_id:buyOffer.token_id,
                quantity:buyOffer.quantity
            }
            const sellOffers = await this.getQueryResult(ctx,query);
            // Iterate through sell offers
            for await (let sellOffer of sellOffers) {
                if (sellOffer.user_id!==buyOffer.user_id
                    && sellOffer.at_price<= buyOffer.at_price
                ) {
                    let transactionId = await this.generateId("trans_"+sellOffer.user_id+"_"+buyOffer.user_id);
                    try {
                        await this.transferToken(ctx, transactionId, buyOffer.user_id, sellOffer.user_id, sellOffer.token_id, sellOffer.quantity, sellOffer.at_price);
                        buyOffer.is_finished = true;
                        buyOffer.is_active = false;
                        sellOffer.is_finished = true;
                        sellOffer.is_active = false;
                        // Update the ledger with the modified buy and sell offers
                        await ctx.stub.putState(buyOffer.id, Buffer.from(JSON.stringify(buyOffer)));
                        await ctx.stub.putState(sellOffer.id, Buffer.from(JSON.stringify(sellOffer)));
                        console.log(`Token transfer successful for transaction ID: ${transactionId}`);
                        break;
                    } catch (error) {
                        console.error(`Error transferring tokens for transaction ID ${transactionId}: ${error.message}`);
                    }
                }
            }
        }
    }
    async transferToken(ctx, transactionId, buyerId, sellerId, tokenId, quantity,atPrice) {
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
        buyer.token_balance +=totalPrice;

        // Add token price to seller's cash balance
        seller.cash_balance += totalPrice;
        seller.token_balance -= totalPrice;
        // Update token ownership
        let sellerProperty = await this.findPropertyTokenOwnerByUserId(ctx,sellerId);
        sellerProperty.own_number -=quantity;
        await ctx.stub.putState(sellerProperty.id, Buffer.from(JSON.stringify(sellerProperty)));
        try {
            let buyerProperty = await this.findPropertyTokenOwnerByUserId(ctx,buyerId);
            buyerProperty.own_number +=quantity;
            await ctx.stub.putState(buyerProperty.id, Buffer.from(JSON.stringify(buyerProperty)));
        } catch (error) {
            const propertyId = await this.generateId("prop_"+buyerId)
            await ctx.stub.putState(`propertyTokenOwner:${propertyId}`, Buffer.from(JSON.stringify({
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
        await this.createTokenTransaction(ctx,transactionId,quantity,token.at_price,sellerId,buyerId,tokenId);
    }
    async generateId(key) {
        const currentDate = new Date();
        const dd = String(currentDate.getDate()).padStart(2, '0');
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = currentDate.getFullYear();
        const hh = String(currentDate.getHours()).padStart(2, '0');
        const min = String(currentDate.getMinutes()).padStart(2, '0');
        const ss = String(currentDate.getSeconds()).padStart(2, '0');

        return `${key}_${dd}_${mm}_${yyyy}_${hh}_${min}_${ss}`;
    }

    async queryUser(ctx, id) {
        const userAsBytes = await ctx.stub.getState(`user:${id}`);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`User with ID ${id} does not exist`);
        }
        return JSON.parse(userAsBytes.toString());
    }

    async findPropertyTokenOwnerByUserId(ctx, userId) {
        const query = {
                docType: 'propertyTokenOwner',
                user_id: userId,
        };
        const propertyTokenOwners = await this.getQueryResult(ctx,query);
        if (propertyTokenOwners.length === 0) {
            throw new Error(`No property token owner found for user ID ${userId}`);
        }
        return propertyTokenOwners;
    }


    async queryToken(ctx, id) {
        const tokenAsBytes = await ctx.stub.getState(`token:${id}`);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`Token with ID ${id} does not exist`);
        }
        return JSON.parse(tokenAsBytes.toString());
    }
    async getAllByEntity(ctx,entity) {
        const iterator = await ctx.stub.getStateByRange('','');
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
    async getQueryResult(ctx,query) {
        const allEntity = await this.getAllByEntity(ctx,query.docType);
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
}

module.exports = RealEstateTransfer;
