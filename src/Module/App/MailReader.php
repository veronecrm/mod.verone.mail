<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class MailReader
{
    const READ_ALL          = 127;
    const READ_BODY_ATTACHMENTS = 107; // READ_ALL & ~(READ_ATTACHMENTS_LIST | READ_ATTACHMENT)
    const READ_ATTACHMENTS_LIST = 16;
    const READ_ATTACHMENTS  = 8;
    const READ_ATTACHMENT   = 4;
    const READ_BODY         = 2;

    protected $read;
    protected $readParam;
    protected $structure;
    protected $attachmentsDirectory;

    protected $connection;
    protected $imap;
    public $mail;

    public function __construct(IMAP $imap, $mail, $attachmentsDirectory = null)
    {
        $this->imap       = $imap;
        $this->connection = $imap->getConnection();
        $this->mail       = $mail;
        $this->attachmentsDirectory = $attachmentsDirectory;

        $this->structure = imap_fetchstructure($this->connection, $this->mail->id, FT_UID);
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

    public function read($type = null, $param = null)
    {
        $this->read = $type == null ? (self::READ_ALL & ~(self::READ_ATTACHMENT | self::READ_ATTACHMENTS)) : $type;
        $this->readParam = $param;

        if(property_exists($this->structure, 'parts') && $this->structure->parts)
        {
            foreach($this->structure->parts as $partNo => $partStructure)
            {
                $this->initMailPart($this->mail, $partStructure, $partNo + 1);
            }
        }
        else
        {
            $this->initMailPart($this->mail, $this->structure, 0);
        }
    }

    public function canRead($type)
    {
        return ($this->read & $type) == $type;
    }

    public function fetchParams($structure)
    {
        $params = array();

        if(isset($structure->parameters) && ($structure->parameters || $structure->parameters === []))
        {
            foreach($structure->parameters as $param)
            {
                $params[strtolower($param->attribute)] = $param->value;
            }
        }

        if(isset($structure->dparameters) && ($structure->dparameters || $structure->dparameters === []))
        {
            foreach($structure->dparameters as $param)
            {
                $paramName = strtolower(preg_match('~^(.*?)\*~', $param->attribute, $matches) ? $matches[1] : $param->attribute);

                if(isset($params[$paramName]))
                {
                    $params[$paramName] .= $param->value;
                }
                else
                {
                    $params[$paramName] = $param->value;
                }
            }
        }

        return $params;
    }

    public function fetchEmailBody(IncomingMail $mail, $partStructure, $partNo)
    {
        $params = $this->fetchParams($partStructure);

        $data = $partNo ? imap_fetchbody($this->connection, $mail->id, $partNo, FT_UID) : imap_body($this->connection, $mail->id, FT_UID);

        switch($partStructure->encoding)
        {
            case 1: $data = imap_utf8($data); break;
            case 2: $data = imap_binary($data); break;
            case 3: $data = imap_base64($data); break;
            case 4: $data = imap_qprint($data); break;
        }

        if(isset($params['charset']) && $params['charset'])
        {
            $data = mb_convert_encoding($data, $this->imap->serverEncoding, $params['charset']);
        }

        if($partStructure->type == 0 && $data)
        {
            if(strtolower($partStructure->subtype) == 'plain')
            {
                $mail->textPlain .= $data;
            }
            else
            {
                $mail->textHtml .= $data;
            }
        }
        elseif($partStructure->type == 2 && $data)
        {
            $mail->textPlain .= trim($data);
        }
    }

    public function fetchBody($mail, $partNo, $encoding)
    {
        $data = $partNo ? imap_fetchbody($this->connection, $mail->id, $partNo, FT_UID) : imap_body($this->connection, $mail->id, FT_UID);

        switch($encoding)
        {
            case 1: $data = imap_utf8($data); break;
            case 2: $data = imap_binary($data); break;
            case 3: $data = imap_base64($data); break;
            case 4: $data = imap_qprint($data); break;
        }

        return $data;
    }

    protected function createAttachment($mail, $structure, $params, $partNo)
    {
        $attachment = new IncomingMailAttachment();

        $attachmentId = null;

        if($structure->ifid)
        {
            $attachmentId = trim($structure->id, " <>");
        }
        elseif(isset($params['filename']))
        {
            $attachmentId = md5($params['filename']).$partNo;
        }
        elseif(isset($params['name']))
        {
            $attachmentId = md5($params['name']).$partNo;
        }

        if($attachmentId)
        {
            if(empty($params['filename']) && empty($params['name']))
            {
                $fileName = $attachmentId.'.'.strtolower($structure->subtype);
            }
            else
            {
                $fileName = ! empty($params['filename']) ? $params['filename'] : $params['name'];
                $fileName = self::decodeMimeStr($fileName, $this->imap->serverEncoding);
                $fileName = self::decodeRFC2231($fileName, $this->imap->serverEncoding);
            }

            $attachment->setId($attachmentId);
            $attachment->setName($fileName);
            $attachment->setSubtype($structure->subtype);
        }

        return $attachment;
    }

    public function fetchAttachment($mail, $structure, $params, $partNo)
    {
        $attachment = $this->createAttachment($mail, $structure, $params, $partNo);

        if($this->attachmentsDirectory && $attachment->id && ($attachment->id == $this->readParam || $this->readParam == null))
        {
            $replace = array(
                '/\s/'              => '_',
                '/[^0-9a-zA-Z_\.]/' => '',
                '/_+/'              => '_',
                '/(^_)|(_$)/'       => ''
            );

            $fileSysName = preg_replace('~[\\\\/]~', '', $mail->id.'_'.$attachment->id.'_'.preg_replace(array_keys($replace), $replace, $attachment->name));

            $attachment->setFilePath("{$this->attachmentsDirectory}/{$fileSysName}");

            $data = $this->fetchBody($mail, $partNo, $structure->encoding);

            file_put_contents($attachment->filePath, $data);

            $mail->addAttachment($attachment);
        }
    }

    public function fetchAttachmentsList($mail, $structure, $params, $partNo)
    {
        $attachment = $this->createAttachment($mail, $structure, $params, $partNo);

        if($attachment->id)
        {
            $mail->addAttachment($attachment);
        }
    }

    public function initMailPart(IncomingMail $mail, $structure, $partNo)
    {
        if($this->canRead(self::READ_BODY))
        {
            /**
             * Almost all mails, have this options, as mail body (message).
             */
            if($structure->type == 0 && ! $structure->ifdisposition)
            {
                $this->fetchEmailBody($mail, $structure, $partNo);
            }
            /**
             * Some mails, have type as 0 (zero), but have disposition as 'inline'
             * and they hasn't read by previous IF statement.
             */
            elseif($structure->type == 0 && $structure->ifdisposition && $structure->disposition == 'inline')
            {
                $this->fetchEmailBody($mail, $structure, $partNo);
            }
        }

        if($this->canRead(self::READ_ATTACHMENTS_LIST))
        {
            if($structure->type != 0 || ($structure->ifdisposition && strtolower($structure->disposition) == 'attachment'))
            {
                $params = $this->fetchParams($structure);

                $this->fetchAttachmentsList($mail, $structure, $params, $partNo);
            }
        }

        if($this->canRead(self::READ_ATTACHMENT))
        {
            if($structure->type != 0 || ($structure->ifdisposition && strtolower($structure->disposition) == 'attachment'))
            {
                $params = $this->fetchParams($structure);

                $this->fetchAttachment($mail, $structure, $params, $partNo);
            }
        }

        if($this->canRead(self::READ_ATTACHMENTS))
        {
            if($structure->type != 0 || ($structure->ifdisposition && strtolower($structure->disposition) == 'attachment'))
            {
                $params = $this->fetchParams($structure);

                $this->fetchAttachment($mail, $structure, $params, $partNo);
            }
        }

        if(! empty($structure->parts))
        {
            foreach($structure->parts as $subPartNo => $partStructure)
            {
                if($structure->type == 2 && $structure->subtype == 'RFC822')
                {
                    $this->initMailPart($mail, $partStructure, $partNo);
                }
                else
                {
                    $this->initMailPart($mail, $partStructure, $partNo.'.'.($subPartNo + 1));
                }
            }
        }
    }

    public static function decodeRFC2231($string, $charset = 'utf-8')
    {
        if(preg_match("/^(.*?)'.*?'(.*?)$/", $string, $matches))
        {
            $encoding = $matches[1];
            $data     = $matches[2];

            if(static::isUrlEncoded($data))
            {
                $string = iconv(strtoupper($encoding), $charset.'//IGNORE', urldecode($data));
            }
        }

        return $string;
    }

    public static function decodeMimeStr($string, $charset = 'utf-8')
    {
        $newString = '';
        $elements = imap_mime_header_decode($string);

        for($i = 0; $i < count($elements); $i++)
        {
            if($elements[$i]->charset == 'default')
            {
                $elements[$i]->charset = 'iso-8859-1';
            }

            $newString .= iconv(strtoupper($elements[$i]->charset), $charset.'//IGNORE', $elements[$i]->text);
        }
        return $newString;
    }

    public static function isUrlEncoded($string)
    {
        $string   = str_replace('%20', '+', $string);
        $decoded  = urldecode($string);

        return $decoded != $string && urlencode($decoded) == $string;
    }
}
