from math import log

from fingerprint import FingerprintHelper
from db import Db
import env_config as config


class EntropyHelper(object):

    @classmethod
    def calculate_values(cls, whorls, whorl_names):
        # calculate metrics for a high level summary of identifying information
        # for each whorl
        counts, total, matching = cls._fetch_counts(whorls, whorl_names)
        bits, group = cls._entropy_overview(total, matching)

        uniqueness = {}
        for i in whorl_names:
            # MEASURE 1: how identifying is this fact about a browser if it's
            # the only thing one knows about the browser?
            matching_whorl = counts[i]
            uniqueness[i] = {
                'bits': round(-log(matching_whorl / float(total), 2), 2),
                'one_in_x': round(float(total) / matching_whorl, 2)
            }

        return counts, total, matching, bits, group, uniqueness

    @staticmethod
    def size_words(total):
        if total > 1000000:
            return "several million"
        elif total > 100000:
            return "several hundred thousand"
        elif total > 10000:
            return "about ten thousand"
        elif total >= 1000:
            return "several thousand"
        else:
            return "under a thousand"

    @staticmethod
    def single_whorl_uniqueness(whorl_name, whorl_value):
        db = Db()
        db.connect()

        md5_whorl_value = FingerprintHelper.value_or_md5(
            {whorl_name: whorl_value})[whorl_name]

        try:
            try:
                count = db.get_whorl_value_count(
                    whorl_name, md5_whorl_value, config.epoched)
            except TypeError:
                return {'status': "Error: that value has not yet been recorded for '" + whorl_name + "'"}

            if count == 0:
                return {'status': "Error: that value has not been recorded recently for '" + whorl_name + "'"}

            total = db.get_total_count(config.epoched)
        finally:
            db.close()

        uniqueness = {
            'bits': round(-log(count / float(total), 2), 2),
            'one_in_x': round(float(total) / count, 2)
        }

        return uniqueness

    @staticmethod
    def _fetch_counts(whorls, whorl_names):
        db = Db()
        db.connect()

        # result dict. 'total' is the total number of entries, 'sig_matches' is
        # the number matching signature in whorls, other keys are variables in
        # signature.
        counts = {}

        # query an incrementally updated totals table which has an index on
        # unique (variable, value)
        md5_whorls = FingerprintHelper.value_or_md5(whorls)
        try:
            for i in whorl_names:
                counts[i] = db.get_whorl_value_count(i, md5_whorls[i], config.epoched)

            total = db.get_total_count(config.epoched)

            matching = db.get_signature_matches_count(
                whorls['signature'], config.epoched)
        finally:
            db.close()

        return counts, total, matching

    @staticmethod
    def _entropy_overview(total, matching):
        # get the overal identifying information measure, and some other
        # hopefully informative stuff, for the user
        bits = round(-log(matching / float(total), 2), 2)
        group = round(float(total) / matching, 2)
        return bits, group
