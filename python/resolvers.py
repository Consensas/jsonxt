#
#   resolvers.py
#
#   David Janes
#   Consensas
#   2021-04-10
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

import _util
import dns.resolver
import re

def dns_resolve(resolver_name, resolver_key):
    resolver_key = re.sub("[.].*$", "", resolver_key)
    host = u"%s._jsonxt.%s" % ( resolver_key, resolver_name )

    try:
        resultss = dns.resolver.query(host, "TXT")
        for results in resultss:
            for result in results.strings:
                return result
    except dns.resolver.NXDOMAIN:
        pass

    return None

if __name__ == "__main__":
    print dns_resolve("jsonxt.io", "sample1")
