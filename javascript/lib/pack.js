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
 *  Packs an $array of objects using the type $template
 */
const pack_array = async (array, template, templates) => {
    if (array == null || array == undefined) {
        return null;
    }

    let packedArray = [array.length];
    for (let index = 0; index < array.length; index++) {
        Array.prototype.push.apply(packedArray, await pack_template(array[index], template, templates));
    }
    return packedArray;
} 

/**
 *  Packs an array with $original's fields following the $template 
 */
const pack_template = async (original, template, templates) => {
    const jsonxt = require("..")

    const payload = []

    if (template && template.columns) {
        for (let rule of template.columns) {
            const original_value = _util.get(original, rule.path);

            if (rule.encoder === "array") {
                const encodedArray = await pack_array(original_value, templates[rule.encoder_param], templates);

                if (encodedArray) {
                    Array.prototype.push.apply(payload, encodedArray);
                } else {
                    payload.push(rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED);
                }
            } else {
                const encoder = jsonxt.encoders[rule.encoder]
                if (!encoder) {
                    throw new Error(`unknown encoding: ${rule.encoder}`)
                }

                const encoded_value = encoder(rule, original_value)

                payload.push(encoded_value)
            }
        }
    }

    return payload;
}


/**
 *  
 */
const get_dict = async (array) => {
    // iterate the array and set and update the counter in map
    const dict = {}; // Empty dictionary
    array.forEach(function(num) {
        dict[num] = dict[num] ? dict[num] + 1 : 1;
    });
    return dict;
}

const filter_dict = async (dict) => {
    var filtered = Object.keys(dict).reduce(function (filtered, key) {
        if (dict[key] > 1 && key.length > 3) filtered[key] = dict[key];
        return filtered;
    }, {});
    return filtered;
}

const find_first_dict = async (array, dict) => {
    // iterate the array and set and update the counter in map
    const dictKeyFirstIndex = {}; // Empty dictionary
    Object.keys(dict).forEach(function(key) {
        dictKeyFirstIndex[key] = array.findIndex(element => element === key);
        //console.log("TermMap", "*"+_util.integer_to_base32(dictKeyFirstIndex[key]), key);
    });
    return dictKeyFirstIndex;
}

const replace_all_but_first = async (array, dict, dictKeyFirstIndex) => {
    // iterate the array and set and update the counter in map
    const ret = [];
    array.forEach(function(key, index) {
        if (key in dict && index != dictKeyFirstIndex[key])
            ret[index] = "*"+_util.integer_to_base32(dictKeyFirstIndex[key]);
        else 
            ret[index] = key;
    });
    return ret;
}

/**
 *  
 */
const apply_term_map = async (array) => {
    // iterate the array and set and update the counter in map
    const dict = await get_dict(array);
    const filterredDict = await filter_dict(dict);
    const dictKeyFirstIndex = await find_first_dict(array, filterredDict);
    return await replace_all_but_first(array, filterredDict, dictKeyFirstIndex);
}


/**
 *  Recursively creates an array payload fields and turns it into a string
 */
const pack_payload = async (original, template, templates) => {
    // Traditional JSONXT
    const payload = await pack_template(original, template, templates);
    // Applies a Term Map to remove duplicated fields within the array. Uses * to index terms
    const compressed = await apply_term_map(payload);
    // Transforms the array into a string, removes the last null fields. 
    const stringified = compressed.join("/").replace(/[/]*$/, "");
    
    // * (termmaps) and $ (compact,prefix) become separators (/* -> *, /$ -> $) to reduce size in highly compressed objects.
    // Sequences of null fields are mapped into ' ' + index. 
    // TODO: This is UGLY. Need to find a better way to run over all these regex in order. 
    const usingSpaceToRepresentNullFieldsInSequence = stringified
        .replace(/\/\*/g, "*")
        .replace(/\/\$/g, "$")
        .replace(/[\/]{19}/g, " G")
        .replace(/[\/]{18}/g, " F")
        .replace(/[\/]{17}/g, " E")
        .replace(/[\/]{16}/g, " D")
        .replace(/[\/]{15}/g, " C")
        .replace(/[\/]{14}/g, " B")
        .replace(/[\/]{13}/g, " A")
        .replace(/[\/]{12}/g, " 9")
        .replace(/[\/]{11}/g, " 8")
        .replace(/[\/]{10}/g, " 7")
        .replace(/[\/]{9}/g, " 6")
        .replace(/[\/]{8}/g, " 5")
        .replace(/[\/]{7}/g, " 4")
        .replace(/[\/]{6}/g, " 3")
        .replace(/[\/]{5}/g, " 2")
        .replace(/[\/]{4}/g, " 1")
        .replace(/[\/]{3}/g, " 0")

    return usingSpaceToRepresentNullFieldsInSequence;
}

/**
 */
const pack = async (original, templates, type, version, resolver_name, paramd) => {
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
    if (!_util.isString(resolver_name)) {
        throw new Error("jsonxt.pack: 'resolver_name' not String")
    }

    const type_version = `${type.toLowerCase()}:${version.toLowerCase()}`
    const template = templates[type_version]
    if (!_util.isPlainObject(template)) {
        throw new Error(`jsonxt.pack: 'templates["${type}:${version}"]' not Plain Object`)
    }

    let upme = s => s
    if (paramd && paramd.uppercase) {
        upme = s => s.toUpperCase()
    }

    return [
        upme("jxt"),
        upme(_util.encode(resolver_name)),
        upme(_util.encode(type)),
        upme(_util.encode(version)),
        await pack_payload(original, template, templates),
    ].join(":")
}

/**
 */
const resolvePack = async (original, type, version, resolver_name, resolver_resolver, paramd) => {
    let templates = await resolver_resolver(resolver_name, "templates.json")
    return await pack(original, JSON.parse(templates), type, version, resolver_name, paramd);
}

/**
 *  API
 */
exports.pack = pack
exports.resolvePack = resolvePack
exports.pack.payload = pack_payload
