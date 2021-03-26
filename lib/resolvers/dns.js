/*
 *  lib/resolvers/dns.js
 *
 *  David Janes
 *  Consenas
 *  2021-03-25
 *
 *  Copyright (2013-2021) Consensas
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const dns = require("dns")
const _util = require("../_util")

/**
 *  DNS results look like [ [ "value" ] ]
 */
const resolve = async (resolver_name, resolver_key) => {
    const host = `${resolver_key}._jsonxt.${resolver_name}`

    try {
        const response = await dns.promises.resolveTxt(host)
        if (response.length && response[0].length) {
            return response[0][0]
        }
    } catch (x) {
        if (x.code !== 'ENOTFOUND') {
            throw x
        }
    }

    return null
}

/**
 *  API
 */
exports.dns = resolve
