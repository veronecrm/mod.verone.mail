<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class MailboxMailLocalStorageMock implements MailLocalStorageInterface
{
    public function has($msgid)
    {
        return false;
    }

    public function get($msgid)
    {
        return null;
    }

    public function set($msgid, IncomingMail $mail)
    {
        return $this;
    }
}
