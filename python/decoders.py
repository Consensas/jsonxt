import _util
import math
import time

def string(rule, value):
    if value == rule.NULL:
        return None
    elif value == rule.UNDEFINED:
        return _util.UNDEFINED
    elif value == rule.EMPTY_STRING:
        return ""

    if value.startswith(_util.ENCODE.ESCAPE):
        if value[1] == _util.ENCODE.ESCAPE:
            value = value[2:]
            value = "~" + _util.decodeExtended(value)
        else:
            if rule.compact:
                index = _util.integer_to_base32(value.substring(1))
                if index >= 0 and index < len(rule.compact):
                    return rule.compact[index]

            raise Error("did not understand escape sequence ${value}")
    else:
        value = _util.decodeExtended(value)

    return value

def isodatetime_epoch_base32(rule, value):
    if value == rule.NULL:
        return None
    elif value == rule.UNDEFINED:
        return _util.UNDEFINED

    seconds = _util.base32_to_integer(value)

    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(seconds))

def isodate_1900_base32(rule, value):
    if value == rule.NULL:
        return None
    elif value == rule.UNDEFINED:
        return _util.UNDEFINED

    i = _util.base32_to_integer(value)

    yyyy = math.floor(i / 1000) % 1000 + 1900
    mm = math.floor((i % 1000) / 50) % 50 + 1
    dd = (i % 50)

    return "%04d-%02d-%02d" % ( yyyy, mm, dd )

def isoyyyymm_2020_base32(rule, value):
    if value == rule.NULL:
        return None
    elif value == rule.UNDEFINED:
        return _util.UNDEFINED

    i = _util.base32_to_integer(value)

    yyyy = math.floor(i / 100) % 100 + 2020
    mm = i % 100 + 1

    return "%04d-%02d" % ( yyyy, mm, )

def integer_base32(rule, value):
    if value == rule.NULL:
        return None
    elif value == rule.UNDEFINED:
        return _util.UNDEFINED

    return _util.base32_to_integer(value)
