import json
import hashlib
from time import time

from db import Db
from .fingerprint_helper import FingerprintHelper
from util import get_ip_hmacs


class FingerprintRecorder(object):

    @classmethod
    def record_fingerprint(cls, whorls, cookie, ip_addr, key):
        # ensure no rogue values have been entered
        valid_vars = list(FingerprintHelper.whorl_names.keys())
        valid_vars.append('signature')

        sorted_whorls = sorted(whorls.items())
        serialized_whorls = json.dumps(sorted_whorls)
        signature = hashlib.md5(serialized_whorls.encode("utf-8")).hexdigest()
        whorls['signature'] = signature

        valid_print = {}
        for i in whorls:
            if i in valid_vars:
                valid_print[i] = whorls[i]

        if cls._need_to_record(cookie, signature, ip_addr, key):
            cls._record_whorls(valid_print)

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
        columns_to_update = FingerprintHelper.whorl_names.keys()
        columns_to_update.append('signature')
        db.epoch_update_totals(
            old_epoch_beginning, epoch_beginning, columns_to_update, FingerprintHelper.md5_keys)

    # This is the 'nuclear option' for recalculating the epoch totals from
    # scratch, given a certain date.
    @staticmethod
    def epoch_calculate_totals(epoch_beginning):
        db = Db()
        db.connect()
        old_epoch_beginning = db.get_epoch_beginning()
        columns_to_update = FingerprintHelper.whorl_names.keys()
        columns_to_update.append('signature')
        db.epoch_calculate_totals(
            old_epoch_beginning, epoch_beginning, columns_to_update, FingerprintHelper.md5_keys)

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
