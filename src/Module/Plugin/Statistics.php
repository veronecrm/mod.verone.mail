<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Plugin;

use CRM\App\Module\Plugin;

class Statistics extends Plugin
{
    public function tabs()
    {
        return [
            [
                'ordering'  => 10,
                'icon'      => 'fa fa-envelope',
                'icon-type' => 'class',
                'name'      => $this->t('mailMail'),
                'tab'       => 'mail',
                'module'    => 'Mail'
            ]
        ];
    }

    public function contents($tab)
    {
        return $this->get('templating.engine')->render('index.Statistics.Mail', [
            'groups' => $this->get('mod.mail.chartData')->getDataByUsersGroups(),
            'users'  => $this->get('mod.mail.chartData')->getDataByUsers()
        ]);
    }
}
