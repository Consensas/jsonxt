/*
 *  bin/pack.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-04-14
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
        "type": null,
        "resolver": null,
        "templates": null,
    },
});

const help = message => {
    const name = "pack"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] <file.json>

Required:

--type <type>         encoding type
--resolver <name>     resolver name

Options:

--templates <path>    path to template for JSON-XT encoding
                      if not specified, the resolver will be used
--version <version>   encoding version (default "1")
`)

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
}
if (ad._.length === 0) {
    help("at least one file argument is required")
}
if (!ad.type) {
    help("--type required")
}
if (!ad.resolver) {
    help("--resolver required")
}
if (!ad.templates) {
    help("--templates required")
}
if (!ad.version) {
    help("--version required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

/**
 */
const _one = _.promise((self, done) => {
    _.promise(self)
        .validate(_one)

        .then(fs.read.json.magic)
        .make(async sd => {
            console.log("file", sd.path)
                
            const jencoded = JSON.stringify(sd.json)

                try {
                    const packed = await jsonxt.pack(sd.json, sd.templates, ad.type, ad.version, ad.resolver, {
                        uppercase: true,
                    })
                    console.log(packed)
                } 
                catch (x) {
                    console.log(x)
                }
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
