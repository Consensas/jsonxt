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

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/**
 *  
 */
const unpack_payload = (payload, template) => {
    const jsonxt = require("..")

    const minors = payload.split("/").map(s => _util.decode(s))
    const unpacked = template[""] ?? {}

    for (let li = 0; li < letters.length && li < minors.length; li++) {
        const packed_value = minors[li]
        const rule = template[letters[li]]

        const decoder = jsonxt.decoders[rule.type]
        if (!decoder) {
            throw new Error(`unknown decoding: ${rule.type}`)
        }

        const unpacked_value = decoder(rule, packed_value)
        if (_util.isUndefined(unpacked_value)) {
            continue
        }

        _util.set(unpacked, rule.path, unpacked_value)
    }

    return unpacked
}

/**
 */
const unpack = async (packed, resolver_resolver) => {
    const jsonxt = require("..")

    if (!_util.isString(packed)) {
        throw new Error("jsonxt.unpack: 'packed' not String")
    }
    if (!_util.isFunction(resolver_resolver)) {
        throw new Error("jsonxt.unpack: 'resolver_resolver' not String")
    }

    const majors = packed.split(":")

    if (majors.length !== 5) {
        throw new Error(`jsonxt.unpack: expected 5 parts`)
    }

    const schema = _util.decode(majors[0].toLowerCase())
    const resolver = _util.decode(majors[1].toLowerCase())
    const type = _util.decode(majors[2].toLowerCase())
    const version = _util.decode(majors[3].toLowerCase())

    if (schema !== "jxt") {
        throw new Error(`jsonxt.unpack: unknown schema "${schema}"`)
    }

    const templates = await resolver_resolver(resolver)
    if (!_util.isPlainObject(templates)) {
        throw new Error("jsonxt.unpack: 'templates' not Plain Object")
    }

    const type_version = `${type}:${version}`

    const template = templates[type_version]
    if (!_util.isPlainObject(template)) {
        throw new Error(`jsonxt.unpack: 'templates["${type}:${version}"]' not String`)
    }

    return unpack_payload(majors[4], template)
}

/**
 */
exports.unpack = unpack
exports.unpack.payload = unpack_payload
