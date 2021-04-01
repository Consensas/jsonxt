/*
 *  bin/size.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-31
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

let qrcode
try {
    qrcode = require("qrcode")
} catch (x) {
    console.log(`\
To see QR code sizes, do

    npm install qrcode
`)
}

let base32
try {
    base32 = require("hi-base32")
} catch (x) {
    console.log(`\
To see Base32 sizes, do

    npm install hi-base32
`)
}

const zlib = require("zlib")

let cbor
cbor = require("cbor")

let _
let fs
try {
    _ = require("iotdb-helpers")
    fs = require("iotdb-fs")
} catch (x) {
    console.log(`
SORRY - additional packages required. Please do

    npm install iotdb-helpers
    npm install iotdb-fs

And try again
`)
    process.exit(1)
}
const _util = require("../lib/_util")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "template",
        "resolver",
        "type",
        "version",
        "_",
    ],
    alias: {
    },
    default: {
        "version": "1",
        "type": "type",
    },
});

const help = message => {
    const name = "analyze"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] <file.json>...

See how efficiently JSON documents will compact
using various methods

Options:

--template <path>     path to template for JSON-XT encoding
--type <type>         encoding type
--version <version>   encoding version (default "1")
--resolver <name>     resolver name (default: example.com)
`)

    process.exit(message ? 1 : 0)
}

if (ad._.length === 0) {
    help("at least one file argument is required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

const zdeflate = data => {
    return new Promise((resolve, reject) => {
        zlib.deflate(JSON.stringify(data), (error, buffer) => {
            if (error) {
                reject(error)
            } else {
                resolve(buffer)
            }
        })
    })
}

const qencode_size = async data => {
    try {
        const result = await qrcode.toString(data, {
            errorCorrectionLevel: "Q",
        })
        const rows = result.split("\n").length
        
        // console.log(rows)
        return Math.ceil(rows * rows / 8)
    } catch (x) {
        return NaN
    }
}


/**
 */
const _one = _.promise((self, done) => {
    _.promise(self)
        .validate(_one)

        .then(fs.read.json.magic)
        .make(async sd => {
            console.log("file", sd.path)
                
            const jencoded = JSON.stringify(sd.json)
            console.log(jencoded)
            const zjencoded = await zdeflate(jencoded)

            console.log("json", jencoded.length)
            if (qrcode) {
                console.log("json-qr", await qencode_size(jencoded))
            }

            console.log("json-zlib", zjencoded.length)
            if (qrcode) {
                console.log("json-zlib-qr", await qencode_size(zjencoded))
            }

            if (base32) {
                console.log("json-zlib-base32", base32.encode(zjencoded).length)
            }
            if (base32 && qrcode) {
                console.log("json-zlib-base32-qr", await qencode_size(base32.encode(zjencoded)))
            }

            if (cbor) {
                const cencoded = cbor.encode(sd.json)
                const zcencoded = await zdeflate(cencoded)

                console.log("cbor", cencoded.length)
                if (qrcode) {
                    console.log("cbor-qr", await qencode_size(cencoded))
                }

                console.log("cbor-zlib", zcencoded.length)
                if (qrcode) {
                    console.log("cbor-qr", await qencode_size(zcencoded))
                }

                if (base32) {
                    console.log("cbor-zlib-base32", base32.encode(zcencoded).length)
                }
                if (base32 && qrcode) {
                    console.log("cbor-zlib-base32", await qencode_size(base32.encode(zcencoded)))
                }
            }

            console.log()
        })

        .end(done, self, _one)
})

_one.method = "_one"
_one.description = ``
_one.requires = {
    path: _.is.String,
}
_one.accepts = {
}
_one.produces = {
}


/**
 */
_.promise({
    paths: ad._,
})
    .each({
        method: _one,
        inputs: "paths:path",
    })

    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })
