<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class MailLocalStorage implements MailLocalStorageInterface
{
    public function has($msgid)
    {
        return isset($_SESSION['MOD.MAIL']['messages'][$msgid]);
    }

    public function get($msgid)
    {
        return isset($_SESSION['MOD.MAIL']['messages'][$msgid]) ? unserialize($_SESSION['MOD.MAIL']['messages'][$msgid]) : null;
    }

    public function set($msgid, IncomingMail $mail)
    {
        $_SESSION['MOD.MAIL']['messages'][$msgid] = serialize($mail);

        return $this;
    }
}
