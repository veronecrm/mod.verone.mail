<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Plugin;

use CRM\App\Module\Plugin;

class SettingsGlob extends Plugin
{
    public function tabs()
    {
        return [
            [
                'ordering'  => 10,
                'icon'      => 'fa fa-envelope',
                'icon-type' => 'class',
                'name'      => $this->t('modNameMail'),
                'tab'       => 'mail',
                'module'    => 'Mail'
            ]
        ];
    }

    public function contents($tab)
    {
        return $this->get('templating.engine')->render('index.SettingsGlob.Mail', [
            'settings' => $this->openSettings('app')
        ]);
    }

    public function update($tab, $request)
    {
        $this->openSettings('app')->set('mod.mail.stat.savesentmailsinfo', $request->get('mod_mail_stat_savesentmailsinfo'));
    }
}
