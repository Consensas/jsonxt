import _util

def string(rule, value):
    """
    if (value == rule.NULL) || (value == jsonxt.ENCODE.NULL)) {
        return null
    } else if ((value == rule.UNDEFINED) || (value == jsonxt.ENCODE.UNDEFINED)) {
        return undefined
    } else if ((value == rule.EMPTY_STRING) || (value == jsonxt.ENCODE.EMPTY_STRING)) {
        return ""
    }

    if value.startsWith(jsonxt.ENCODE.ESCAPE):
        if value[1] == jsonxt.ENCODE.ESCAPE:
            value = value.substring(2)
            value = "~" + _util.decodeExtended(value)
        else:
            if rule.compact:
                index = _util.integer_to_base32(value.substring(1))
                if ((index >= 0) && (index < rule.compact.length):
                    return rule.compact[index]

            raise Error(`did not understand escape sequence "${value}"`)
    else:
        value = _util.decodeExtended(value)

    """
    return value

def isodatetime_epoch_base32(rule, v):
    return v

def isodate_1900_base32(rule, v):
    return v

def isoyyyymm_2020_base32(rule, v):
    return v

def isodate_1900_base32(rule, v):
    return v

def integer(rule, v):
    return v

def isodatetime_epoch_base32(rule, v):
    return v

