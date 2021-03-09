/**
 *  lib/urn.json.js
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
const json = compressed => {
    if (!_util.isString(compressed["@xt"])) {
        return null
    }

    const d = Object.assign({
        "@xt": "",
    }, compressed)

    let s = JSON.stringify(d)
    s = s.substring(1, s.length - 1)
    s = s.replace(/^"@xt":"https:/, "")

    return "jxt:" + _util.encode(s)
}

/**
 */
exports.urn = {
    json: json,
}
