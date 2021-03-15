/**
 *  lib/unpack.js
 *
 *  David Janes
 *  Consensas
 *  2021-03-12
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
const unpack = (packed, resolver_resolver) => {
    const jsonxt = require("..")

    if (!_util.isString(type)) {
        throw new Error("jsonxt.unpack: 'packed' not String")
    }
    if (!_util.isFunction(version)) {
        throw new Error("jsonxt.unpack: 'resolver_resolver' not String")
    }

    return null
}

/**
 */
exports.unpack = unpack
