/*
 *  test/unpack.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-15
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

describe("unpack", function() {
    let covid_templates

    before(async function() {
        _util.shims_on()
        covid_templates = await _util.read_json(`covid-templates.json`)
    })

    after(function() {
        _util.shims_off()
    })

    for (let [ NAME, TYPE, VERSION ] of [ 
        [ "w3vc-1-1", "w3vc", "1" ],
        [ "w3vc-1-2", "w3vc", "1" ],
        [ "c4-1-1", "c4", "1" ],
    ]) {
        it(`compress: ${NAME}`, async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await _util.read_document(`${NAME}-packed.txt`)

            const unpacked = await jsonxt.unpack(packed, resolver => {
                return templates
            })
            const got = unpacked
            const want = original

            if (DUMP) {
                console.log("original", original)
                console.log("packed", packed)
                console.log("unpacked", unpacked)
            }

            assert.deepEqual(got, want)
        })
    }

    describe("expected failures", function() {
        const NAME = "w3vc-1-1"
        const TYPE = "w3vc"
        const VERSION ="1"

        const RESOLVER = resolver => {
            return covid_templates
        }

        it("works with all parameters", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = await _util.read_document(`${NAME}-packed.txt`)
            
            const unpacked = await jsonxt.unpack(packed, RESOLVER)
        })
        it("bad value for packed", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = null
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, RESOLVER)
            })
        })
        it("bad value for resolver", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = await _util.read_document(`${NAME}-packed.txt`)
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, null)
            })
        })
        it("sufficient components (works)", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = "jxt:jsonxt.io:w3vc:1:MoH"
            
            const unpacked = await jsonxt.unpack(packed, RESOLVER)
        })
        it("a plethera of components (works)", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = "jxt:jsonxt.io:w3vc:1:MoH:xxx:xxx"
            
            const unpacked = await jsonxt.unpack(packed, RESOLVER)
        })
        it("insufficient components (fails)", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = "jxt:jsonxt.io:w3vc:1"
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, RESOLVER)
            })
        })
        it("wrong prefix (fails)", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const packed = "xjt:jsonxt.io:w3vc:1:MoH"
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, RESOLVER)
            })
        })
    })
})
