<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\ORM;

use CRM\ORM\Repository;
use App\Module\Mail\App\IncomingMail;

class AccountRepository extends Repository
{
    public $dbTable = '#__mail_account';

    public function all()
    {
        return parent::selectQuery('SELECT * FROM '.$this->dbTable.' WHERE owner = '.$this->user()->getId());
    }

    public function findAll($conditions = '', array $binds = [], $start = null, $limit = null)
    {
        $result = [];

        foreach(parent::findAll($conditions, $binds, $start, $limit) as $account)
        {
            if($account->getOwner() == $this->user()->getId())
            {
                $result[] = $account;
            }
        }

        return $result;
    }

    public function find($id)
    {
        $account = parent::find($id);

        if($account && $account->getOwner() == $this->user()->getId())
        {
            return $account;
        }
        else
        {
            return false;
        }
    }

    public function getRelated(IncomingMail $message)
    {
        $repoContractor = $this->repo('Contractor', 'Contractor');
        $repoContact    = $this->repo('Contact', 'Contractor');

        $emails = array_merge(
            array_keys($message->to),
            array_keys($message->cc),
            array_keys($message->replyTo),
            [$message->fromAddress]
        );

        $list = [];

        foreach(array_unique($emails) as $key => $val)
        {
            foreach($repoContractor->findAllByEmail($val) as $item)
            {
                $details = $repoContractor->getBussinessCardDetails($item);
                $details->editURL = $this->createUrl('Contractor', 'Contractor', 'summary', ['id' => $item->getId()]);

                $list[] = $details;
            }

            foreach($repoContact->findAllByEmail($val) as $item)
            {
                $details = $repoContact->getBussinessCardDetails($item);
                $details->editURL = $this->createUrl('Contractor', 'Contact', 'edit', ['id' => $item->getId()]);

                $list[] = $details;
            }
        }

        return $list;
    }

    public function formatBytes($bytes, $precision = 2) 
    { 
        $units = array('b', 'kB', 'MB', 'GB', 'TB'); 

        $bytes = max($bytes, 0); 
        $pow   = floor(($bytes ? log($bytes) : 0) / log(1024)); 
        $pow   = min($pow, count($units) - 1); 

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision).' '.$units[$pow]; 
    } 
}
