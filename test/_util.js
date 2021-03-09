/*
 *  test/_util.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-20
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

const fs = require("fs")
const path = require("path")

const yaml = require("js-yaml")

/**
 *  Shims
 */
const shims_on = () => {
}

const shims_off = () => {
}

/**
 */
const write_json = async (json, filename) => {
    await fs.promises.writeFile(
        path.join(__dirname, "data", filename), 
        JSON.stringify(json, null, 2)
    )
}

/**
 */
const read_json = async (filename) => {
    return JSON.parse(await fs.promises.readFile(
        path.join(__dirname, "data", filename), 
        "utf8"
    ))
}

/**
 */
const write_yaml = async (json, filename) => {
    await fs.promises.writeFile(
        path.join(__dirname, "data", filename), 
        yaml.dump(json, {
            sortKeys: false,
            noRefs: true,
        })
    )
}

/**
 */
const read_yaml = async (filename) => {
    return yaml.load(await fs.promises.readFile(
        path.join(__dirname, "data", filename), 
        "utf8"
    ))
}

/**
 */
const write_file = async (data, filename) => {
    await fs.promises.writeFile(
        path.join(__dirname, "data", filename), 
        data
    )
}

/**
 */
const read_file = async (filename) => {
    return await fs.promises.readFile(
        path.join(__dirname, "data", filename), 
        "utf8"
    )
}


/**
 *  API
 */
exports.shims_on = shims_on
exports.shims_off = shims_off

exports.write_json = write_json
exports.read_json = read_json
exports.write_yaml = write_yaml
exports.read_yaml = read_yaml
exports.write_file = write_file
exports.read_file = read_file
