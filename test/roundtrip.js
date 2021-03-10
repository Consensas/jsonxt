/*
 *  test/roundtrip.js
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

const _ = require("lodash")
const jsonxt = require("..")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./_util")

const FOLDER = path.join(__dirname, "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("roundtrip", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    for (let NAME  of [ "xt-1", "xt-2" ]) {
    // for (let NAME  of [ "xt-1", ]) {
        it(`compress: ${NAME}`, async function() {
            const template = await _util.read_json(`${NAME}-template.json`)
            const original = await _util.read_json(`${NAME}.json`)

            const compressed = jsonxt.compress(original, template, "https://example.com/template")
            const got = compressed

            const FILE = `${NAME}-compressed.json`
            if (DUMP) {
                console.log("compressed", JSON.stringify(got, null, 2))
            }
            if (WRITE) {
                await _util.write_json(got, FILE)
            }
            const want = await _util.read_json(FILE)

            assert.deepEqual(got, want)
        })
        it(`csv: ${NAME}`, async function() {
            const template = await _util.read_json(`${NAME}-template.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const compressed = await _util.read_json(`${NAME}-compressed.json`)

            const got = jsonxt.urn.csv(compressed)
            const FILE = `${NAME}-jxt-csv.txt`
            if (DUMP) {
                console.log("jxt", got, got?.length)
            }
            if (WRITE) {
                await _util.write_file(got, FILE)
            }
            const want = await _util.read_file(FILE)

            assert.deepEqual(got, want)
        })
        it(`json: ${NAME}`, async function() {
            const template = await _util.read_json(`${NAME}-template.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const compressed = await _util.read_json(`${NAME}-compressed.json`)

            const got = jsonxt.urn.json(compressed)
            const FILE = `${NAME}-jxt-json.txt`
            if (DUMP) {
                console.log("jxt", got, got?.length)
            }
            if (WRITE) {
                await _util.write_file(got, FILE)
            }
            const want = await _util.read_file(FILE)

            assert.deepEqual(got, want)
        })
        it(`rountrip decompress: ${NAME}`, async function() {
            const template = await _util.read_json(`${NAME}-template.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const compressed = await _util.read_json(`${NAME}-compressed.json`)

            const decompressed = await jsonxt.decompress(compressed, template_url => {
                return template
            })

            const got = decompressed
            if (DUMP) {
                console.log("decompressed", got)
            }
            const want = original

            // console.log(JSON.stringify(got, null, 2))
            // console.log(JSON.stringify(want, null, 2))

            assert.deepEqual(got, want)
        })
        it(`roundtrip unpack csv: ${NAME}`, async function() {
            const template = await _util.read_json(`${NAME}-template.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const compressed = await _util.read_json(`${NAME}-compressed.json`)
            const packed = await _util.read_file(`${NAME}-jxt-csv.txt`)
            const unpacked = jsonxt.urn.unpack(packed)

            const got = unpacked
            const want = compressed

            if (DUMP) {
                console.log("packed", packed)
                console.log("got", got)
                console.log("want", want)
            }

            assert.deepEqual(got, want)
        })
        it(`roundtrip unpack json: ${NAME}`, async function() {
            const template = await _util.read_json(`${NAME}-template.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const compressed = await _util.read_json(`${NAME}-compressed.json`)
            const packed = await _util.read_file(`${NAME}-jxt-json.txt`)
            const unpacked = jsonxt.urn.unpack(packed)

            const got = unpacked
            const want = compressed

            if (DUMP) {
                console.log("packed", packed)
                console.log("got", got)
                console.log("want", want)
            }

            assert.deepEqual(got, want)
        })
    }
})
