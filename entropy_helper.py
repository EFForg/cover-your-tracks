from math import log

from fingerprint_recorder import FingerprintRecorder
from db import Db


class EntropyHelper(object):

    @classmethod
    def calculate_values(cls, whorls):
        # calculate metrics for a high level summary of identifying information
        # for each whorl
        counts, total, matching = cls._fetch_counts(whorls)
        bits, group = cls._entropy_overview(total, matching)

        uniqueness = {}
        for i in FingerprintRecorder.whorl_names:
            # MEASURE 1: how identifying is this fact about a browser if it's
            # the only thing one knows about the browser?
            matching_whorl = counts[i]
            uniqueness[i] = {
                'bits': round(-log(matching_whorl / float(total), 2), 2),
                'one_in_x': round(float(total) / matching_whorl, 2)
            }

        return counts, total, matching, bits, group, uniqueness

    @staticmethod
    def _fetch_counts(whorls):
        db = Db()
        db.connect()

        # result dict. 'total' is the total number of entries, 'sig_matches' is
        # the number matching signature in whorls, other keys are variables in
        # signature.
        counts = {}

        # query an incrementally updated totals table which has an index on
        # unique (variable, value)
        md5_whorls = FingerprintRecorder.value_or_md5(whorls)
        for i in FingerprintRecorder.whorl_names:
            counts[i] = db.get_whorl_value_count(i, md5_whorls[i])

        total = db.get_total_count()

        matching = db.get_signature_matches_count(whorls['signature'])

        return counts, total, matching

    @staticmethod
    def _entropy_overview(total, matching):
        # get the overal identifying information measure, and some other
        # hopefully informative stuff, for the user
        print matching
        print total
        bits = round(-log(matching / float(total), 2), 2)
        group = float(total) / matching
        return bits, group
