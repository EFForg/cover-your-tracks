import pickle
from collections import OrderedDict
import hashlib
from time import time
import hmac

from db import Db
from fingerprint_helper import FingerprintHelper


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
    @classmethod
    def _need_to_record(cls, cookie, signature, ip_addr, key):
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

        timestamp = time()
        blur = timestamp % 3600  # nearest hour
        floored_timestamp = int(timestamp - blur)

        ip, google_style_ip = cls._get_ip_hmacs(ip_addr, key)

        db.record_sighting(
            write_cookie, signature, ip, google_style_ip, timestamp)
        return seen == 0

    @staticmethod
    def _record_whorls(whorls):
        db = Db()
        db.connect()
        # actually update the fingerprint table...
        db.record_fingerprint(whorls)
        md5_whorls = FingerprintHelper.value_or_md5(whorls)
        db.update_totals(md5_whorls)

    @staticmethod
    def _get_ip_hmacs(ip_addr, key):
        # result looks like 192.168.1
        google_style_ip_split = ip_addr.split(".")[0:3]
        # we're not handling ipv6
        google_style_ip_raw = ".".join(google_style_ip_split)

        google_style_ip = hmac.new(key, google_style_ip_raw).digest()
        ip = hmac.new(key, ip_addr).digest()
        return ip, google_style_ip
