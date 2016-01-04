<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Controller;

use CRM\App\Controller\BaseController;

class Settings extends BaseController
{
    public function updateSizesAction($request)
    {
        $settings = $this->openSettings('user');

        if($request->request->has('messages'))
        {
            $settings->set('mod.mail.app.layout.size.messages', $request->request->get('messages'));
        }

        if($request->request->has('accounts'))
        {
            $settings->set('mod.mail.app.layout.size.accounts', $request->request->get('accounts'));
        }

        return $this->responseAJAX([
            'status' => 'success'
        ]);
    }
}
