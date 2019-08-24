
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sp_proxy
-- ----------------------------
DROP TABLE IF EXISTS `sp_proxy`;
CREATE TABLE `sp_proxy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(32) NOT NULL,
  `port` int(6) NOT NULL,
  `type` varchar(16) DEFAULT NULL,
  `anonymous` int(11) DEFAULT NULL,
  `available` int(11) DEFAULT NULL,
  `valid_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sp_proxy_unique` (`ip`,`port`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;
