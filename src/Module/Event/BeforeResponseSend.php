<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Event;

use CRM\Base;

class BeforeResponseSend extends Base
{
    public function onBeforeResponseSend()
    {
        $route = $this->get('routing')->getRoute();

        if($route->getModule() == 'Mail' && $route->getModule() == 'Mail' && $route->getAction() == 'iframeEmpty')
        {
            $this->get('response')->headers
                ->remove('X-Frame-Options')
                ->remove('X-Content-Type-Options')
                ->remove('X-XSS-Protection');
        }
    }
}
