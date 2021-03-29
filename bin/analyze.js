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

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "_",
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "analyze"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] [<files>...]

NOT WORKING!

Analyze the structure of one or more JSON files.
If no files specified, stdin is read
`)

    process.exit(message ? 1 : 0)
}

if (ad._.length === 0) {
    ad._.push("-")
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
            self.map[ps] = self.map[ps] || new Set()
            self.map[ps].add(o)
        }
    }

    _.promise(self)
        .validate(_one)

        .conditional(self.path === "-", fs.read.stdin, fs.read.utf8)
        .make(sd => {
            _descend(JSON.parse(sd.document), null)
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
    map: {},
})
    .each({
        method: _one,
        inputs: "paths:path",
    })
    .make(sd => {
        console.log(sd.map)
    })

    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })
