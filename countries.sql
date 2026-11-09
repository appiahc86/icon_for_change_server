-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 20, 2025 at 03:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ifc`
--

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `currency` varchar(8) DEFAULT NULL,
  `iso2` varchar(8) DEFAULT NULL,
  `iso3` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `currency`, `iso2`, `iso3`) VALUES
(1, 'Afghanistan', 'AFN', 'AF', 'AFG'),
(2, 'Åland Islands', 'EUR', 'AX', 'ALA'),
(3, 'Albania', 'ALL', 'AL', 'ALB'),
(4, 'Algeria', 'DZD', 'DZ', 'DZA'),
(5, 'American Samoa', 'USD', 'AS', 'ASM'),
(6, 'Andorra', 'EUR', 'AD', 'AND'),
(7, 'Angola', 'AOA', 'AO', 'AGO'),
(8, 'Anguilla', 'XCD', 'AI', 'AIA'),
(9, 'Antigua and Barbuda', 'XCD', 'AG', 'ATG'),
(10, 'Argentina', 'ARS', 'AR', 'ARG'),
(11, 'Armenia', 'AMD', 'AM', 'ARM'),
(12, 'Aruba', 'AWG', 'AW', 'ABW'),
(13, 'Australia', 'AUD', 'AU', 'AUS'),
(14, 'Austria', 'EUR', 'AT', 'AUT'),
(15, 'Azerbaijan', 'AZN', 'AZ', 'AZE'),
(16, 'Bahamas', 'BSD', 'BS', 'BHS'),
(17, 'Bahrain', 'BHD', 'BH', 'BHR'),
(18, 'Bangladesh', 'BDT', 'BD', 'BGD'),
(19, 'Barbados', 'BBD', 'BB', 'BRB'),
(20, 'Belarus', 'BYN', 'BY', 'BLR'),
(21, 'Belgium', 'EUR', 'BE', 'BEL'),
(22, 'Belize', 'BZD', 'BZ', 'BLZ'),
(23, 'Benin', 'XOF', 'BJ', 'BEN'),
(24, 'Bermuda', 'BMD', 'BM', 'BMU'),
(25, 'Bhutan', 'BTN', 'BT', 'BTN'),
(26, 'Bolivia', 'BOB', 'BO', 'BOL'),
(27, 'Bonaire, Sint Eustatius and Saba', 'USD', 'BQ', 'BES'),
(28, 'Bosnia and Herzegovina', 'BAM', 'BA', 'BIH'),
(29, 'Botswana', 'BWP', 'BW', 'BWA'),
(30, 'Bouvet Island', 'NOK', 'BV', 'BVT'),
(31, 'Brazil', 'BRL', 'BR', 'BRA'),
(32, 'British Indian Ocean Territory', 'USD', 'IO', 'IOT'),
(33, 'Brunei Darussalam', 'BND', 'BN', 'BRN'),
(34, 'Bulgaria', 'BGN', 'BG', 'BGR'),
(35, 'Burkina Faso', 'XOF', 'BF', 'BFA'),
(36, 'Burundi', 'BIF', 'BI', 'BDI'),
(37, 'Cabo Verde', 'CVE', 'CV', 'CPV'),
(38, 'Cambodia', 'KHR', 'KH', 'KHM'),
(39, 'Cameroon', 'XAF', 'CM', 'CMR'),
(40, 'Canada', 'CAD', 'CA', 'CAN'),
(41, 'Cayman Islands', 'KYD', 'KY', 'CYM'),
(42, 'Central African Republic', 'XAF', 'CF', 'CAF'),
(43, 'Chad', 'XAF', 'TD', 'TCD'),
(44, 'Chile', 'CLP', 'CL', 'CHL'),
(45, 'China', 'CNY', 'CN', 'CHN'),
(46, 'Christmas Island', 'AUD', 'CX', 'CXR'),
(47, 'Cocos (Keeling) Islands', 'AUD', 'CC', 'CCK'),
(48, 'Colombia', 'COP', 'CO', 'COL'),
(49, 'Comoros', 'KMF', 'KM', 'COM'),
(50, 'Congo (Republic of the)', 'XAF', 'CG', 'COG'),
(51, 'Congo (Democratic Republic of)', 'CDF', 'CD', 'COD'),
(52, 'Cook Islands', 'NZD', 'CK', 'COK'),
(53, 'Costa Rica', 'CRC', 'CR', 'CRI'),
(54, 'Côte d\'Ivoire', 'XOF', 'CI', 'CIV'),
(55, 'Croatia', 'HRK', 'HR', 'HRV'),
(56, 'Cuba', 'CUP', 'CU', 'CUB'),
(57, 'Curaçao', 'ANG', 'CW', 'CUW'),
(58, 'Cyprus', 'EUR', 'CY', 'CYP'),
(59, 'Czech Republic', 'CZK', 'CZ', 'CZE'),
(60, 'Denmark', 'DKK', 'DK', 'DNK'),
(61, 'Djibouti', 'DJF', 'DJ', 'DJI'),
(62, 'Dominica', 'XCD', 'DM', 'DMA'),
(63, 'Dominican Republic', 'DOP', 'DO', 'DOM'),
(64, 'Ecuador', 'USD', 'EC', 'ECU'),
(65, 'Egypt', 'EGP', 'EG', 'EGY'),
(66, 'El Salvador', 'USD', 'SV', 'SLV'),
(67, 'Equatorial Guinea', 'XAF', 'GQ', 'GNQ'),
(68, 'Eritrea', 'ERN', 'ER', 'ERI'),
(69, 'Estonia', 'EUR', 'EE', 'EST'),
(70, 'Eswatini (Swaziland)', 'SZL', 'SZ', 'SWZ'),
(71, 'Ethiopia', 'ETB', 'ET', 'ETH'),
(72, 'Falkland Islands (Malvinas)', 'FKP', 'FK', 'FLK'),
(73, 'Faroe Islands', 'DKK', 'FO', 'FRO'),
(74, 'Fiji', 'FJD', 'FJ', 'FJI'),
(75, 'Finland', 'EUR', 'FI', 'FIN'),
(76, 'France', 'EUR', 'FR', 'FRA'),
(77, 'French Guiana', 'EUR', 'GF', 'GUF'),
(78, 'French Polynesia', 'XPF', 'PF', 'PYF'),
(79, 'French Southern Territories', 'EUR', 'TF', 'ATF'),
(80, 'Gabon', 'XAF', 'GA', 'GAB'),
(81, 'Gambia', 'GMD', 'GM', 'GMB'),
(82, 'Georgia', 'GEL', 'GE', 'GEO'),
(83, 'Germany', 'EUR', 'DE', 'DEU'),
(84, 'Ghana', 'GHS', 'GH', 'GHA'),
(85, 'Gibraltar', 'GIP', 'GI', 'GIB'),
(86, 'Greece', 'EUR', 'GR', 'GRC'),
(87, 'Greenland', 'DKK', 'GL', 'GRL'),
(88, 'Grenada', 'XCD', 'GD', 'GRD'),
(89, 'Guadeloupe', 'EUR', 'GP', 'GLP'),
(90, 'Guam', 'USD', 'GU', 'GUM'),
(91, 'Guatemala', 'GTQ', 'GT', 'GTM'),
(92, 'Guernsey', 'GBP', 'GG', 'GGY'),
(93, 'Guinea', 'GNF', 'GN', 'GIN'),
(94, 'Guinea-Bissau', 'XOF', 'GW', 'GNB'),
(95, 'Guyana', 'GYD', 'GY', 'GUY'),
(96, 'Haiti', 'HTG', 'HT', 'HTI'),
(97, 'Heard Island and McDonald Islands', 'AUD', 'HM', 'HMD'),
(98, 'Holy See', 'EUR', 'VA', 'VAT'),
(99, 'Honduras', 'HNL', 'HN', 'HND'),
(100, 'Hong Kong', 'HKD', 'HK', 'HKG'),
(101, 'Hungary', 'HUF', 'HU', 'HUN'),
(102, 'Iceland', 'ISK', 'IS', 'ISL'),
(103, 'India', 'INR', 'IN', 'IND'),
(104, 'Indonesia', 'IDR', 'ID', 'IDN'),
(105, 'Iran', 'IRR', 'IR', 'IRN'),
(106, 'Iraq', 'IQD', 'IQ', 'IRQ'),
(107, 'Ireland', 'EUR', 'IE', 'IRL'),
(108, 'Isle of Man', 'GBP', 'IM', 'IMN'),
(109, 'Israel', 'ILS', 'IL', 'ISR'),
(110, 'Italy', 'EUR', 'IT', 'ITA'),
(111, 'Jamaica', 'JMD', 'JM', 'JAM'),
(112, 'Japan', 'JPY', 'JP', 'JPN'),
(113, 'Jersey', 'GBP', 'JE', 'JEY'),
(114, 'Jordan', 'JOD', 'JO', 'JOR'),
(115, 'Kazakhstan', 'KZT', 'KZ', 'KAZ'),
(116, 'Kenya', 'KES', 'KE', 'KEN'),
(117, 'Kiribati', 'AUD', 'KI', 'KIR'),
(118, 'Korea (North)', 'KPW', 'KP', 'PRK'),
(119, 'Korea (South)', 'KRW', 'KR', 'KOR'),
(120, 'Kuwait', 'KWD', 'KW', 'KWT'),
(121, 'Kyrgyzstan', 'KGS', 'KG', 'KGZ'),
(122, 'Laos', 'LAK', 'LA', 'LAO'),
(123, 'Latvia', 'EUR', 'LV', 'LVA'),
(124, 'Lebanon', 'LBP', 'LB', 'LBN'),
(125, 'Lesotho', 'LSL', 'LS', 'LSO'),
(126, 'Liberia', 'LRD', 'LR', 'LBR'),
(127, 'Libya', 'LYD', 'LY', 'LBY'),
(128, 'Liechtenstein', 'CHF', 'LI', 'LIE'),
(129, 'Lithuania', 'EUR', 'LT', 'LTU'),
(130, 'Luxembourg', 'EUR', 'LU', 'LUX'),
(131, 'Macao', 'MOP', 'MO', 'MAC'),
(132, 'Madagascar', 'MGA', 'MG', 'MDG'),
(133, 'Malawi', 'MWK', 'MW', 'MWI'),
(134, 'Malaysia', 'MYR', 'MY', 'MYS'),
(135, 'Maldives', 'MVR', 'MV', 'MDV'),
(136, 'Mali', 'XOF', 'ML', 'MLI'),
(137, 'Malta', 'EUR', 'MT', 'MLT'),
(138, 'Marshall Islands', 'USD', 'MH', 'MHL'),
(139, 'Martinique', 'EUR', 'MQ', 'MTQ'),
(140, 'Mauritania', 'MRU', 'MR', 'MRT'),
(141, 'Mauritius', 'MUR', 'MU', 'MUS'),
(142, 'Mayotte', 'EUR', 'YT', 'MYT'),
(143, 'Mexico', 'MXN', 'MX', 'MEX'),
(144, 'Micronesia (Federated States of)', 'USD', 'FM', 'FSM'),
(145, 'Moldova', 'MDL', 'MD', 'MDA'),
(146, 'Monaco', 'EUR', 'MC', 'MCO'),
(147, 'Mongolia', 'MNT', 'MN', 'MNG'),
(148, 'Montenegro', 'EUR', 'ME', 'MNE'),
(149, 'Montserrat', 'XCD', 'MS', 'MSR'),
(150, 'Morocco', 'MAD', 'MA', 'MAR'),
(151, 'Mozambique', 'MZN', 'MZ', 'MOZ'),
(152, 'Myanmar', 'MMK', 'MM', 'MMR'),
(153, 'Namibia', 'NAD', 'NA', 'NAM'),
(154, 'Nauru', 'AUD', 'NR', 'NRU'),
(155, 'Nepal', 'NPR', 'NP', 'NPL'),
(156, 'Netherlands', 'EUR', 'NL', 'NLD'),
(157, 'New Caledonia', 'XPF', 'NC', 'NCL'),
(158, 'New Zealand', 'NZD', 'NZ', 'NZL'),
(159, 'Nicaragua', 'NIO', 'NI', 'NIC'),
(160, 'Niger', 'XOF', 'NE', 'NER'),
(161, 'Nigeria', 'NGN', 'NG', 'NGA'),
(162, 'Niue', 'NZD', 'NU', 'NIU'),
(163, 'Norfolk Island', 'AUD', 'NF', 'NFK'),
(164, 'North Macedonia', 'MKD', 'MK', 'MKD'),
(165, 'Northern Mariana Islands', 'USD', 'MP', 'MNP'),
(166, 'Norway', 'NOK', 'NO', 'NOR'),
(167, 'Oman', 'OMR', 'OM', 'OMN'),
(168, 'Pakistan', 'PKR', 'PK', 'PAK'),
(169, 'Palau', 'USD', 'PW', 'PLW'),
(170, 'Palestine, State of', 'ILS', 'PS', 'PSE'),
(171, 'Panama', 'PAB', 'PA', 'PAN'),
(172, 'Papua New Guinea', 'PGK', 'PG', 'PNG'),
(173, 'Paraguay', 'PYG', 'PY', 'PRY'),
(174, 'Peru', 'PEN', 'PE', 'PER'),
(175, 'Philippines', 'PHP', 'PH', 'PHL'),
(176, 'Pitcairn', 'NZD', 'PN', 'PCN'),
(177, 'Poland', 'PLN', 'PL', 'POL'),
(178, 'Portugal', 'EUR', 'PT', 'PRT'),
(179, 'Puerto Rico', 'USD', 'PR', 'PRI'),
(180, 'Qatar', 'QAR', 'QA', 'QAT'),
(181, 'Réunion', 'EUR', 'RE', 'REU'),
(182, 'Romania', 'RON', 'RO', 'ROU'),
(183, 'Russian Federation', 'RUB', 'RU', 'RUS'),
(184, 'Rwanda', 'RWF', 'RW', 'RWA'),
(185, 'Saint Barthélemy', 'EUR', 'BL', 'BLM'),
(186, 'Saint Helena, Ascension and Tristan da Cunha', 'SHP', 'SH', 'SHN'),
(187, 'Saint Kitts and Nevis', 'XCD', 'KN', 'KNA'),
(188, 'Saint Lucia', 'XCD', 'LC', 'LCA'),
(189, 'Saint Martin (French part)', 'EUR', 'MF', 'MAF'),
(190, 'Saint Pierre and Miquelon', 'EUR', 'PM', 'SPM'),
(191, 'Saint Vincent and the Grenadines', 'XCD', 'VC', 'VCT'),
(192, 'Samoa', 'WST', 'WS', 'WSM'),
(193, 'San Marino', 'EUR', 'SM', 'SMR'),
(194, 'Sao Tome and Principe', 'STN', 'ST', 'STP'),
(195, 'Saudi Arabia', 'SAR', 'SA', 'SAU'),
(196, 'Senegal', 'XOF', 'SN', 'SEN'),
(197, 'Serbia', 'RSD', 'RS', 'SRB'),
(198, 'Seychelles', 'SCR', 'SC', 'SYC'),
(199, 'Sierra Leone', 'SLL', 'SL', 'SLE'),
(200, 'Singapore', 'SGD', 'SG', 'SGP'),
(201, 'Sint Maarten (Dutch part)', 'ANG', 'SX', 'SXM'),
(202, 'Slovakia', 'EUR', 'SK', 'SVK'),
(203, 'Slovenia', 'EUR', 'SI', 'SVN'),
(204, 'Solomon Islands', 'SBD', 'SB', 'SLB'),
(205, 'Somalia', 'SOS', 'SO', 'SOM'),
(206, 'South Africa', 'ZAR', 'ZA', 'ZAF'),
(207, 'South Georgia & the South Sandwich Islands', 'GBP', 'GS', 'SGS'),
(208, 'South Sudan', 'SSP', 'SS', 'SSD'),
(209, 'Spain', 'EUR', 'ES', 'ESP'),
(210, 'Sri Lanka', 'LKR', 'LK', 'LKA'),
(211, 'Sudan', 'SDG', 'SD', 'SDN'),
(212, 'Suriname', 'SRD', 'SR', 'SUR'),
(213, 'Svalbard & Jan Mayen', 'NOK', 'SJ', 'SJM'),
(214, 'Sweden', 'SEK', 'SE', 'SWE'),
(215, 'Switzerland', 'CHF', 'CH', 'CHE'),
(216, 'Syrian Arab Republic', 'SYP', 'SY', 'SYR'),
(217, 'Taiwan', 'TWD', 'TW', 'TWN'),
(218, 'Tajikistan', 'TJS', 'TJ', 'TJK'),
(219, 'Tanzania', 'TZS', 'TZ', 'TZA'),
(220, 'Thailand', 'THB', 'TH', 'THA'),
(221, 'Timor‑Leste', 'USD', 'TL', 'TLS'),
(222, 'Togo', 'XOF', 'TG', 'TGO'),
(223, 'Tokelau', 'NZD', 'TK', 'TKL'),
(224, 'Tonga', 'TOP', 'TO', 'TON'),
(225, 'Trinidad and Tobago', 'TTD', 'TT', 'TTO'),
(226, 'Tunisia', 'TND', 'TN', 'TUN'),
(227, 'Turkey', 'TRY', 'TR', 'TUR'),
(228, 'Turkmenistan', 'TMT', 'TM', 'TKM'),
(229, 'Turks and Caicos Islands', 'USD', 'TC', 'TCA'),
(230, 'Tuvalu', 'AUD', 'TV', 'TUV'),
(231, 'Uganda', 'UGX', 'UG', 'UGA'),
(232, 'Ukraine', 'UAH', 'UA', 'UKR'),
(233, 'United Arab Emirates', 'AED', 'AE', 'ARE'),
(234, 'United Kingdom', 'GBP', 'GB', 'GBR'),
(235, 'United States of America', 'USD', 'US', 'USA'),
(236, 'Uruguay', 'UYU', 'UY', 'URY'),
(237, 'Uzbekistan', 'UZS', 'UZ', 'UZB'),
(238, 'Vanuatu', 'VUV', 'VU', 'VUT'),
(239, 'Venezuela (Bolivarian Republic of)', 'VES', 'VE', 'VEN'),
(240, 'Viet Nam', 'VND', 'VN', 'VNM'),
(241, 'Western Sahara', 'MAD', 'EH', 'ESH'),
(242, 'Yemen', 'YER', 'YE', 'YEM'),
(243, 'Zambia', 'ZMW', 'ZM', 'ZMB'),
(244, 'Zimbabwe', 'ZWL', 'ZW', 'ZWE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=245;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
