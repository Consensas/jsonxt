/*
 *  test/util.fetch.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-04-08
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
const https = require("https")
const path = require("path")
const assert = require("assert")

const _util = require("./_util")
const util = require("../lib/_util")

const FOLDER = path.join(__dirname, "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("_util.fetch", function() {
    let https_request = https.request

    before(function() {
        https.request = function(...rest) {
            const r = Object.assign({})
            r.on = function (name, code) {
                code(new Error())
            }
            r.end = () => {}

            return r
        }
    })

    after(function() {
        https.request = https_request
    })

    it("_util.fetch - forced error", async function() {
        assert.rejects(async () => {
            await util.fetch("https://google.ca")
        })
    })
})
