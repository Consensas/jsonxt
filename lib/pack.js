/**
 *  lib/pack.js
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
 */
const pack = (original, templates, type, version, resolver) => {
    const jsonxt = require("..")

    if (!_util.isPlainObject(original)) {
        throw new Error("jsonxt.pack: 'original' not Plain Object")
    }
    if (!_util.isPlainObject(templates)) {
        throw new Error("jsonxt.pack: 'templates' not Plain Object")
    }
    if (!_util.isString(type)) {
        throw new Error("jsonxt.pack: 'type' not String")
    }
    if (!_util.isString(version)) {
        throw new Error("jsonxt.pack: 'version' not String")
    }
    if (!_util.isString(resolver)) {
        throw new Error("jsonxt.pack: 'version' not String")
    }

    const type_version = `${type}:${version}`
    const template = templates[type_version]
    if (!_util.isPlainObject(template)) {
        throw new Error(`jsonxt.pack: 'templates["${type}:${version}"]' not String`)
    }

    const payload = []

    for (let letter of letters) {
        const rule = template[letter]
        if (!rule) {
            payload.push("")
            continue
        }

        const original_value = _util.get(original, rule.path)
        if (_util.isUndefined(original_value)) {
            payload.push("")
            continue
        }

        const encoder = jsonxt.encoders[rule.type]
        if (!encoder) {
            throw new Error(`unknown encoding: ${rule.type}`)
        }

        payload.push(_util.encode(encoder(rule, original_value)))
    }

    return [
        "jxt",
        _util.encode(resolver),
        _util.encode(type),
        _util.encode(version),
        payload.join("/").replace(/[/]*$/, ""),
    ].join(":")
}

/**
 */
exports.pack = pack
