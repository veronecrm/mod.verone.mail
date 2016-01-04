<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class IncomingMailAttachment
{
    public $id;
    public $name;
    public $type = 'file';
    public $subtype;
    public $filePath;
    public $previewUrl;
    public $downloadUrl;

    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function setSubtype($subtype)
    {
        $this->subtype = strtolower($subtype);

        if(in_array($this->subtype, [ 'png', 'jpg', 'jpeg', 'gif' ]))
        {
            $this->type = 'image';
        }
        elseif(in_array($this->subtype, [ 'txt', 'html', 'htm', 'php', 'json' ]))
        {
            $this->type = 'text';
        }
        elseif(in_array($this->subtype, [ 'rar', 'zip', 'tar', 'gzip', 'x-zip-compressed' ]))
        {
            $this->type = 'archive';
        }
        elseif(in_array($this->subtype, [ 'pdf' ]))
        {
            $this->type = 'pdf';
        }
        elseif(in_array($this->subtype, [ 'mp3', 'ac3', 'flac', 'waw', 'arm', 'ogg' ]))
        {
            $this->type = 'audio';
        }
        elseif(in_array($this->subtype, [ 'mp4', 'mpg', 'mpeg', 'avi', 'divx', 'xvid', 'mkv', 'flv', 'webm', 'ogg', 'ogv' ]))
        {
            $this->type = 'video';
        }
        else
        {
            $this->type = 'file';
        }

        return $this;
    }

    public function setFilePath($filePath)
    {
        $this->filePath = $filePath;

        return $this;
    }

    public function isImage()
    {
        return $this->type == 'image';
    }
}
