/**
 *  lib/resolve.js
 *
 *  David Janes
 *  Consensas
 *  2021-03-26
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

const _util = require("./_util")

var simpleCache = new Map();;

function addCache(resolver_name, resolver_key, result) {
    if (simpleCache.size > 100) 
        simpleCache.clear();
    simpleCache.set(resolver_name + resolver_key, result);
}

function getCache(resolver_name, resolver_key) {
    return simpleCache.get(resolver_name + resolver_key);
}

/**
 */
const resolve = async (resolver_name, resolver_key) => {
    const jsonxt = require("..")

    if (resolver_name.match(/[\/:]/)) {
        return await jsonxt.resolvers.uri(resolver_name, resolver_key)
    }

    let result 

    result = await jsonxt.resolvers.well_known(resolver_name, resolver_key)
    if (result) {
        return result
    }

    return null
}

/**
 */
const resolveCache = async (resolver_name, resolver_key) => {
    const cached = getCache(resolver_name, resolver_key);
    if (cached) {
        //console.log("Returning cached versiono for ", resolver_name, resolver_key)
        return cached;
    } else {
        //console.log("Not Cached yet ", resolver_name, resolver_key);
    }

    let result = await resolve(resolver_name, resolver_key);

    if (result) {
        addCache(resolver_name, resolver_key, result);
        return result;
    }

    return null
}

/**
 */
exports.resolve = resolve
exports.resolveCache = resolveCache
