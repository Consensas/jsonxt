/**
 *  lib/_util.js
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

/**
 *  Drop in replacement for lodash stuff
 */
// https://stackoverflow.com/a/33332038/96338
const isPlainObject = d => 
    (d === void 0 || d === null || Array.isArray(d) || typeof d == "function" || d.constructor === Date ) ?
       false : (typeof d == "object")

// https://stackoverflow.com/a/32922084/96338
const isEqual = (x, y) => {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every(key => isEqual(x[key], y[key]))
    ) : (x === y);
}

const isBuffer = v => v instanceof Buffer
const isString = v => typeof v === "string"
const isArray = v => Array.isArray(v)
const isUndefined = v => v === void 0
const isNumber = o => typeof o === "number" && !Number.isNaN(o) && Number.isFinite(o)
const isInteger = o => isNumber(o) && (Math.floor(o) === o)
const isBoolean = o => typeof o === "boolean"
const isNull = o => o === null
const isFunction = o => typeof o === "function"

/*
const keys = o => Object.keys(o)
const mapValues = (o, f) => Object.entries(o).forEach(([ key, value ]) => f(value, key))
*/

/**
 */
const split = key => key.split(".")

/**
 */
const get = (d, key) => {
    const parts = split(key)

    while (parts.length && isPlainObject(d)) {
        d = d[parts.shift()]
    }

    return d
}

/**
 */
const delete_ = (d, key) => {
    const parts = split(key)
    const last = parts.pop()

    while (parts.length && isPlainObject(d)) {
        d = d[parts.shift()]
    }

    delete d[last]
}

/**
 */
const set = (d, key, value) => {
    const parts = split(key)

    while (parts.length > 1) {
        const first = parts.shift()
        if (isPlainObject(d[first])) {
            d = d[first]
        } else {
            d = d[first] = {}
        }
    }

    d[parts[0]] = value
}

/**
 */
const encode = s => encodeURIComponent(s) 
const decode = s => decodeURIComponent(s)

const encodeExtendedSpace = s => {
    s = encodeURIComponent(s)
    s = s.replace(/~/g, "%7E")
    s = s.replace(/%20/g, "~")

    return s
}

const decodeExtendedSpace = s => {
    s = s.replace(/~/g, "%20")
    s = decodeURIComponent(s)

    return s
}

/**
 */
const integer_to_base32 = n => new Number(n).toString(32).toUpperCase()
const base32_to_integer = s => parseInt(s.toLowerCase(), 32)

/**
 */
const fetch = async url => {
    const https = require("https")

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

        request.on("error", error => {
            if (error.code === "ENOTFOUND") {
                return resolve(null)
            }

            reject(error)
        })

        request.end()
    })
}

/**
 *  API
 */
exports.split = split
exports.get = get
exports.set = set
exports.delete = delete_
exports.encode = encode
exports.decode = decode
exports.encodeExtendedSpace = encodeExtendedSpace
exports.decodeExtendedSpace = decodeExtendedSpace
exports.isPlainObject = isPlainObject
exports.isBuffer = isBuffer
exports.isString = isString
exports.isArray = isArray
exports.isUndefined = isUndefined
exports.isNull = isNull
exports.isNumber = isNumber
exports.isInteger = isInteger
exports.isBoolean = isBoolean
exports.isFunction = isFunction
exports.isEqual = isEqual
exports.fetch = fetch

// exports.keys = keys
// exports.mapValues = mapValues

exports.base32_to_integer = base32_to_integer
exports.integer_to_base32 = integer_to_base32
// exports.string_to_base32 = string_to_base32
