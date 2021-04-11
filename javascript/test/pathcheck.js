/*
 *  test/pathcheck.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-17
 *  ☘️
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

    describe("coupon", function() {
        it("coupon decode", async function() {
            const templates = await _util.read_json(`pathcheck-templates.json`)
            const template = templates["coupon:1"]
            const uri = `CRED:COUPON:1:GBDAEIIA42QDQ5BDUUXVMSQ4VIMMA7RETIZSXB573OL24M4L67LYB24CZYVQEIIA2EZ5W2QXLR7LUSLQW6MLAFV3N7OTT3BDAZCNCRMYBMUYC6WMXMNQ:KEYS.PATHCHECK.ORG:1/5000/SOMERVILLE%20MA%20US/1A/%3E65`
            const parts = uri.split(":")
            const payload = parts[parts.length - 1]

            const unpacked = await jsonxt.unpack.payload(payload, template)
            if (DUMP) {
                console.log("unpacked", JSON.stringify(unpacked, null, 2))
            }
        })
    })
})
