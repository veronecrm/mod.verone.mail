<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class IMAP
{
    private $username;
    private $password;

    private $host;
    private $type = 'imap';
    private $port = '993';
    private $security;
    private $validateCertificate;

    private $baseMailbox;

    private $connection;

    private $trashBoxName;
    private $sentBoxName;

    public $serverEncoding = 'utf-8';

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function getConnection()
    {
        return $this->connection;
    }

    public function getBaseMailbox()
    {
        return $this->baseMailbox;
    }

    public function setHost($host)
    {
        $this->host = $host;

        return $this;
    }

    public function setPort($port)
    {
        $this->port = $port;

        return $this;
    }

    public function setSecurity($security)
    {
        $this->security = $security;

        return $this;
    }

    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    public function setValidateCertificate($validateCertificate)
    {
        $this->validateCertificate = $validateCertificate;

        return $this;
    }

    public function open()
    {
        $this->baseMailbox = '{'.$this->host.':'.$this->port.'/'.$this->type;

        if(in_array($this->security, [ 'ssl', 'tls' ]))
        {
            $this->baseMailbox .= '/'.$this->security;
        }

        if($this->validateCertificate !== null)
        {
            if($this->validateCertificate)
            {
                $this->baseMailbox .= '/validate-cert';
            }
            else
            {
                $this->baseMailbox .= '/novalidate-cert';
            }
        }

        $this->baseMailbox .= '}INBOX';

        imap_timeout(IMAP_OPENTIMEOUT, 3);
        imap_timeout(IMAP_READTIMEOUT, 3);
        imap_timeout(IMAP_WRITETIMEOUT, 3);
        imap_timeout(IMAP_CLOSETIMEOUT, 3);
        ini_set('default_socket_timeout', 3);

        //error_reporting(0);
        $this->connection = imap_open($this->baseMailbox, $this->username, $this->password, 0, 1);
        /*if(! $this->connection)
        {
            var_dump($this->baseMailbox);
        }*/
        //error_reporting(-1);

        return ! $this->connection;
    }

    public function reopen($mailbox, $fullyReopen = null)
    {
        if(! $fullyReopen)
        {
            $mailbox = str_replace('INBOX', '', $this->baseMailbox).$mailbox;
        }

        //error_reporting(0);
        $result = imap_reopen($this->connection, $mailbox, 0, 1) == false ? false : $mailbox;
        //error_reporting(-1);

        return $result;
    }

    public function close()
    {
        imap_close($this->connection);
    }

    public function getErrors()
    {
        return imap_errors();
    }

    public function getBoxesList(array $defaultNames = [], $withDetails = false)
    {
        $result = imap_getmailboxes($this->connection, str_replace('INBOX', '', $this->baseMailbox), '*');
        $return = [];

        foreach($result as $key => $box)
        {
            $boxName = imap_utf8($box->name);
            $boxName = $box->name;

            $originalName = str_replace(str_replace('INBOX', '', $this->baseMailbox), '', $boxName);
            $name         = trim($originalName == 'INBOX' ? $originalName : str_replace('INBOX', '', $originalName), $box->delimiter);

            foreach($defaultNames as $from => $to)
            {
                if(strpos($name, $from) !== false)
                {
                    $name = $to;
                    break;
                }
            }

            $return[$key] = [ 'id' => $originalName, 'name' => $name ];

            if($withDetails)
            {
                $return[$key]['status'] = $this->openBox($originalName)->getStatus();
            }
        }

        /**
         * We sorting global ordering:
         *   Inbox
         *   Sent
         *   Drafts
         *   Junk
         *   Trash
         *   Other boxes
         */
        $sortedResult = [];
        $index = 5;

        foreach($return as $key => $val)
        {
            if(strpos($val['id'], 'Trash') !== false && ! isset($sortedResult[4]))
            {
                $sortedResult[4] = $val;
                $sortedResult[4]['type'] = 'trash';

                $this->setTrashBoxName($val['id']);
            }
            elseif(strpos($val['id'], 'Junk') !== false && ! isset($sortedResult[3]))
            {
                $sortedResult[3] = $val;
                $sortedResult[3]['type'] = 'spam';
            }
            elseif(strpos($val['id'], 'Drafts') !== false && ! isset($sortedResult[2]))
            {
                $sortedResult[2] = $val;
                $sortedResult[2]['type'] = 'drafts';
            }
            elseif(strpos($val['id'], 'Sent') !== false && ! isset($sortedResult[1]))
            {
                $sortedResult[1] = $val;
                $sortedResult[1]['type'] = 'sent';

                $this->setSentBoxName($val['id']);
            }
            elseif(strpos($val['id'], 'Spam') !== false && ! isset($sortedResult[5]))
            {
                $sortedResult[5] = $val;
                $sortedResult[5]['type'] = 'spam';
            }
            elseif(strpos($val['id'], 'INBOX') !== false && ! isset($sortedResult[0]))
            {
                $sortedResult[0] = $val;
                $sortedResult[0]['type'] = 'inbox';
            }
            else
            {
                $val['name'] = iconv('UTF-7', 'UTF-8', preg_replace('/&([^-]+)-/', '+$1-', $val['name']));
                $val['type'] = '';
                $sortedResult[$index++] = $val;
            }
        }

        return $sortedResult;
    }

    public function setTrashBoxName($name)
    {
        $this->trashBoxName = $name;

        return $this;
    }

    public function getTrashBoxName()
    {
        if($this->trashBoxName == null)
        {
            $this->getBoxesList();

            if($this->trashBoxName == null)
            {
                $this->trashBoxName = 'Trash';
            }
        }

        return $this->trashBoxName;
    }

    public function setSentBoxName($name)
    {
        $this->sentBoxName = $name;

        return $this;
    }

    public function getSentBoxName()
    {

        if($this->sentBoxName == null)
        {
            $this->getBoxesList();

            if($this->sentBoxName == null)
            {
                $this->sentBoxName = 'Sent';
            }
        }

        return $this->sentBoxName;
    }

    public function openBox($name)
    {
        return new Mailbox($this, $name);
    }
}
