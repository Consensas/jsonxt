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

const keys = o => Object.keys(o)
const mapValues = (o, f) => Object.entries(o).forEach(([ key, value ]) => f(value, key))

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
const encode = s => encodeURIComponent(s) // .replace(/%22/g, "'")
const decode = s => decodeURI(s)

/**
 */
const isQuotable = s => {
    if (!isString(s)) {
        return false
    } else if (s.indexOf("'") > -1) {
        return true
    } else if (s.match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/)) {
        return true
    } else if (s === "null") {
        return true
    } else if (s === "") {
        return true
    } else {
        return false
    }
}

/**
 */
const unquote = s => {
    return s.substring(1, s.length - 1).replace(/''/g, "'")
}

/**
 */
const unstring = s => {
    if (s.match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/)) {
        return parseFloat(s)
    } else if (s === "") {
        return undefined
    } else if (s === "null") {
        return null
    } else if (s === "true") {
        return true
    } else if (s === "false") {
        return false
    } else {
        return s
    }
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

/**
 */
const integer_to_base64 = n => {
    let minus = false
    if (n < 0) {
        minus = true
        n = -n
    }

    const result = []
    do {
        result.unshift(BASE64[n % 64])
        n = Math.floor(n / 64)
    } while (n !== 0)

    if (minus) {
        result.unshift("~")
    }

    return result.join("")
}

/**
 */
const integer_to_base32 = n => new Number(n).toString(32).toUpperCase()

/**
 */
const string_to_base32 = s => require("hi-base32").encode(s).replace(/=*$/, "")

/**
 */
const rule_encode = (rule, value) => {
    switch (rule.type) {
    case "isoyyyymm-2020-base32":
    {
        const date = new Date(value)
        
        return integer_to_base32(
            (date.getFullYear() - 2020) * 100 +
            date.getMonth()
        )
    }
    case "isodate-1900-base32":
    {
        const date = new Date(value)
        
        return integer_to_base32(
            (date.getFullYear() - 1900) * 1000 +
            (date.getMonth() * 50) +
            (date.getDate() - 1)
        )
    }
    
    case "isodatetime-epoch-base32":
        return integer_to_base32(Math.round(new Date(value).getTime() / 1000))
    
    case "md5-base32":
        return require("iotdb-helpers").hash.md5.base32(value).replace(/=*$/, "")

    case "isoyyyymm-2020-base64":
    {
        const date = new Date(value)
        
        return integer_to_base64(
            (date.getFullYear() - 2020) * 100 +
            date.getMonth()
        )
    }
    case "isodate-1900-base64":
    {
        const date = new Date(value)
        
        return integer_to_base64(
            (date.getFullYear() - 1900) * 1000 +
            (date.getMonth() * 50) +
            (date.getDate() - 1)
        )
    }
    
    case "isodatetime-epoch-base64":
        return integer_to_base64(Math.round(new Date(value).getTime() / 1000))
    
    case "md5-base64":
        return require("iotdb-helpers").hash.md5.base64(value).replace(/=*$/, "")

    case "string":
        return `${value}`

    case "string-base32":
        return string_to_base32(`${value}`)

    default:
        throw new Error(`unknown encoding: ${rule.type}`)
    }
    
}

/**
 */
const quote = s => {
    return `"${s.replace(/[\"]/g, '""')}"`
}

/**
 *  API
 */
exports.split = split
exports.get = get
exports.set = set
exports.isQuotable = isQuotable
exports.quote = quote
exports.unquote = unquote
exports.unstring = unstring
exports.encode = encode
exports.decode = decode
exports.isPlainObject = isPlainObject
exports.isBuffer = isBuffer
exports.isString = isString
exports.isArray = isArray
exports.isUndefined = isUndefined
exports.isNull = isNull
exports.isNumber = isNumber
exports.isInteger = isInteger
exports.isBoolean = isBoolean
exports.isEqual = isEqual
exports.keys = keys
exports.mapValues = mapValues

exports.integer_to_base32 = integer_to_base32
exports.string_to_base32 = string_to_base32
