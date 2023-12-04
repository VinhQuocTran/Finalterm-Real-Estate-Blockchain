'use strict';

const { Contract } = require('fabric-contract-api');
class RealEstateTransfer extends Contract {

    async initLedger(ctx) {
        // Create some sample users
        await this.createUser(ctx, 'user1', 1000, 500*50);
        await this.createUser(ctx, 'user2', 500, 6000*50);
        await this.createUser(ctx, 'user3', 2000, 8000*50);

        // Create some sample tokens
        await this.createToken(ctx, 'token1','property1',500, 50);
        await this.createToken(ctx, 'token2', 'property2',6000, 50);
        await this.createToken(ctx, 'token3', 'property3',8000, 50);

        // Assign tokens to users
        await this.createPropertyTokenOwner(ctx, 'owner1', 500, 'token1', 'user1');
        await this.createPropertyTokenOwner(ctx, 'owner2', 6000, 'token2', 'user2');
        await this.createPropertyTokenOwner(ctx, 'owner3', 8000, 'token3', 'user3');
        await this.createBuyerRequest(ctx, 'request1', 'user1', 50,49,'token2');
        await this.createSellerRequest(ctx, 'request2', 'user2', 50,49,'token2');
        // await this.createTokenTransaction(ctx, 'transaction1', 1000, 'user2', 'user1', '2023-01-01', 'token2');
    }

    async createUser(ctx, id, cash_balance, token_balance) {
        const user = {
            id,
            cash_balance,
            token_balance
        };
        await ctx.stub.putState(`user:${id}`, Buffer.from(JSON.stringify(user)));
    }

    async createPropertyTokenOwner(ctx, id, own_number, token_id, user_id) {
        const propertyTokenOwner = {
            id,
            own_number,
            token_id,
            user_id
        };
        await ctx.stub.putState(`propertyTokenOwner:${id}`, Buffer.from(JSON.stringify(propertyTokenOwner)));
    }

    async createToken(ctx, id, listing_property_id, quantity, token_price) {
        const token = {
            id,
            listing_property_id,
            quantity,
            token_price
        };
        await ctx.stub.putState(`token:${id}`, Buffer.from(JSON.stringify(token)));
    }

    async createTokenTransaction(ctx, id, at_price, seller_id, buyer_id, transaction_date, token_id) {
        const tokenTransaction = {
            id,
            at_price,
            seller_id,
            buyer_id,
            transaction_date,
            token_id
        };
        await ctx.stub.putState(`tokenTransaction:${id}`, Buffer.from(JSON.stringify(tokenTransaction)));
    }
    async createBuyerRequest(ctx, requestId, userId,quantity,at_price, tokenId) {
        const buyerRequest = {
            id: requestId,
            buyer_id: userId,
            token_id: tokenId,
            quantity: quantity,
            at_price: at_price,
            status: 'pending',  // You can use 'pending', 'approved', 'rejected', etc.
        };
        await ctx.stub.putState(`buyerRequest:${requestId}`, Buffer.from(JSON.stringify(buyerRequest)));
    }

    async createSellerRequest(ctx, requestId, userId, quantity, at_price, tokenId) {
        const sellerRequest = {
            id: requestId,
            seller_id: userId,
            token_id: tokenId,
            quantity: quantity,
            at_price: at_price,
            status: 'pending',  // You can use 'pending', 'approved', 'rejected', etc.
        };
        await ctx.stub.putState(`sellerRequest:${requestId}`, Buffer.from(JSON.stringify(sellerRequest)));
    }
    async findMatchingSeller(ctx, buyerRequestId) {
        // Query buyer request
        const buyerRequest = await this.queryBuyerRequest(ctx, buyerRequestId);

        // Query seller requests that match the buyer request
        const sellerRequestIterator = await ctx.stub.getStateByPartialCompositeKey('sellerRequest', ['pending']);
        let sellerRequest = await sellerRequestIterator.next();

        while (!sellerRequest.done) {
            const sellerRequestId = sellerRequest.value.key.split(':')[1];

            // Check if the seller request matches the buyer request
            const sellerRequestObj = await this.querySellerRequest(ctx, sellerRequestId);
            if (
                sellerRequestObj.status === 'pending' &&
                sellerRequestObj.token_id === buyerRequest.token_id &&
                sellerRequestObj.buyer_id === buyerRequest.buyer_id &&
                sellerRequestObj.quantity === buyerRequest.quantity &&
                sellerRequestObj.at_price === buyerRequest.at_price
            ) {
                return sellerRequestId;
            }

            // Move to the next seller request
            sellerRequest = await sellerRequestIterator.next();
        }

        return null;  // No matching seller request found
    }

    async processRequestsLoop(ctx) {
        let hasValidRequests = true;

        while (hasValidRequests) {
            const buyerRequestIterator = await ctx.stub.getStateByPartialCompositeKey('buyerRequest', ['pending']);

            if (!buyerRequestIterator || !buyerRequestIterator.hasOwnProperty('next')) {
                // Handle the case where the iterator is not valid
                break;
            }

            let buyerRequest = await buyerRequestIterator.next();

            hasValidRequests = false;

            while (buyerRequest && !buyerRequest.done) {
                const buyerRequestId = buyerRequest.value.key.split(':')[1];
                const sellerRequestId = await this.findMatchingSeller(ctx, buyerRequestId);

                if (sellerRequestId) {
                    // Process the valid requests
                    await this.processRequests(ctx, buyerRequestId, sellerRequestId);
                    hasValidRequests = true;
                }

                // Move to the next buyer request
                buyerRequest = await buyerRequestIterator.next();
            }
        }
    }

    async processRequests(ctx, buyerRequestId, sellerRequestId) {
        const buyerRequest = await this.queryBuyerRequest(ctx, buyerRequestId);
        const sellerRequest = await this.querySellerRequest(ctx, sellerRequestId);

        // Check if both buyer and seller requests are valid
        if (buyerRequest.status === 'pending' && sellerRequest.status === 'pending' &&
            buyerRequest.token_id === sellerRequest.token_id) {

            // Mark requests as approved
            buyerRequest.status = 'approved';
            sellerRequest.status = 'approved';

            // Transfer the token
            await this.transferToken(ctx,"transaction1",buyerRequest.id, buyerRequest.buyer_id, sellerRequest.seller_id, buyerRequest.token_id);

            // Update the request status
            await ctx.stub.putState(`buyerRequest:${buyerRequestId}`, Buffer.from(JSON.stringify(buyerRequest)));
            await ctx.stub.putState(`sellerRequest:${sellerRequestId}`, Buffer.from(JSON.stringify(sellerRequest)));

        } else {
            // Mark requests as rejected if not valid
            buyerRequest.status = 'rejected';
            sellerRequest.status = 'rejected';

            // Update the request status
            await ctx.stub.putState(`buyerRequest:${buyerRequestId}`, Buffer.from(JSON.stringify(buyerRequest)));
            await ctx.stub.putState(`sellerRequest:${sellerRequestId}`, Buffer.from(JSON.stringify(sellerRequest)));

            throw new Error('Invalid buyer or seller request');
        }
    }

    async queryUser(ctx, id) {
        const userAsBytes = await ctx.stub.getState(`user:${id}`);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`User with ID ${id} does not exist`);
        }
        return JSON.parse(userAsBytes.toString());
    }

    async queryPropertyTokenOwner(ctx, id) {
        const propertyTokenOwnerAsBytes = await ctx.stub.getState(`propertyTokenOwner:${id}`);
        if (!propertyTokenOwnerAsBytes || propertyTokenOwnerAsBytes.length === 0) {
            throw new Error(`Property Token Owner with ID ${id} does not exist`);
        }
        return JSON.parse(propertyTokenOwnerAsBytes.toString());
    }

    async queryToken(ctx, id) {
        const tokenAsBytes = await ctx.stub.getState(`token:${id}`);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`Token with ID ${id} does not exist`);
        }
        return JSON.parse(tokenAsBytes.toString());
    }

    async queryTokenTransaction(ctx, id) {
        const tokenTransactionAsBytes = await ctx.stub.getState(`tokenTransaction:${id}`);
        if (!tokenTransactionAsBytes || tokenTransactionAsBytes.length === 0) {
            throw new Error(`Token Transaction with ID ${id} does not exist`);
        }
        return JSON.parse(tokenTransactionAsBytes.toString());
    }
    async transferToken(ctx, transactionId, buyerId, sellerId, tokenId) {
        // Get information about the token and buyer/seller
        const token = await this.queryToken(ctx, tokenId);
        const buyer = await this.queryUser(ctx, buyerId);
        const seller = await this.queryUser(ctx, sellerId);

        // Check if the buyer has enough cash balance
        if (buyer.cash_balance < token.token_price) {
            throw new Error(`Buyer with ID ${buyerId} does not have enough cash balance to buy the token`);
        }

        // Deduct token price from buyer's cash balance
        buyer.cash_balance -= token.token_price;

        // Add token price to seller's cash balance
        seller.cash_balance += token.token_price;

        // Update token ownership
        await ctx.stub.putState(`propertyTokenOwner:${transactionId}`, Buffer.from(JSON.stringify({
            id: transactionId,
            own_number: seller.token_balance + 1,  // Assuming token_balance is the count of tokens owned by the user
            token_id: tokenId,
            user_id: buyerId,
        })));

        // Update buyer and seller information
        await ctx.stub.putState(`user:${buyerId}`, Buffer.from(JSON.stringify(buyer)));
        await ctx.stub.putState(`user:${sellerId}`, Buffer.from(JSON.stringify(seller)));

        // Record the token transaction
        await this.createTokenTransaction(ctx, transactionId, token.token_price, sellerId, buyerId, new Date().toISOString(), tokenId);
    }
    async queryBuyerRequest(ctx, id) {
        const buyerRequestAsBytes = await ctx.stub.getState(`buyerRequest:${id}`);
        if (!buyerRequestAsBytes || buyerRequestAsBytes.length === 0) {
            throw new Error(`Buyer Request with ID ${id} does not exist`);
        }
        return JSON.parse(buyerRequestAsBytes.toString());
    }

    async querySellerRequest(ctx, id) {
        const sellerRequestAsBytes = await ctx.stub.getState(`sellerRequest:${id}`);
        if (!sellerRequestAsBytes || sellerRequestAsBytes.length === 0) {
            throw new Error(`Seller Request with ID ${id} does not exist`);
        }
        return JSON.parse(sellerRequestAsBytes.toString());
    }
}

module.exports = RealEstateTransfer;
