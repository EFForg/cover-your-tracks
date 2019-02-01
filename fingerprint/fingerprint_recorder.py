import json
import hashlib
from time import time

from db import Db
from .fingerprint_helper import FingerprintHelper
from util import get_ip_hmacs


class FingerprintRecorder(object):

    @classmethod
    def record_fingerprint(cls, whorls_v1, whorls_v2, cookie, ip_addr, key):
        # ensure no rogue values have been entered
        valid_vars_v1 = list(FingerprintHelper.whorl_v1_names.keys())
        valid_vars_v1.append('signature')

        sorted_whorls_v1 = sorted(whorls_v1.items())
        serialized_whorls_v1 = json.dumps(sorted_whorls_v1)

        signature_v1 = hashlib.md5(serialized_whorls_v1.encode("utf-8")).hexdigest()
        whorls_v1['signature'] = signature_v1

        # ensure no rogue values have been entered
        valid_vars_v2 = list(FingerprintHelper.whorl_v2_names.keys())
        valid_vars_v2.append('signature')

        sorted_whorls_v2 = sorted(whorls_v2.items())
        serialized_whorls_v2 = json.dumps(sorted_whorls_v2)

        signature_v2 = hashlib.md5(serialized_whorls_v2.encode("utf-8")).hexdigest()
        whorls_v2['signature'] = signature_v2

        # When multiple whorl versions are being calculated, valid_print should
        # combine the whorls from both versions.  There should never be a
        # mismatch of a whorl between two versions.  If, say, the canvas_hash
        # changes between versions due to a new library being used, this should
        # be separated into a new whorl, like canvas_hash_<library_name>.
        valid_print = {}
        for i in whorls_v1:
            if i in valid_vars_v1:
                valid_print[i] = whorls_v1[i]
        for i in whorls_v2:
            if i in valid_vars_v2:
                valid_print[i] = whorls_v2[i]

        signatures = [
            { 'version': 1, 'signature': signature_v1 },
            { 'version': 2, 'signature': signature_v2 }
        ]

        if cls._need_to_record(cookie, signatures, ip_addr, key):
            cls._record_whorls(valid_print, signatures)

    # This is intended to be used by a cron job or some other automated
    # process that updates the epoch beginning to x days ago every day.
    # Update the corresponding values in `totals` so that we have an accurate
    # measure of how many times specific metrics have been seen in a defined
    # period of time.
    @staticmethod
    def epoch_update_totals(epoch_beginning):
        db = Db()
        db.connect()
        old_epoch_beginning = db.get_epoch_beginning()
        columns_to_update = set(list(FingerprintHelper.whorl_v1_names.keys()) + list(FingerprintHelper.whorl_v2_names.keys()))
        db.epoch_update_totals(
            old_epoch_beginning, epoch_beginning, columns_to_update, FingerprintHelper.md5_keys, FingerprintHelper.fingerprint_expansion_keys)

    # This is the 'nuclear option' for recalculating the epoch totals from
    # scratch, given a certain date.
    @staticmethod
    def epoch_calculate_totals(epoch_beginning):
        db = Db()
        db.connect()
        old_epoch_beginning = db.get_epoch_beginning()
        columns_to_update = set(list(FingerprintHelper.whorl_v1_names.keys()) + list(FingerprintHelper.whorl_v2_names.keys()))
        db.epoch_calculate_totals(
            old_epoch_beginning, epoch_beginning, columns_to_update, FingerprintHelper.md5_keys, FingerprintHelper.fingerprint_expansion_keys)

    # returns true if we think this browser/fingerprint combination hasn't
    # been counted before
    @staticmethod
    def _need_to_record(cookie, signatures, ip_addr, key):
        signature_v2 = signatures[1]['signature']

        db = Db()
        db.connect()
        if cookie:
            # okay, we have a cookie; check whether we've seen it with this
            # fingerprint before
            seen = db.count_sightings(cookie, signature_v2)
            write_cookie = cookie
        else:
            seen = 0  # always count cookieless browsers
            # we need to log the HMAC'd IP even if there's no cookie so use a
            # dummy
            write_cookie = 'no cookie'

        # now log the cookie, along with encrypted versions of the IP address
        # and a quarter-erased IP address, like the one Google keeps

        ip, google_style_ip = get_ip_hmacs(ip_addr, key)

        # We're only checking for signature_v1 to know whether we need to
        # record, but if multple whorl vesions are being calculated, we should
        # record all of them so that we can gracefully transition in the future
        for signature_dict in signatures:
            db.record_sighting(
                write_cookie, signature_dict['signature'], ip, google_style_ip)
        return seen == 0

    @staticmethod
    def _record_whorls(whorls, signatures):
        db = Db()
        db.connect()
        # actually update the fingerprint table...
        db.record_fingerprint(whorls, signatures, FingerprintHelper.fingerprint_expansion_keys)
        md5_whorls = FingerprintHelper.value_or_md5(whorls)
        db.update_totals(md5_whorls, signatures)
