<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

interface MailLocalStorageInterface
{
    public function has($msgid);
    public function get($msgid);
    public function set($msgid, IncomingMail $mail);
}
