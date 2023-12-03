/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const  realEstateTransfer= require('./lib/realEstateTransfer');

module.exports.RealEstateTransfer = realEstateTransfer;
module.exports.contracts = [realEstateTransfer];
