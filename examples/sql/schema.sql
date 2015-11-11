--
-- Table structure for table `cookies`
--

DROP TABLE IF EXISTS `cookies`;
CREATE TABLE `cookies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cookie_id` varchar(255) DEFAULT NULL,
  `signature` varchar(32) DEFAULT NULL,
  `ip` varbinary(16) DEFAULT NULL,
  `ip34` varbinary(16) DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cookie_id` (`cookie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `fingerprint`
--

DROP TABLE IF EXISTS `fingerprint`;
CREATE TABLE `fingerprint` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `js` tinyint(4) NOT NULL DEFAULT '0',
  `cookie_enabled` varchar(10) DEFAULT 'unknown',
  `user_agent` blob NOT NULL,
  `http_accept` blob NOT NULL,
  `plugins` blob,
  `fonts` blob,
  `timezone` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `signature` varchar(32) NOT NULL DEFAULT '',
  `count` int(11) NOT NULL DEFAULT '1',
  `supercookies` varchar(255) DEFAULT NULL,
  `ua_h` char(32) DEFAULT NULL,
  `ft_h` char(32) DEFAULT NULL,
  `ha_h` char(32) DEFAULT NULL,
  `pi_h` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`signature`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `totals`
--

DROP TABLE IF EXISTS `totals`;
CREATE TABLE `totals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variable` varchar(32) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL DEFAULT '',
  `total` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `variable` (`variable`,`value`(32))
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `tracking_test`
--

DROP TABLE IF EXISTS `tracking_test`;
CREATE TABLE `tracking_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cookie_id` varchar(255) DEFAULT NULL,
  `ip` varbinary(16) DEFAULT NULL,
  `ip34` varbinary(16) DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `block_tracking_ads` enum('yes','no','partial') NOT NULL DEFAULT 'no',
  `block_invisible_trackers` enum('yes','no','partial') NOT NULL DEFAULT 'no',
  `dnt` enum('yes','no') NOT NULL DEFAULT 'no',
  `canvas_fingerprinting` enum('yes','no') DEFAULT NULL,
  `known_blockers` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `cookie_id` (`cookie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
