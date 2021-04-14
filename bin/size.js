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
const _util = require("../javascript/lib/_util")
const jsonxt = require("../javascript")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "templates",
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
        "resolver": "example.com",
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

--templates <path>    path to template for JSON-XT encoding
--type <type>         encoding type
--version <version>   encoding version (default "1")
--resolver <name>     resolver name (default: example.com)
`)

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
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
        if (_util.isBuffer(data)) {
            data = [
                {
                    data: new Uint8ClampedArray(data, 0, 4),
                    mode: "byte",
                },
            ]
        }

        const result = await qrcode.toString(data, {
                errorCorrectionLevel: "Q",
            })
        const rows = result.split("\n").length
        
        return Math.ceil(rows * rows / 8)
    } catch (x) {
        return "--fail--: " + _.error.message(x)
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
            const zjencoded = await zdeflate(jencoded)

            const _show = v => {
                if (!_.is.Number(v)) {
                    return v
                }
                const p = Math.round(v * 1000 / jencoded.length) / 10
                return `${v} ${p}%`
            }

            console.log("json", _show(jencoded.length))
            if (qrcode) {
                console.log("json-qr", _show(await qencode_size(jencoded)))
            }

            if (base32) {
                console.log("json-base32", _show(base32.encode(jencoded).length))
            }
            if (base32 && qrcode) {
                console.log("json-base32-qr", _show(await qencode_size(base32.encode(jencoded))))
            }

            console.log("json-zlib", _show(zjencoded.length))
            if (qrcode) {
                console.log("json-zlib-qr", _show(await qencode_size(zjencoded)))
            }

            if (base32) {
                console.log("json-zlib-base32", _show(base32.encode(zjencoded).length))
            }
            if (base32 && qrcode) {
                console.log("json-zlib-base32-qr", _show(await qencode_size(base32.encode(zjencoded))))
            }

            if (cbor) {
                const cencoded = cbor.encode(sd.json)
                const zcencoded = await zdeflate(cencoded)

                console.log("cbor", _show(cencoded.length))
                if (qrcode) {
                    console.log("cbor-qr", _show(await qencode_size(cencoded)))
                }

                if (base32) {
                    console.log("cbor-base32", _show(base32.encode(cencoded).length))
                }
                if (base32 && qrcode) {
                    console.log("cbor-base32-qr", _show(await qencode_size(base32.encode(cencoded))))
                }

                console.log("cbor-zlib", _show(zcencoded.length))
                if (qrcode) {
                    console.log("cbor-zlib-qr", _show(await qencode_size(zcencoded)))
                }

                if (base32) {
                    console.log("cbor-zlib-base32", _show(base32.encode(zcencoded).length))
                }
                if (base32 && qrcode) {
                    console.log("cbor-zlib-base32-qr", _show(await qencode_size(base32.encode(zcencoded))))
                }
            }

            if (sd.templates) {
                try {
                    // console.log("HERE:XXX", sd.json, sd.templates, ad.type, ad.version, ad.resolver)
                    const packed = await jsonxt.pack(sd.json, sd.templates, ad.type, ad.version, ad.resolver, {
                        uppercase: true,
                    })
                    console.log("packed", packed)
                    console.log("jsonxt", _show(packed.length))

                    if (qrcode) {
                        console.log("jsonxt-qr", _show(await qencode_size(packed)))
                    }
                } 
                catch (x) {
                    console.log(x)
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
    .add("json", null)
    .conditional(ad.templates, fs.read.json.p(ad.templates))
    .add("json:templates")

    .each({
        method: _one,
        inputs: "paths:path",
    })

    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })
