<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class FilesUpload
{
    public function uploadFromArray(array $files, $dest)
    {
        $result = array();

        foreach($this->rebuildFilesArray($files) as $file)
        {
            if(is_uploaded_file($file['tmp_name']))
            {
                $filenameParts = $this->getFileNameParts($file['name']);
                $filename      = $this->uniqFileName($filenameParts['filename'], $filenameParts['extension'], $dest);

                $data = [
                    'size'  => $file['size'],
                    'name'  => $file['name']
                ];

                if(! move_uploaded_file($file['tmp_name'], $dest.'/'.$filename))
                {
                    $data['error'] = 'FilesUpload::CANNOT_MOVE_UPLOADED_FILE';
                }

                $result[] = $data;
            }
        }

        return $result;
    }

    public function uniqFileName($filename, $extension, $directory, $before = '-', $after = '')
    {
        $i = 1;
        $fileNameExists = $filename;
        
        while(file_exists("{$directory}/{$fileNameExists}.{$extension}"))
        {
            $fileNameExists = "{$filename}{$before}{$i}{$after}";
            $i++;
        }
        
        return "$fileNameExists.$extension";
    }

    public function getFileNameParts($filename)
    {
        return array(
            'extension'   => pathinfo($filename, PATHINFO_EXTENSION),
            'filename'    => pathinfo($filename, PATHINFO_FILENAME)
        );
    }

    public function createResultForUploaderFromArray(array $files)
    {
        $result = array();

        foreach($this->rebuildFilesArray($files) as $file)
        {
            if(is_uploaded_file($file['tmp_name']))
            {
                $result[] = array(
                    'size'  => $file['size'],
                    'name'  => $file['name']
                );
            }
        }

        return $result;
    }

    public function rebuildFilesArray(array $files)
    {
        $result = array();

        if($files !== array())
        {
            foreach($files['name'] as $key => $val)
            {
                $result[] = array(
                    'name' => $files['name'][$key],
                    'type' => $files['type'][$key],
                    'tmp_name' => $files['tmp_name'][$key],
                    'error' => $files['error'][$key],
                    'size' => $files['size'][$key]
                );
            }
        }

        return $result;
    }
}
