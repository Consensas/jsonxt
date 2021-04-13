/*
 *  bin/analyze.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-08
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

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "type",
        "version",
        "_",
    ],
    alias: {
    },
    default: {
        "type": "type",
        "version": "1",
    },
});

const help = message => {
    const name = "analyze"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] <file1> <file2> [<fileN>...]

Analyze the structure of several JSON files and produce the templates.json
`)

    process.exit(message ? 1 : 0)
}

if (ad._.length < 2) {
    help("at least two file arguments are required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

/**
 */
const _one = _.promise((self, done) => {
    const _descend = (o, ps) => {
        const key = ps ?? ""

        if (_.is.Dictionary(o)) {
            const nd = {}

            _.mapObject(o, (value, key) => {
                _descend(value, ps ? ps + "." + key : key, true)
            })

            return nd
        } else if (_.is.Array(o)) {
            return
        } else {
            self.map[ps] = self.map[ps] || new Map()
            if (self.map[ps].has(o)) {
                self.map[ps].set(o, self.map[ps].get(o) + 1)
            } else {
                self.map[ps].set(o, 1)
            }
        }
    }

    _.promise(self)
        .validate(_one)

        .then(fs.read.json.magic)
        .make(sd => {
            _descend(sd.json, null)
        })

        .end(done, self, _one)
})

_one.method = "_one"
_one.description = ``
_one.requires = {
    path: _.is.String,
    map: _.is.Dictionary,
}
_one.accepts = {
}
_one.produces = {
}


/**
 */
_.promise({
    paths: ad._,
    path: ad._[0],
    map: {},
})
    .then(fs.read.json.magic)
    .each({
        method: _one,
        inputs: "paths:path",
    })

    .make(sd => {
        const columns = _.pairs(sd.map)
            .filter(([ key, vmap ]) => vmap.size !== 1)
            .map(([ key, vmap ]) => {
                const vs = vmap.keys()
                const d = {
                    path: key,
                    encoder: "string",
                }

                let string = 0
                let nonstring = 0
                let nulls = 0
                const encoders = new Set()
                for (const v of vs) {
                    if (_.is.Boolean(v)) {
                        nonstring++
                        encoders.add("boolean")
                    } else if (_.is.Integer(v)) {
                        nonstring++
                        encoders.add("integer")
                    } else if (_.is.Number(v)) {
                        nonstring++
                        encoders.add("number")
                    } else if (_.is.Null(v)) {
                        nulls++
                    } else if (v.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)) {
                        string++
                        encoders.add("isodatetime-epoch-base32")
                    } else if (v.match(/^\d\d\d\d-\d\d-\d\d$/)) {
                        string++
                        encoders.add("isodate-1900-base32")
                    } else if (v.match(/^\d\d\d\d-\d\d$/)) {
                        string++
                        encoders.add("isoyyyymm-2020-base32")
                    } else {
                        string++
                        encoders.add("string")
                    }
                }

                if (string && nonstring) {
                    d.encoder = "json"
                } else if (encoders.size === 1) {
                    d.encoder = Array.from(encoders)[0]
                } else if (string) {
                    d.encoder = "string"
                } else if (nonstring) {
                    d.encoder = "number"
                } else {
                    console.log("#", "can't figure out key:", key)
                    process.exit(1)
                }

                if (d.encoder === "string") {
                    const compact = []

                    for (let [key, value] of vmap) {
                        if (value > 5) {
                            compact.push(key)
                        }
                    }

                    if (compact.length) {
                        d.compact = compact
                    }
                }

                return d
            })

        const template = sd.json
        for (const column of columns) {
            _util.delete(template, column.path)
        }

        const templates = {
            [ `${ad.type}:${ad.version}` ]: {
                columns: columns,
                template: template,
            }
        }
        console.log(JSON.stringify(templates, null, 2))
    })

    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })
