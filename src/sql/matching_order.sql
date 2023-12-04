SELECT
    buy.OfferID as buy_offer_id,
    buy.token_id as buy_token_id,
    buy.quantity as buy_quantity,
    buy.price as buy_price,
    buy.is_active as buy_is_active,
    buy.is_finished as buy_is_finished,
    sell.OfferID as sell_offer_id,
    sell.token_id as sell_token_id,
    sell.quantity as sell_quantity,
    sell.price as sell_price,
    sell.is_active as sell_is_active,
    sell.is_finished as sell_is_finished,
    MIN(sell.offer_time) as earliest_sell_time
FROM Offer buy
JOIN (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY token_id, quantity, price ORDER BY offer_time) as row_num
    FROM Offer
    WHERE is_active = TRUE
      AND is_finished = FALSE
      AND OfferType = 'sell' -- Add this condition to select only sell offers
) sell
ON buy.token_id = sell.token_id
   AND buy.quantity = sell.quantity
   AND buy.price <= sell.price
   AND sell.price <= buy.price
   AND buy.is_active = TRUE
   AND buy.is_finished = FALSE
   AND sell.is_active = TRUE
   AND sell.is_finished = FALSE
   AND buy.row_num = sell.row_num
WHERE buy.OfferType = 'buy' -- Add this condition to select only buy offers
GROUP BY buy.OfferID, buy.token_id, buy.quantity, buy.price, buy.is_active, buy.is_finished, sell.OfferID, sell.token_id, sell.quantity, sell.price, sell.is_active, sell.is_finished
HAVING MIN(sell.OfferID) IS NOT NULL; -- Exclude rows with no matching sell order
