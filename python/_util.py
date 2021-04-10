#
#   _util.py
#
#   David Janes
#   Consensas
#   2021-04-09
#
#   Copyright (2015-2021) Consensas
# 
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
# 
#      http://www.apache.org/licenses/LICENSE-2.0
# 
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#  

import copy
import urllib

def isString(v):
    return True

def isFunction(v):
    return True

def isPlainObject(v):
    return True

def decodeExtended(s):
    s = s.replace("~", "%20")
    s = urllib.unquote(s)

    return s

def base32_to_integer(value):
    return int(value, 32)

def decode(v):
    return v

def set(d, key, value):
    parts = key.split(".")

    while len(parts) > 1:
        first = parts[0]
        parts.pop(0)

        if isPlainObject(d[first]):
            d = d[first]
        else:
            d = d[first] = {}

    d[parts[0]] = value

class Undefined:
    pass

UNDEFINED = Undefined()

class Encode:
    def __init__(self):
        self.NULL = "XXX"
        self.UNDEFINED = "XXX"
        self.EMPTY_STRING = "XXX"
        self.ESCAPE = "~"

ENCODE = Encode()

class Rule:
    def __init__(self, entries):
        self.__dict__.setdefault("NULL", ENCODE.NULL)
        self.__dict__.setdefault("UNDEFINED", ENCODE.UNDEFINED)
        self.__dict__.setdefault("EMPTY_STRING", ENCODE.EMPTY_STRING)
        self.__dict__.update(entries)

class Template:
    def __init__(self, entries):
        self.__dict__.setdefault("columns", [])
        self.__dict__.setdefault("template", {})
        self.__dict__.update(copy.deepcopy(entries))

        self.columns = map(lambda c: Rule(c), self.columns)
