#
#   tests/unpack.py
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

from unpack import unpack

import unittest
import sys
import os
import json

__dirname__ = os.path.dirname(os.path.abspath(__file__))
TESTS = os.path.join(__dirname__, "..", "..", "test", "data")

class Unpack(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None

        with open(os.path.join(TESTS, "covid-templates.json")) as fin:
            self.templates = fin.read()

    def resolver(self, resolver_name, resolver_type):
        return self.templates

    def test(self):
        for NAME, TYPE, VERSION in [
            [ "w3vc-1-1", "w3vc", "1" ],
            [ "w3vc-1-2", "w3vc", "1" ],
            [ "c4-1-1", "c4", "1" ],
        ]:
            with open(os.path.join(TESTS, "%s.json" % NAME)) as fin:
                original = json.loads(fin.read())
            with open(os.path.join(TESTS, "%s-packed.txt" % NAME)) as fin:
                uri = fin.read()

            result = unpack(uri, self.resolver)
            self.assertEqual(result, original)
            ## print result
        ## self.assertTrue(False)

if __name__ == "__main__":
    unittest.main()
