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

/**
 *  
 */
const pack_payload = async (original, template) => {
    const jsonxt = require("..")

    const payload = []

    for (let rule of template.columns ?? []) {
        const original_value = _util.get(original, rule.path)

        const encoder = jsonxt.encoders[rule.type]
        if (!encoder) {
            throw new Error(`unknown encoding: ${rule.type}`)
        }

        const encoded_value = encoder(rule, original_value)

        payload.push(_util.encode(encoded_value))
    }

    return payload.join("/").replace(/[/]*$/, "")
}

/**
 */
const pack = async (original, templates, type, version, resolver, paramd) => {
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

    const type_version = `${type.toLowerCase()}:${version.toLowerCase()}`
    const template = templates[type_version]
    if (!_util.isPlainObject(template)) {
        throw new Error(`jsonxt.pack: 'templates["${type}:${version}"]' not Plain Object`)
    }

    let upme = s => s
    if (paramd?.uppercase) {
        upme = s => s.toUpperCase()
    }

    return [
        upme("jxt"),
        upme(_util.encode(resolver)),
        upme(_util.encode(type)),
        upme(_util.encode(version)),
        await pack_payload(original, template),
    ].join(":")
}

/**
 */
exports.pack = pack
exports.pack.payload = pack_payload
