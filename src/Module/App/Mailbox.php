<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

use DateTime;

class Mailbox
{
    public $imap;
    private $connection;
    private $name;
    private $fullName;

    private $mailLocalStorage;

    private $attachmentsDirectory;

    public function __construct(IMAP $imap, $name)
    {
        $this->imap       = $imap;
        $this->connection = $imap->getConnection();
        $this->name       = $name;

        $this->fullName   = $this->imap->reopen($name);

        $this->mailLocalStorage = new MailboxMailLocalStorageMock;
    }

    public function getImap()
    {
        return $this->imap;
    }

    public function getFullName()
    {
        return $this->fullName;
    }

    public function setMailLocalStorage(MailLocalStorageInterface $mailLocalStorage)
    {
        $this->mailLocalStorage = $mailLocalStorage;

        return $this;
    }

    public function setAttachmentsDirectory($directory)
    {
        $this->attachmentsDirectory = $directory;

        if(file_exists($this->attachmentsDirectory) == false || is_dir($this->attachmentsDirectory) == false)
        {
            mkdir($this->attachmentsDirectory, 0777, true);
        }

        return $this;
    }

    public function isInbox()
    {
        return strpos($this->name, 'INBOX') !== false;
    }

    public function isSent()
    {
        return strpos($this->name, 'Sent') !== false;
    }

    public function isTrash()
    {
        return strpos($this->name, 'Trash') !== false;
    }

    public function check()
    {
        return imap_check($this->connection);
    }

    public function getStatus($flag = SA_ALL)
    {
        return imap_status($this->connection, $this->fullName, $flag);
    }

    public function countMessages()
    {
        return ($return = imap_num_msg($this->connection)) ? $return : 0;
    }

    public function fetchAllIds()
    {
        return imap_sort($this->connection, SORTARRIVAL, 1, SE_UID);
    }

    public function fetchMessages($sequence)
    {
        $result = imap_fetch_overview($this->connection, $sequence, FT_UID);

        foreach($result as & $mail)
        {
            if(property_exists($mail, 'subject'))
            {
                $mail->subject = static::decode($mail->subject, $this->imap->serverEncoding);
            }

            if(property_exists($mail, 'from'))
            {
                $mail->from = static::decode($mail->from, $this->imap->serverEncoding);
            }

            if(property_exists($mail, 'to'))
            {
                $mail->to = static::decode($mail->to, $this->imap->serverEncoding);
            }

            if(property_exists($mail, 'date'))
            {
                if(Mailbox::datetimeValid($mail->date))
                {
                    $mail->date_timestamp = (new DateTime($mail->date))->getTimestamp();
                }
                else
                {
                    $mail->date_timestamp = 0;
                }
            }
        }

        return array_reverse($result);
    }

    public function fetch($page = 1, $perpage = 40, $query = null, $searchIn = 'SUBJECT')
    {
        $folderCheck = $this->check();

        $page--;

        if($folderCheck->Nmsgs == 0)
        {
            $result = [];
            $total = $folderCheck->Nmsgs;
        }
        else
        {
            if($query == '')
            {
                $ids = imap_sort($this->connection, SORTARRIVAL, 1, SE_UID);
            }
            else
            {
                $ids = imap_sort($this->connection, SORTARRIVAL, 1, SE_UID, $searchIn.' "'.$query.'"');
            }

            $total  = count($ids);

            $chunks = array_chunk($ids, $perpage);

            if(isset($chunks[$page]))
            {
                $sequence = $chunks[$page];
            }
            else
            {
                $sequence = [];
            }

            $sequence = implode(',', $sequence);

            $result = $this->fetchMessages($sequence);
        }

        $container = new MessagesContainer;
        $container->list    = $result;
        $container->total   = $total;

        return $container;
    }

    public function fetchAll()
    {
        return imap_sort($this->connection, SORTARRIVAL, 0);
    }

    public function markAs($msgNo, $markAs)
    {
        $msgNo = is_array($msgNo) ? $msgNo : [$msgNo];

        switch($markAs)
        {
            case 'seen': $this->setFlag($msgNo, '\\Seen');  break;
            case 'unseen': $this->clearFlag($msgNo, '\\Seen'); break;
            case 'important': $this->clearFlag($msgNo, '\\Flagged');  break;
        }

        return $this;
    }

    public function setFlag(array $msgs, $flag)
    {
        return imap_setflag_full($this->connection, implode(',', $msgs), $flag, ST_UID);
    }

    public function clearFlag(array $msgs, $flag)
    {
        return imap_clearflag_full($this->connection, implode(',', $msgs), $flag, ST_UID);
    }

    public function deleteMessage($msgno, $force = false)
    {
        /**
         * If message is in Trash, we delete it from mailbox.
         */
        if($this->isTrash() || $force === true)
        {
            $this->deleteMail($msgno);
            $this->expungeDeletedMails();
        }
        /**
         * Otherwise, we only move message to Trash.
         */
        else
        {
            $this->moveMail($msgno, $this->imap->getTrashBoxName());
            $this->expungeDeletedMails();
        }

        return $this;
    }

    public function expungeDeletedMails()
    {
        return imap_expunge($this->connection);
    }

    public function deleteMail($msgno)
    {
        return imap_delete($this->connection, $msgno, FT_UID);
    }

    public function moveMail($msgno, $mailbox)
    {
        return imap_mail_move($this->connection, $msgno, $mailbox, CP_UID);
    }

    public function fetchStructure($msgno)
    {
        return imap_fetchstructure($this->connection, $msgno, FT_UID);
    }

    public function readMessage($msgno, $types = null)
    {
        if($this->mailLocalStorage->has($msgno))
        {
            return $this->mailLocalStorage->get($msgno);
        }

        $head = imap_rfc822_parse_headers(imap_fetchheader($this->connection, $msgno, FT_UID));

        $mail = new IncomingMail($msgno);
        $mail->date = isset($head->date) ? strtotime($head->date) : time();
        $mail->subject = isset($head->subject) ? static::decode($head->subject, $this->imap->serverEncoding) : null;
        $mail->fromName = isset($head->from[0]->personal) ? static::decode($head->from[0]->personal, $this->imap->serverEncoding) : null;
        $mail->fromAddress = strtolower($head->from[0]->mailbox.'@'.$head->from[0]->host);

        if(isset($head->to))
        {
            $toList = array();

            foreach($head->to as $to)
            {
                if(! empty($to->mailbox) && ! empty($to->host))
                {
                    $toEmail  = (string) strtolower($to->mailbox.'@'.$to->host);
                    $toName   = (string) isset($to->personal) ? static::decode($to->personal, $this->imap->serverEncoding) : null;
                    $toList[] = $toName ? "{$toName} <{$toEmail}>" : $toEmail;
                    $mail->to[$toEmail] = $toName;
                }
            }

            $mail->toString = implode(', ', $toList);
        }

        if(isset($head->cc))
        {
            foreach($head->cc as $cc)
            {
                $mail->cc[strtolower($cc->mailbox.'@'.$cc->host)] = isset($cc->personal) ? static::decode($cc->personal, $this->imap->serverEncoding) : null;
            }
        }

        if(isset($head->reply_to))
        {
            $replyToString = [];

            foreach($head->reply_to as $replyTo)
            {
                $email = strtolower($replyTo->mailbox.'@'.$replyTo->host);
                $name  = isset($replyTo->personal) ? static::decode($replyTo->personal, $this->imap->serverEncoding) : $email;

                $mail->replyTo[$email] = $name;
                $replyToString[] = "{$name} <{$email}>";
            }

            $mail->replyToString = implode(',', $replyToString);
        }

        $reader = new MailReader($this->imap, $mail, $this->attachmentsDirectory);
        $reader->read($types);

        $this->mailLocalStorage->set($msgno, $mail);

        return $mail;
    }

    public function createReader($msgno)
    {
        $reader = new MailReader($this->imap, new IncomingMail($msgno));
        $reader->setAttachmentsDirectory($this->attachmentsDirectory);

        return $reader;
    }

    public function getMessageAsString($message, $flags = null)
    {
        return imap_fetchheader($this->connection, $message, FT_UID)."\r\n".imap_body($this->connection, $message, FT_UID);
    }

    public function appendMessage($message, $box = 'IMAP.Sent', $flags = null, $messageId = null)
    {
        $mailbox = $this->imap->reopen($box);
        $date    = null;

        if($messageId)
        {
            //var_dump($messageId);
            $messageId  = imap_uid($this->connection, $messageId);
            //var_dump($messageId);
            $headerinfo = imap_headerinfo($this->connection, $messageId);
            $date       = date('d-M-Y H:i:s O', $headerinfo->udate);
        }

        $result = imap_append($this->connection, $mailbox, $message, $flags/*, $date*/);

        $this->fullName = $this->imap->reopen($this->name);

        return $result;
    }

    public static function decode($string, $charset = 'utf-8')
    {
        $return = '';
        $elements   = imap_mime_header_decode($string);

        for($i=0; $i<count($elements); $i++)
        {
            if($elements[$i]->charset == 'default')
            {
                $elements[$i]->charset = 'iso-8859-1';
            }

            $return .= iconv(strtoupper($elements[$i]->charset), $charset.'//IGNORE', $elements[$i]->text);
        }

        return $return;
    }

    public static function datetimeValid($date)
    {
        $formats = [
            DateTime::ATOM,
            DateTime::COOKIE,
            DateTime::ISO8601,
            DateTime::RFC822,
            DateTime::RFC850,
            DateTime::RFC1036,
            DateTime::RFC1123,
            DateTime::RFC2822,
            DateTime::RFC3339,
            DateTime::RSS,
            DateTime::W3C
        ];

        foreach($formats as $format)
        {
            $result = date_parse_from_format($format, $date);

            if($result['warning_count'] == 0 && $result['error_count'] == 0)
            {
                return true;
            }
        }

        return false;
    }
}
