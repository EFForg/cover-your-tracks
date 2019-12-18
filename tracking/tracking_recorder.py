from .tracking_helper import TrackingHelper
from util import get_ip_hmacs
from db import Db


class TrackingRecorder(object):

    @staticmethod
    def record_tracking_results(cookie, results, ip_addr, key):
        valid_print = {}
        for i in results:
            if i in TrackingHelper.valid_fields.keys():
                valid_print[i] = results[i]

        ip, google_style_ip = get_ip_hmacs(ip_addr, key)

        db = Db()
        db.connect()
        try:
            db.record_tracking_results(
                cookie,
                ip,
                google_style_ip,
                results['ad'],
                results['tracker'],
                results['dnt'],
                results['known_blockers'])
        finally:
            db.close()

        return True
