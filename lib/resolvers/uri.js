/*
 *  lib/resolvers/uri.js
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

const _util = require("../_util")

const https = require("https")

/**
 */
const resolve = async (resolver_name, resolver_key) => {
    let url = `https://${resolver_name.replace(/[\/]*$/, "")}/${resolver_key}.jsonxt`
    if (resolver_name.match(/^[a-zA-Z][-a-zA-Z0-9+.]*:/)) {
        const url = `${resolver_name.replace(/[\/]*$/), ""}/${resolver_key}.jsonxt`
    }

    return new Promise((resolve, reject) => {
        const request = https.request(url, response => {
            if (response.statusCode !== 200) {
                return resolve(null)
            }

            let document = Buffer.alloc(0)

            response.on('data', chunk => {
                document = Buffer.concat([ document, chunk ])
            });

            response.on('end', () => {
                resolve(document.toString("utf8"))
            })
        })

        request.end()
    })
}

/**
 *  API
 */
exports.uri = resolve
