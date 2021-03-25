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
 */
const resolve = async resolver_name => {
    const response = await dns.promises.resolveTxt(resolver_name)
    console.log(response)
}

// resolve("default._domainkey.davidjanes.com").catch(error => console.log("error", error))

/**
 *  API
 */
exports.dns = resolve
