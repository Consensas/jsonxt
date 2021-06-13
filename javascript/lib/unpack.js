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
 *  Unpacks from $payloadStack an array of $arraySize elements of the type $template 
 */
const unpack_array = async (payloadStack, arraySize, template, templates) => {
    if (arraySize == null ||  arraySize == undefined  ||  arraySize === "") {
        return null;
    }

    let array = [];
    for (let index = 0; index < parseInt(arraySize); index++) {
        array.push(await unpack_template(payloadStack, template, templates));
    }
    return array;
} 

/**
 *  Unpacks from $payloadStack all fields of the type $template 
 */
const unpack_template = async (payloadStack, template, templates) => {
    const jsonxt = require("..")
    const unpacked = JSON.parse(JSON.stringify(template.template || {}))

    if (template && template.columns) {
        for (let li = 0; li < template.columns.length && payloadStack.length > 0; li++) {
            let payloadElement = payloadStack.shift();

            const rule = template.columns[li]

            if (rule.encoder === "array") {
                const arraySize = payloadElement;
                const nestedTemplate = templates[rule.encoder_param];
                if (!_util.isPlainObject(nestedTemplate)) {
                    throw new Error(`jsonxt.unpack: 'templates["${rule.encoder_param}"]' not String`)
                }

                const unpackedArray = await unpack_array(payloadStack, arraySize, nestedTemplate, templates);
                if (unpackedArray) {
                    _util.set(unpacked, rule.path, unpackedArray);
                }
            } else {
                const decoder = jsonxt.decoders[rule.encoder]
                if (!decoder) {
                    throw new Error(`unknown decoding: ${rule.encoder}`)
                }

                const unpacked_value = decoder(rule, payloadElement)
                if (_util.isUndefined(unpacked_value)) {
                    continue
                }

                _util.set(unpacked, rule.path, unpacked_value)
            }
        }
    }

    return unpacked
}

/**
 *  
 */
const remove_term_map = async (array) => {
    array.forEach(function(key, index) {
        if (key.charAt(0) === "*"){ 
            const mappedIndex = parseInt(_util.base32_to_integer(key.slice(1)));
            array[index] = array[mappedIndex];
        } 
    });
    return array;
}

/**
 *  Creates a stack of payload fields to unpack and starts the recursion 
 */
const unpack_payload = async (payload, template, templates) => {
    // Rebuilds sequences of null fields that were mapped into ' ' + index. 
    // Reverts * and $ as field separators: * -> /* and $ -> /$
    // TODO: This is UGLY. Need to find a better way to run over all these regex in order.  
    const dup = payload
        .replace(/ G/g, "///////////////////")
        .replace(/ F/g, "//////////////////")
        .replace(/ E/g, "/////////////////")
        .replace(/ D/g, "////////////////")
        .replace(/ C/g, "///////////////")
        .replace(/ B/g, "//////////////")
        .replace(/ A/g, "/////////////")
        .replace(/ 9/g, "////////////")
        .replace(/ 8/g, "///////////")
        .replace(/ 7/g, "//////////")
        .replace(/ 6/g, "/////////")
        .replace(/ 5/g, "////////")
        .replace(/ 4/g, "///////")
        .replace(/ 3/g, "//////")
        .replace(/ 2/g, "/////")
        .replace(/ 1/g, "////")
        .replace(/ 0/g, "///")
        .replace(/\*/g, "/*")
        .replace(/\$/g, "/$")

    // Splits string into fields. 
    const payloadStack = dup.split('/');
    // Removes the term map
    const expanded = await remove_term_map(payloadStack);
    // Standard JSONXT
    return await unpack_template(expanded, template, templates)
}

/**
 */
const unpack = async (packed, resolver_resolver) => {
    const jsonxt = require("..")

    if (!_util.isString(packed)) {
        throw new Error("jsonxt.unpack: 'packed' not String")
    }
    if (!_util.isFunction(resolver_resolver)) {
        throw new Error("jsonxt.unpack: 'resolver_resolver' not Function")
    }

    const majors = packed.split(":")

    if (majors.length < 5) {
        throw new Error(`jsonxt.unpack: expected at least 5 parts`)
    }

    const schema = _util.decode(majors[0].toLowerCase())
    const resolver_name = _util.decode(majors[1].toLowerCase())
    const type = _util.decode(majors[2].toLowerCase())
    const version = _util.decode(majors[3].toLowerCase())

    if (schema !== "jxt") {
        throw new Error(`jsonxt.unpack: unknown schema "${schema}"`)
    }

    let templates = await resolver_resolver(resolver_name, "templates.json")
    if (_util.isString(templates)) {
        templates = JSON.parse(templates)
    }
    if (!_util.isPlainObject(templates)) {
        throw new Error("jsonxt.unpack: 'templates' not Plain Object")
    }

    const type_version = `${type}:${version}`

    const template = templates[type_version]
    if (!_util.isPlainObject(template)) {
        throw new Error(`jsonxt.unpack: 'templates["${type}:${version}"]' not String`)
    }

    return await unpack_payload(majors[4], template, templates)
}

/**
 */
exports.unpack = unpack
exports.unpack.payload = unpack_payload
