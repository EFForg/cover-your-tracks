import MySQLdb

import env_config as config


class Db(object):

    def __init__(self):
        self.host = config.db_host
        self.username = config.db_username
        self.password = config.db_password
        self.database = config.db_database
        self.port = config.db_port

    def connect(self):
        self.cxn = MySQLdb.connect(
            host=self.host,
            user=self.username,
            passwd=self.password,
            db=self.database,
            port=self.port)

    def count_sightings(self, cookie, signature):
        c = self.cxn.cursor()
        c.execute("""SELECT COUNT(cookie_id) FROM cookies
            WHERE cookie_id=%s AND signature=%s""", (str(cookie), signature))
        return c.fetchone()[0]

    def record_sighting(self, cookie, signature, ip, google_style_ip):
        c = self.cxn.cursor()
        c.execute("""INSERT INTO cookies SET
            cookie_id=%s,
            signature=%s,
            ip=%s,
            ip34=%s""", (
            str(cookie),
            signature,
            ip,
            google_style_ip
        )
        )
        self.cxn.commit()

    def record_fingerprint(self, whorls):
        c = self.cxn.cursor()
        exec_str = "INSERT INTO fingerprint SET "
        exec_str += ", ".join(map(lambda x: x + "=%s", whorls.keys()))
        exec_str += " ON DUPLICATE KEY UPDATE count=count + 1"
        c.execute(exec_str, tuple(whorls.values()))
        self.cxn.commit()

    def update_totals(self, whorls):
        c = self.cxn.cursor()
        update_str = "INSERT INTO totals SET total=1, variable=%s,value=%s ON DUPLICATE KEY UPDATE total=total+1"
        c.execute(update_str, ('count', ''))
        for i in whorls:
            c.execute(update_str, (i, whorls[i]))
        self.cxn.commit()

    def get_whorl_value_count(self, variable, value):
        c = self.cxn.cursor()
        c.execute(
            """SELECT total FROM totals WHERE variable=%s AND value=%s""", (variable, value))
        return c.fetchone()[0]

    def get_total_count(self):
        c = self.cxn.cursor()
        c.execute("""SELECT total FROM totals WHERE variable='count'""")
        return c.fetchone()[0]

    def get_signature_matches_count(self, signature):
        c = self.cxn.cursor()
        c.execute(
            """SELECT total FROM totals WHERE variable='signature' AND value=%s""", (signature, ))
        return c.fetchone()[0]

    def record_tracking_results(
            self,
            cookie,
            ip,
            google_style_ip,
            ad_result,
            tracker_result,
            dnt_result,
            known_blockers):
        c = self.cxn.cursor()
        c.execute("""INSERT INTO `tracking_test` SET
            `cookie_id`=%s,
            `ip`=%s,
            `ip34`=%s,
            `block_tracking_ads`=%s,
            `block_invisible_trackers`=%s,
            `dnt`=%s,
            `canvas_fingerprinting`=NULL,
            `known_blockers`=%s""", (
            str(cookie),
            ip,
            google_style_ip,
            ad_result,
            tracker_result,
            dnt_result,
            known_blockers
        )
        )
        self.cxn.commit()
