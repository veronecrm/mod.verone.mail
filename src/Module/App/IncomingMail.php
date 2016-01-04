<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class IncomingMail {

    public $id;
    public $date;
    public $subject;

    public $fromName;
    public $fromAddress;

    public $to = [];
    public $toString;
    public $cc = [];
    public $replyTo = [];
    public $replyToString = '';

    public $textPlain = '';
    public $textHtml = '';

    public $attachments = [];

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function addAttachment(IncomingMailAttachment $attachment)
    {
        $this->attachments[] = $attachment;
    }

    public function getAttachment($id)
    {
        foreach($this->attachments as $item)
        {
            if($item->id == $id)
            {
                return $item;
            }
        }
    }

    public function getInternalLinksPlaceholders()
    {
        return preg_match_all('/=["\'](ci?d:([^\"]+))["\']/i', $this->textHtml, $matches) ? array_combine($matches[2], $matches[1]) : [];
    }

    public function replaceInternalLinks($baseUri)
    {
        $fetchedHtml  = $this->textHtml;

        foreach($this->getInternalLinksPlaceholders() as $attachmentId => $placeholder)
        {
            $fetchedHtml = str_replace($placeholder, $baseUri.$attachmentId.'" data-attid="cid:'.$attachmentId, $fetchedHtml);
        }

        return $fetchedHtml;
    }

    public function prepareMessage(array $options = [])
    {
        $options = array_merge([
            'attachments-url' => ''
        ], $options);

        // Replace internal links to inline attachments
        $this->textHtml  = $this->replaceInternalLinks($options['attachments-url']);

        // We remove script tags
        $this->textHtml  = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->textHtml);
        $this->textPlain = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->textPlain);

        // Add target="_blank" to links
        $this->textHtml  = preg_replace('#<a([^>]+)>#is', '<a$1 target="_blank">', $this->textHtml);
        $this->textPlain = preg_replace('#<a([^>]+)>#is', '<a$1 target="_blank">', $this->textPlain);

        return $this;
    }
}
