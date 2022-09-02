import hashlib

import MySQLdb

import env_config as config


class Db(object):

    @staticmethod
    def epoch_prefix(epoched):
        if epoched:
            return 'epoch_'
        return ''

    def __init__(self):
        self.host = config.db_host
        self.username = config.db_username
        self.password = config.db_password
        self.database = config.db_database
        self.port = config.db_port

    def close(self):
        try:
            self.cxn.close()
        except AttributeError:
            # Connection not yet defined
            pass
        except MySQLDb.ProgrammingError:
            # Connection probably already closed
            pass

    def connect(self):
        self.cxn = MySQLdb.connect(
            host=self.host,
            user=self.username,
            passwd=self.password,
            db=self.database,
            port=self.port,
            charset='utf8')

    def create_database_info_table_if_not_exists(self):
        c = self.cxn.cursor()
        try:
            c.execute("""CREATE TABLE IF NOT EXISTS `database_info` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `key` varchar(255) NOT NULL DEFAULT '',
                `value` varchar(255) DEFAULT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY (`key`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8"""
            )
            self.cxn.commit()
        finally:
            c.close()

    def get_version(self):
        c = self.cxn.cursor()
        try:
            c.execute("""SELECT value FROM database_info WHERE `key`='version'""")
            version_res = c.fetchall()
            if len(version_res) == 0:
                return 0
            else:
                return int(version_res[0][0])
        finally:
            c.close()

    def set_version(self, version):
        c = self.cxn.cursor()
        try:
            c.execute("""REPLACE INTO database_info (`key`, `value`)
                VALUES ('version', %s)""", (str(version),))
            self.cxn.commit()
        finally:
            c.close()

    def migrate_to_3(self):
        c = self.cxn.cursor()
        c.execute("""CREATE TABLE `fingerprint_v3` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `fingerprint_id` int(11) NOT NULL,
            `loads_remote_fonts` varchar(10) DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY (`fingerprint_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8""");
        self.cxn.commit()

    def count_sightings(self, cookie, signature):
        c = self.cxn.cursor()
        try:
            c.execute("""SELECT COUNT(cookie_id) FROM cookies
                WHERE cookie_id=%s AND signature=%s""", (str(cookie), signature))
            return c.fetchone()[0]
        finally:
            c.close()

    def record_sighting(self, cookie, signature, ip, google_style_ip):
        c = self.cxn.cursor()
        try:
            c.execute("""INSERT INTO cookies SET
                cookie_id=%s,
                signature=%s,
                ip=UNHEX(%s),
                ip34=UNHEX(%s)""", (
                str(cookie),
                signature,
                ip,
                google_style_ip
            )
            )
            self.cxn.commit()
        finally:
            c.close()

    @staticmethod
    def _record_fingerprint_helper(c, whorls, version=False, fingerprint_id=0):
        exec_str = "INSERT INTO fingerprint"
        if version:
            exec_str += "_" + version
        exec_str += " SET "
        exec_str += ", ".join(map(lambda x: x + "=%s", whorls.keys()))
        if version:
            exec_str += ", fingerprint_id=" + str(fingerprint_id) + " ON DUPLICATE KEY UPDATE fingerprint_id=fingerprint_id"
        else:
            exec_str += " ON DUPLICATE KEY UPDATE count=count + 1"
        c.execute(exec_str, tuple(whorls.values()))

    def record_fingerprint(self, whorls, signatures, fingerprint_expansion_keys):
        c = self.cxn.cursor()
        try:
            all_expansion_keys = fingerprint_expansion_keys['v2'] + fingerprint_expansion_keys['v3']
            whorls_base = {k: v for k, v in whorls.items() if k not in all_expansion_keys}
            self._record_fingerprint_helper(c, whorls_base)
            fingerprint_id = c.lastrowid

            for version, keys in fingerprint_expansion_keys.items():
                whorls_expansion = {k: v for k, v in whorls.items() if k in keys}
                self._record_fingerprint_helper(c, whorls_expansion, version, fingerprint_id)

            c.execute(
                "INSERT INTO fingerprint_times SET fingerprint_id=%s", (fingerprint_id,))
            for signature_dict in signatures:
                c.execute("""INSERT INTO signatures SET
                    fingerprint_id=%s,
                    version=%s,
                    signature=%s
                    ON DUPLICATE KEY UPDATE signature=signature""", (
                        fingerprint_id,
                        str(signature_dict['version']),
                        signature_dict['signature']
                    )
                )
            self.cxn.commit()
        finally:
            c.close()

    def update_totals(self, whorls, signatures):
        c = self.cxn.cursor()
        try:
            update_str = """INSERT INTO totals SET
                total=1, epoch_total=1, variable=%s, value=%s
                ON DUPLICATE KEY UPDATE total=total+1, epoch_total=epoch_total+1"""
            c.execute(update_str, ('count', ''))
            for i in whorls:
                if i != "signature":
                    c.execute(update_str, (i, whorls[i]))
            for signature_dict in signatures:
                c.execute(update_str, ('signature', signature_dict['signature']))
            self.cxn.commit()
        finally:
            c.close()

    def get_whorl_value_count(self, variable, value, epoched):
        c = self.cxn.cursor()
        try:
            c.execute(
                "SELECT " + self.epoch_prefix(epoched) + "total FROM totals WHERE variable=%s AND value=%s", (variable, value))
            return c.fetchone()[0]
        finally:
            c.close()

    def get_total_count(self, epoched):
        c = self.cxn.cursor()
        try:
            c.execute("SELECT " + self.epoch_prefix(epoched) +
                      "total FROM totals WHERE variable='count'")
            return c.fetchone()[0]
        finally:
            c.close()

    def get_signature_matches_count(self, signature, epoched):
        c = self.cxn.cursor()
        try:
            c.execute(
                "SELECT " + self.epoch_prefix(epoched) + "total FROM totals WHERE variable='signature' AND value=%s", (signature, ))
            return c.fetchone()[0]
        finally:
            c.close()

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
        try:
            c.execute("""INSERT INTO `tracking_test` SET
                `cookie_id`=%s,
                `ip`=UNHEX(%s),
                `ip34`=UNHEX(%s),
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
        finally:
            c.close()

    def get_epoch_beginning(self):
        c = self.cxn.cursor()
        try:
            c.execute("""SELECT value
                FROM totals
                WHERE variable='epoch_beginning'""")
            res = c.fetchone()
        finally:
            c.close()

        if res == None:
            return None
        else:
            return res[0]

    def _epoch_total_helper(self, c, columns_to_update, columns_to_md5, fingerprint_expansion_keys, operation):
        if(operation != '+' and operation != '-'):
            return

        row = c.fetchone()
        while row != None:
            fingerprint_id = row[0]
            count = row[1]

            fingerprint_string = "SELECT " + ", ".join(columns_to_update) + " FROM fingerprint"
            for db_suffix in fingerprint_expansion_keys.keys():
                fingerprint_string += " LEFT JOIN fingerprint_" + db_suffix
                fingerprint_string += " ON fingerprint.id=fingerprint_" + db_suffix + ".fingerprint_id"
            fingerprint_string += " WHERE fingerprint.id=%s"

            fingerprint_c = self.cxn.cursor()
            try:
                fingerprint_c.execute(fingerprint_string, (fingerprint_id, ))
                fingerprint_row = fingerprint_c.fetchone()
            finally:
                fingerprint_c.close()

            if fingerprint_row != None:
                i = 0
                totals_c = self.cxn.cursor()
                for variable in columns_to_update:
                    if fingerprint_row[i] is not None:
                        if variable in columns_to_md5:
                            if isinstance(fingerprint_row[i], str):
                                value = hashlib.md5(fingerprint_row[i].encode('utf-8')).hexdigest()
                            else:
                                value = hashlib.md5(fingerprint_row[i]).hexdigest()
                        else:
                            value = fingerprint_row[i]
                        totals_c.execute(
                            """UPDATE totals SET epoch_total=epoch_total""" + operation + """%s
                            WHERE variable=%s AND value=%s""", (count, variable, value))
                    i += 1
                totals_c.execute(
                    """UPDATE totals SET epoch_total=epoch_total""" + operation + """%s
                    WHERE variable='count'""", (count,))

            signatures_c = self.cxn.cursor()
            try:
                signatures_c.execute("SELECT signature FROM signatures WHERE fingerprint_id=%s", (fingerprint_id, ))
                signatures_row = signatures_c.fetchone()
                while signatures_row != None:
                    signature_totals_c = self.cxn.cursor()
                    signature_totals_c.execute(
                        """UPDATE totals SET epoch_total=epoch_total""" + operation + """%s
                        WHERE variable='signature' AND value=%s""", (count, signatures_row[0]))
                    signatures_row = signatures_c.fetchone()
            finally:
                signatures_c.close()

            row = c.fetchone()

    def epoch_update_totals(self, old_epoch_beginning, new_epoch_beginning, columns_to_update, columns_to_md5, fingerprint_expansion_keys):
        c = self.cxn.cursor()
        try:
            if old_epoch_beginning == None:
                c.execute(
                    "INSERT INTO totals SET value=%s, variable='epoch_beginning'",
                    (new_epoch_beginning, ))
            else:
                c.execute("""SELECT fingerprint_id, count(id)
                          FROM fingerprint_times
                          WHERE timestamp BETWEEN %s AND %s GROUP BY fingerprint_id""",
                          (old_epoch_beginning, new_epoch_beginning))
                self._epoch_total_helper(c, columns_to_update, columns_to_md5, fingerprint_expansion_keys, '-')
                c.execute(
                    """UPDATE totals SET value=%s
                    WHERE variable='epoch_beginning'""", (new_epoch_beginning, ))
            self.cxn.commit()
        finally:
            c.close()

    def epoch_calculate_totals(self, old_epoch_beginning, new_epoch_beginning, columns_to_update, columns_to_md5, fingerprint_expansion_keys):
        c = self.cxn.cursor()

        try:
            if old_epoch_beginning == None:
                c.execute(
                    "INSERT INTO totals SET value=%s, variable='epoch_beginning'",
                    (new_epoch_beginning, ))
            else:
                c.execute(
                    """UPDATE totals SET value=%s
                    WHERE variable='epoch_beginning'""", (new_epoch_beginning, ))

            c.execute("UPDATE totals SET epoch_total=0 WHERE 1")
            c.execute("""SELECT fingerprint_id, count(id)
                      FROM fingerprint_times
                      WHERE timestamp > %s GROUP BY fingerprint_id""",
                      (new_epoch_beginning, ))
            self._epoch_total_helper(c, columns_to_update, columns_to_md5, fingerprint_expansion_keys, '+')
            self.cxn.commit()
        finally:
            c.close()
