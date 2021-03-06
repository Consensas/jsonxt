/**
 *  lib/decompress.js
 *
 *  David Janes
 *  Consensas
 *  2021-03-09
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

const _util = require("./_util")

/**
 */
const decompress = async (compressed, fetcher) => {
    const jsonxt = require("..")

    let template = {}
    const xt = compressed["@xt"]
    if (_util.isString(xt)) {
        template = await fetcher(xt)
    }

    let base = template[""] ?? {}

    _util.mapValues(compressed, (cvalue, ckey) => {
        const t = template[ckey]
        if (ckey == "@xt") {
        } else if (_util.isUndefined(t)) {
            base[ckey] = cvalue
        } else if (_util.isPlainObject(t)) {
            Object.assign(base, t)
        } else if (_util.isString(t)) {
            _util.set(base, t, cvalue)
        } else {
            throw new Error()
        }
    })

    return base // compressed
}

/**
 */
exports.decompress = decompress
