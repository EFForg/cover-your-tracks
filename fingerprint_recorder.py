import pickle
from collections import OrderedDict
import hashlib

from db import Db

class FingerprintRecorder(object):

    @classmethod
    def record_fingerprint(cls, whorls, nonce):
        valid_vars = cls._whorl_names().keys()
        valid_vars.append('signature')

        sorted_whorls = OrderedDict(sorted(whorls.items()))
        serialized_whorls = pickle.dumps(sorted_whorls)
        signature = hashlib.md5(serialized_whorls).hexdigest()
        whorls['signature'] = signature

        valid_print = {}
        for i in whorls:
            if i in valid_vars:
                valid_print[i] = whorls[i]
        
        if cls._need_to_record(nonce, signature):
            cls._record_whorls()

    @staticmethod
    def _whorl_names():
        return {
            'user_agent': "User Agent",
            'http_accept': "HTTP_ACCEPT Headers",
            'plugins': "Browser Plugin Details",
            'timezone': "Time Zone",
            'video': "Screen Size and Color Depth",
            'fonts': "System Fonts",
            'cookie_enabled': "Are Cookies Enabled?",
            'supercookies': "Limited supercookie test"
        }

    # returns true if we think this browser/fingerprint combination hasn't
    # been counted before
    @staticmethod
    def _need_to_record(nonce, signature):
        db = Db()
        db.connect()
        if nonce:
            seen = db.count_sightings(nonce, signature)
        else:
            seen = 0
        return True

    @staticmethod
    def _record_whorls():
        pass
