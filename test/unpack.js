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
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    for (let [ NAME, TYPE, VERSION ] of [ 
        // [ "w3vc-1-1", "w3vc", "1" ],
        // [ "w3vc-1-2", "w3vc", "1" ],
        // [ "w3vc-1qr-1", "w3vc", "1qr" ],
        [ "c4-1-1", "c4", "1" ],
    ]) {
        it(`compress: ${NAME}`, async function() {
            const template = await _util.read_json(`template.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await _util.read_document(`${NAME}-packed.txt`)

            const unpacked = jsonxt.unpack(packed, resolver => {
            })
            const got = unpacked

            /*
            const FILE = `${NAME}-packed.txt`
            if (DUMP) {
                console.log("packed", got, got?.length)
                console.log("packed", got.toUpperCase(), got?.length)
            }
            if (WRITE) {
                await _util.write_document(got, FILE)
            }
            const want = await _util.read_document(FILE)

            assert.deepEqual(got, want)
            */
        })
    }
})
