<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Event;

use CRM\Base;

class SessionCreateNew extends Base
{
    public function onSessionCreateNew()
    {
        if(is_dir(BASEPATH.'/app/Cache/incomming-attachments'))
        {
            $sessions = $this->db()->builder()->select('id')->from('#__session')->all();
            $dirs     = scandir(BASEPATH.'/app/Cache/incomming-attachments');

            foreach($dirs as $key => $item)
            {
                foreach($sessions as $sess)
                {
                    if($item == $sess->id || $item == "." || $item == "..")
                    {
                        unset($dirs[$key]);
                    }
                }
            }

            foreach($dirs as $item)
            {
                $this->removeDirectoryContent(BASEPATH."/app/Cache/incomming-attachments/{$item}");
                @rmdir(BASEPATH."/app/Cache/incomming-attachments/{$item}");
            }
        }
    }

    public function removeDirectoryContent($directory)
    {
        if(is_dir($directory))
        {
            foreach(scandir($directory) as $item)
            {
                if($item != "." && $item != ".." && filetype("{$directory}/{$item}") != "dir")
                {
                    @unlink("{$directory}/{$item}");
                }
            }
        }
    }
}
