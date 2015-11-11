import pickle
from collections import OrderedDict
import hashlib
from time import time

from db import Db
from fingerprint_helper import FingerprintHelper
from util import get_ip_hmacs


class FingerprintRecorder(object):

    @classmethod
    def record_fingerprint(cls, whorls, cookie, ip_addr, key):
        # ensure no rogue values have been entered
        valid_vars = FingerprintHelper.whorl_names.keys()
        valid_vars.append('signature')

        sorted_whorls = OrderedDict(sorted(whorls.items()))
        serialized_whorls = pickle.dumps(sorted_whorls)
        signature = hashlib.md5(serialized_whorls).hexdigest()
        whorls['signature'] = signature

        valid_print = {}
        for i in whorls:
            if i in valid_vars:
                valid_print[i] = whorls[i]

        if cls._need_to_record(cookie, signature, ip_addr, key):
            cls._record_whorls(valid_print)

    # returns true if we think this browser/fingerprint combination hasn't
    # been counted before
    @staticmethod
    def _need_to_record(cookie, signature, ip_addr, key):
        db = Db()
        db.connect()
        if cookie:
            # okay, we have a cookie; check whether we've seen it with this
            # fingerprint before
            seen = db.count_sightings(cookie, signature)
            write_cookie = cookie
        else:
            seen = 0  # always count cookieless browsers
            # we need to log the HMAC'd IP even if there's no cookie so use a
            # dummy
            write_cookie = 'no cookie'

        # now log the cookie, along with encrypted versions of the IP address
        # and a quarter-erased IP address, like the one Google keeps

        ip, google_style_ip = get_ip_hmacs(ip_addr, key)

        db.record_sighting(
            write_cookie, signature, ip, google_style_ip)
        return seen == 0

    @staticmethod
    def _record_whorls(whorls):
        db = Db()
        db.connect()
        # actually update the fingerprint table...
        db.record_fingerprint(whorls)
        md5_whorls = FingerprintHelper.value_or_md5(whorls)
        db.update_totals(md5_whorls)
