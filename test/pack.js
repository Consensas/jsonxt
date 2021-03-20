/*
 *  test/pack.js
 *
 *  David Janes
 *  Consenas.com
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

const _ = require("lodash")
const jsonxt = require("..")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./_util")

const FOLDER = path.join(__dirname, "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("pack", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    for (let [ NAME, TYPE, VERSION ] of [ 
        [ "w3vc-1-1", "w3vc", "1" ],
        [ "w3vc-1-2", "w3vc", "1" ],
        [ "w3vc-1qr-1", "w3vc", "1qr" ],
        [ "c4-1-1", "c4", "1" ],
        [ "simple-1-1", "simple", "1" ],
    ]) {
        it(`compress: ${NAME}`, async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            const packed = await jsonxt.pack(original, templates, TYPE, VERSION, "example.com")
            const got = packed

            const FILE = `${NAME}-packed.txt`
            if (DUMP) {
                const p = Math.round(got.length / JSON.stringify(original).length * 100)
                console.log("packed", got, got.length, `${p}%`)
            }
            if (WRITE) {
                await _util.write_document(got, FILE)
            }
            const want = await _util.read_document(FILE)

            assert.deepEqual(got, want)
        })
        it(`compress (uppercase): ${NAME}`, async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            const packed = await jsonxt.pack(original, templates, TYPE, VERSION, "example.com", {
                uppercase: true,
            })
            const got = packed

            const FILE = `${NAME}-packed-upper.txt`
            if (DUMP) {
                const p = Math.round(got.length / JSON.stringify(original).length * 100)
                console.log("packed", got, got.length, `${p}%`)
            }
            if (WRITE) {
                await _util.write_document(got, FILE)
            }
            const want = await _util.read_document(FILE)

            assert.deepEqual(got, want)
        })
    }
    describe("edge cases", function() {
        it("TYPE in upper case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE.toUpperCase(), VERSION, "example.com")
        })
        it("TYPE in lower case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE.toLowerCase(), VERSION, "example.com")
        })
        it("VERSION in upper case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1qr"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE, VERSION.toUpperCase(), "example.com")
        })
        it("VERSION in lower case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1qr"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE, VERSION.toLowerCase(), "example.com")
        })
    })
    describe("expected failures", function() {
        const NAME = "w3vc-1-1"
        const TYPE = "w3vc"
        const VERSION ="1"

        it("works with all parameters", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE, VERSION, "example.com")
        })
        it("missing original", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(null, templates, TYPE, VERSION, "example.com")
            })
        })
        it("missing templates", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, null, TYPE, VERSION, "example.com")
            })
        })
        it("missing type", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, null, VERSION, "example.com")
            })
        })
        it("missing version", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE, null, "example.com")
            })
        })
        it("numeric version", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE, 1, "example.com")
            })
        })
        it("missing resolver", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE, VERSION, null)
            })
        })
        it("template is not defined", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE + "XXXXX", VERSION, "example.com")
            })
        })
    })
})
