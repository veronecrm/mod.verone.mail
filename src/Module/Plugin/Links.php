<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Plugin;

use CRM\App\Module\Plugin;

class Links extends Plugin
{
    public function mainMenu()
    {
        return [
            [
                'ordering' => 1,
                'name'  => $this->t('mailMail'),
                'href'   => $this->createUrl('Mail', 'Mail', 'index'),
                'icon-type' => 'class',
                'icon' => 'fa fa-envelope',
                'module' => 'Mail'
            ]
        ];
    }
}
