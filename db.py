import hashlib

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
        c.execute(
            "INSERT INTO fingerprint_times SET fingerprint_id=%s", (c.lastrowid,))
        self.cxn.commit()

    def update_totals(self, whorls):
        c = self.cxn.cursor()
        update_str = """INSERT INTO totals SET
            total=1, epoch_total=1, variable=%s, value=%s
            ON DUPLICATE KEY UPDATE total=total+1, epoch_total=epoch_total+1"""
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

    def get_epoch_beginning(self):
        c = self.cxn.cursor()
        c.execute("""SELECT value
            FROM totals
            WHERE variable='epoch_beginning'""")
        res = c.fetchone()
        if res == None:
            return None
        else:
            return res[0]

    def epoch_update_totals(self, old_epoch_beginning, new_epoch_beginning, columns_to_update, columns_to_md5):
        c = self.cxn.cursor()
        if old_epoch_beginning == None:
            c.execute(
                "INSERT INTO totals SET value=%s, variable='epoch_beginning'",
                (new_epoch_beginning, ))
        else:
            c.execute("""SELECT fingerprint_id, count(id)
                      FROM fingerprint_times
                      WHERE timestamp BETWEEN %s AND %s GROUP BY fingerprint_id""",
                      (old_epoch_beginning, new_epoch_beginning))
            row = c.fetchone()
            while row != None:
                fingerprint_id = row[0]
                count = row[1]
                fingerprint_c = self.cxn.cursor()
                fingerprint_c.execute(
                    "SELECT " + ", ".join(columns_to_update) +
                    " FROM fingerprint WHERE id=%s", (fingerprint_id, ))
                fingerprint_row = fingerprint_c.fetchone()
                i = 0
                totals_c = self.cxn.cursor()
                for variable in columns_to_update:
                    if variable in columns_to_md5:
                        value = hashlib.md5(fingerprint_row[i]).hexdigest()
                    else:
                        value = fingerprint_row[i]
                    i += 1
                    totals_c.execute(
                        """UPDATE totals SET epoch_total=epoch_total-%s
                        WHERE variable=%s AND value=%s""", (count, variable, value))
                totals_c.execute(
                    """UPDATE totals SET epoch_total=epoch_total-%s
                    WHERE variable='count'""", (count,))
                self.cxn.commit()
                row = c.fetchone()
            c.execute(
                """UPDATE totals SET value=%s
                WHERE variable='epoch_beginning'""", (new_epoch_beginning, ))
        self.cxn.commit()
