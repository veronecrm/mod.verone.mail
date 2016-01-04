<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\ORM;

use CRM\ORM\Repository;

class SentMailRepository extends Repository
{
    public $dbTable = '#__mail_sent';
}
