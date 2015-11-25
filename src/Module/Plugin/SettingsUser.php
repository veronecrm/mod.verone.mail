<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Plugin;

use CRM\App\Module\Plugin;

class SettingsUser extends Plugin
{
    public function tabs()
    {
        return [
            [
                'ordering'  => 100,
                'icon'      => 'fa fa-envelope',
                'icon-type' => 'class',
                'name'      => $this->t('mailMail'),
                'tab'       => 'main',
                'module'    => 'Mail'
            ]
        ];
    }

    public function contents($tab)
    {
        return $this->get('templating.engine')->render('user.SettingsUser.Mail', [
            'settingsUser' => $this->openSettings('user')
        ]);
    }

    public function update($tab, $request)
    {
        $user = $this->openSettings('user');
        $user->set('mod.mail.message.signature', $request->get('mail_signature'));
        $user->set('mod.mail.app.layout.type', $request->get('mail_layout_type'));
        $user->set('mod.mail.app.message.perpage', $request->get('mod_mail_app_message_perpage'));
    }
}
