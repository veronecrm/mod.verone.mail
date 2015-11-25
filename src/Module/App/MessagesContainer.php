<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class MessagesContainer
{
    public $list = [];
    public $start;
    public $limit;
    public $pages;
    public $total;
    public $ids = [];

    public function getList()
    {
        return $this->list;
    }
}
