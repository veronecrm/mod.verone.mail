CREATE TABLE IF NOT EXISTS `#__mail_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `senderName` varchar(127) COLLATE utf8_unicode_ci NOT NULL,
  `imapHost` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imapUsername` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imapPassword` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imapPort` smallint(6) NOT NULL,
  `imapProtocol` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `imapSecurity` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `imapCertificateValidation` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `smtpHost` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `smtpPort` mediumint(9) NOT NULL,
  `smtpUsername` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `smtpPassword` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `smtpSecurity` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `refreshTime` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
