<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Controller;

use DateTime;
use System\Utils\ObjectToArrayConverter;
use CRM\App\Controller\BaseController;
use App\Module\Mail\ORM\Account;
use App\Module\Mail\ORM\Message;
use App\Module\Mail\App\IMAP;
use App\Module\Mail\App\EmailAddressParser;
use App\Module\Mail\App\FilesUpload;
use App\Module\Mail\App\MailLocalStorage;
use App\Module\Mail\App\MailReader;
use App\Module\Mail\App\Mailbox;

class Mail extends BaseController
{
    public function indexAction($request)
    {
        $contractors = $this->repo('Contractor', 'Contractor')->all();

        foreach($contractors as $contractor)
        {
            $contractor->contacts = $this->repo('Contact', 'Contractor')->findByContractor($contractor->getId());
        }

        $accounts = [];

        foreach($this->repo('Account')->all() as $account)
        {
            $accounts[] = [
                'id'   => $account->getId(),
                'name' => $account->getName(),
                'senderName'  => $account->getSenderName(),
                'refreshTime' => $account->getRefreshTime(),
                'editLink'    => $this->createUrl('Mail', 'Account', 'edit', [ 'id' => $account->getId() ])
            ];
        }

        return $this->render('', [
            'contractors' => $contractors,
            'accounts'    => $accounts,
            'settings'    => $this->openSettings('user')
        ]);
    }

    public function connectionCheckAction($request)
    {
        try
        {
            if($request->get('type') == 'imap')
            {
                $imap = new IMAP($request->get('imapUsername'), $request->get('imapPassword'));
                $imap->setHost($request->get('imapHost'));
                $imap->setPort($request->get('imapPort'));
                $imap->setSecurity($request->get('imapSecurity'));
                $imap->setValidateCertificate((boolean) $request->get('imapCertificateValidation'));
                $imap->setType($request->get('imapProtocol'));
                $imap->open();
            }
            else
            {
                $transport = \Swift_SmtpTransport::newInstance($request->get('smtpHost'), $request->get('smtpPort'), $request->get('smtpSecurity') == 'nan' ? null : $request->get('smtpSecurity'))
                    ->setUsername($request->get('smtpUsername'))
                    ->setPassword($request->get('smtpPassword'));

                $result = $transport->start();
            }
        }
        catch(\Exception $e)
        {
            return $this->responseAJAX(['message' => $e->getMessage(), 'status' => 'error']);
        }

        return $this->responseAJAX(['message' => 'Połączenie nawiązane.', 'status' => 'success']);
    }

    public function getAccountsMailboxesAction($request)
    {
        $return = [];
        $accounts = (array) $request->get('accounts');
        $repo     = $this->repo('Account');

        foreach($accounts as $id)
        {
            $account = $repo->find($id);

            if(! $account)
            {
                continue;
            }

            $imap = $this->imap($account);

            $return[] = [
                'account' => $account->getId(),
                'boxes'   => $imap->getBoxesList([
                    'Sent'   => $this->t('mailMailboxNameSent'),
                    'Trash'  => $this->t('mailMailboxNameTrash'),
                    'Drafts' => $this->t('mailMailboxNameDrafts'),
                    'Junk'   => $this->t('mailMailboxNameJunk'),
                    'INBOX'  => $this->t('mailMailboxNameINBOX')
                ])
            ];
        }

        return $this->responseAJAX(['data' => $return]);
    }

    public function getMailListAction($request)
    {
        $repo   = $this->repo('Account');
        $box    = $this->openBoxFromRequest($request);
        $data   = $box->fetch($request->request->get('page', 1), $request->request->get('perpage', 20), $request->request->get('query', null), $request->request->get('search-in', 'SUBJECT'));
        $total  = $data->total;
        $result = $data->list;

        foreach($result as $message)
        {
            if(property_exists($message, 'size'))
            {
                $message->size = $repo->formatBytes($message->size);
            }
            else
            {
                $message->size = $repo->formatBytes(0);
            }

            if(property_exists($message, 'date'))
            {
                /**
                 * I don't know why this os addet, but with this,
                 * DateTime::__construct() doesn't work.
                 */
                $message->date = trim(str_replace('(CET)', '', $message->date));

                if(Mailbox::datetimeValid($message->date))
                {
                    $message->date = (new DateTime($message->date))->format('Y.m.d H:i');
                }
            }
            else
            {
                $message->date = '---';
            }
        }

        return $this->responseAJAX([
            'data' => [
                'list'  => $result,
                'total' => $total
            ]
        ]);
    }

    public function mailboxesStatusAction($request)
    {
        $result    = [];
        $mailboxes = (array) $request->request->get('mailboxes');

        // Store IMAP connections, for cache. many mailboxes can be in one account, so
        // we don't want co connect to server for every each mailbox.
        $connections = [];

        foreach($mailboxes as $mailbox)
        {
            // If connection does not exists, we create new.
            if(isset($connections[$mailbox['account']]) === false)
            {
                $account = $this->repo('Account')->find($mailbox['account']);

                if(! $account)
                {
                    continue;
                }

                $connections[$mailbox['account']] = $this->imap($account);
            }

            $box   = $this->openBoxFromIMAP($connections[$mailbox['account']], $mailbox['mailbox']);
            $status = $box->getStatus();

            $mailbox['total']  = $status->messages;
            $mailbox['unseen'] = $status->unseen;

            $result[] = $mailbox;
        }

        return $this->responseAJAX([
            'data' => $result
        ]);
    }

    /*public function moveToMailboxAction($request)
    {
        $from = $this->imap($this->repo('Account')->find($request->get('fromAccount')));
        $to   = $this->imap($this->repo('Account')->find($request->get('toAccount')));

        $fromBox = $this->openBoxFromIMAP($from, $request->get('fromBox'));
        $toBox   = $this->openBoxFromIMAP($to, $request->get('toBox'));

        $result  = [];

        foreach($request->get('msgsno') as $id)
        {
            $message = $fromBox->getMessageAsString($id);

            if($message)
            {
                if($toBox->appendMessage($message, $request->get('toBox'), null, $id))
                {
                    $fromBox->deleteMessage($id, true);

                    $result[] = $id;
                }
            }
        }

        return $this->responseAJAX([ 'msgsno' => $result ]);
    }*/

    public function removeMessagesAction($request)
    {
        $account = $request->request->get('account');
        $mailbox = $request->request->get('mailbox');

        $box  = $this->openBoxFromRequest($request);
        $imap = $box->getImap();
        $msgs = $request->get('msgsno');

        if(is_array($msgs))
        {
            foreach($msgs as $id)
            {
                $box->deleteMessage($id);
            }

            return $this->responseAJAX([ 'msgsno' => $request->get('msgsno') ]);
        }

        return $this->responseAJAX([ 'msgsno' => [] ]);
    }

    public function iframeEmptyAction()
    {
        return $this->response('');
    }

    public function openMailAction($request)
    {
        $box     = $this->openBoxFromRequest($request);
        $message = $box->readMessage($request->get('msgno'));
        /**
         * @todo Remove method getRelated() from Account REPO to other class.
         */
        $repo    = $this->repo('Account');

        $message->date_timestamp  = $message->date;
        $message->date_full       = $this->datetime()->date($message->date);
        $message->date_timeago    = $this->datetime()->timeAgo($message->date);

        $message->prepareMessage([
            'attachments-url' => $this->createUrl('Mail', 'Mail', 'attachment', [
                'ssid'    => $request->getSession()->getId(),
                'account' => $request->get('account'),
                'mailbox' => $request->get('mailbox'),
                'msgno'   => $request->get('msgno'),
                'CID'     => ''
            ])
        ]);

        foreach($message->attachments as $att)
        {
            $this->prepareAttachment($att);
        }

        return $this->responseAJAX([ 'data' => $message, 'related' => $repo->getRelated($message) ]);
    }

    public function prepareAttachment($attachment)
    {
        $request = $this->request();

        $attachment->previewUrl = $this->createUrl('Mail', 'Mail', 'attachment', [
            'ssid' => $request->getSession()->getId(),
            'account' => $request->get('account'),
            'mailbox' => $request->get('mailbox'),
            'msgno' => $request->get('msgno'),
            'force' => 'preview',
            'size' => 'original',
            'CID' => $attachment->id
        ]);
        $attachment->thumbnailUrl = $this->createUrl('Mail', 'Mail', 'attachment', [
            'ssid' => $request->getSession()->getId(),
            'account' => $request->get('account'),
            'mailbox' => $request->get('mailbox'),
            'msgno' => $request->get('msgno'),
            'force' => 'preview',
            'size' => 'thumbnail',
            'CID' => $attachment->id
        ]);
        $attachment->downloadUrl = $this->createUrl('Mail', 'Mail', 'attachment', [
            'ssid' => $request->getSession()->getId(),
            'account' => $request->get('account'),
            'mailbox' => $request->get('mailbox'),
            'msgno' => $request->get('msgno'),
            'force' => 'download',
            'CID' => $attachment->id
        ]);
    }

    public function attachmentAction($request)
    {
        $CID        = $request->get('CID');
        $mailbox    = $this->openBoxFromRequest($request);
        $message    = $mailbox->readMessage($request->get('msgno'));
        $attachment = $message->getAttachment($CID);

        if(! $attachment)
        {
            return $this->response('');
        }

        if(is_file($attachment->filePath) == false)
        {
            $reader = $mailbox->createReader($message->id);
            $reader->read(MailReader::READ_ATTACHMENT, $CID);

            $attachment = $reader->mail->getAttachment($CID);
        }

        if(! $attachment)
        {
            return $this->response('NO ATTACHMENT FOUND', 200);
        }

        $this->prepareAttachment($attachment);

        if($attachment->isImage() && $request->get('force') == 'preview')
        {
            if($request->get('size') == 'original')
            {
                $response = $this->response(file_get_contents($attachment->filePath), 200);
            }
            else
            {
                $response = $this->response($this->cropImage($attachment->filePath), 200);
            }

            $response->setContentType('image/'.strtolower($attachment->subtype))
                ->headers
                ->setDisposition('inline', $attachment->name);
        }
        else
        {
            $response = $this->response(file_get_contents($attachment->filePath), 200);
            $response->headers
                ->set('Content-Description', 'File Transfer')
                ->set('Content-Type', 'application/octet-stream')
                ->setDisposition('attachment', $attachment->name)
                ->set('Content-Transfer-Encoding', 'binary')
                ->set('Connection', 'Keep-Alive')
                ->set('Expires', '0')
                ->set('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                ->set('Pragma', 'public')
                ->set('Content-Length', filesize($attachment->filePath));
        }

        return $response;
    }

    public function cropImage($source_path)
    {
        /*
         * Crop-to-fit PHP-GD
         * http://salman-w.blogspot.com/2009/04/crop-to-fit-image-using-aspphp.html
         *
         * Resize and center crop an arbitrary size image to fixed width and height
         * e.g. convert a large portrait/landscape image to a small square thumbnail
         */
        $imageWidth  = 120;
        $imageHeight = 120;

        /*
         * Add file validation code here
         */
        list($source_width, $source_height, $source_type) = getimagesize($source_path);

        switch($source_type) {
            case IMAGETYPE_GIF:
                $source_gdim = imagecreatefromgif($source_path);
                break;
            case IMAGETYPE_JPEG:
                $source_gdim = imagecreatefromjpeg($source_path);
                break;
            case IMAGETYPE_PNG:
                $source_gdim = imagecreatefrompng($source_path);
                break;
        }

        $source_aspect_ratio = $source_width / $source_height;
        $desired_aspect_ratio = $imageWidth / $imageHeight;

        if($source_aspect_ratio > $desired_aspect_ratio)
        {
            /*
             * Triggered when source image is wider
             */
            $temp_height = $imageHeight;
            $temp_width = ( int ) ($imageHeight * $source_aspect_ratio);
        }
        else
        {
            /*
             * Triggered otherwise (i.e. source image is similar or taller)
             */
            $temp_width = $imageWidth;
            $temp_height = ( int ) ($imageWidth / $source_aspect_ratio);
        }

        /*
         * Resize the image into a temporary GD image
         */
        $temp_gdim = imagecreatetruecolor($temp_width, $temp_height);
        imagecopyresampled(
            $temp_gdim,
            $source_gdim,
            0, 0,
            0, 0,
            $temp_width, $temp_height,
            $source_width, $source_height
        );

        /*
         * Copy cropped region from temporary image into the desired GD image
         */
        $x0 = ($temp_width - $imageWidth) / 2;
        $y0 = ($temp_height - $imageHeight) / 2;
        $desired_gdim = imagecreatetruecolor($imageWidth, $imageHeight);
        imagecopy(
            $desired_gdim,
            $temp_gdim,
            0, 0,
            $x0, $y0,
            $imageWidth, $imageHeight
        );

        /*
         * Render the image
         */
        ob_start();
        switch($source_type)
        {
            case IMAGETYPE_GIF:
                imagegif($desired_gdim, null);
                break;
            case IMAGETYPE_JPEG:
                imagejpeg($desired_gdim, null, 99);
                break;
            case IMAGETYPE_PNG:
                imagepng($desired_gdim, null, 1);
                break;
        }
        $data = ob_get_contents();
        ob_end_clean();

        return $data;
    }

    public function copyAttachmentsAction($request)
    {
        $message = $this->openBoxFromRequest($request)->readMessage($request->get('msgno'));

        $attachmentsDir = BASEPATH.'/app/Cache/outgoing-attachments/'.$this->request()->getSession()->getId().'/'.$request->request->get('windowId');

        if(is_dir($attachmentsDir) == false)
        {
            mkdir($attachmentsDir, 0777, true);
        }

        $attachments = [];

        foreach($message->attachments as $item)
        {
            $filename = $item->name;

            copy($item->filePath, $attachmentsDir.'/'.$filename);

            $attachments[] = $filename;
        }

        return $this->responseAJAX([ 'data' => $attachments ]);
    }

    public function markAsAction($request)
    {
        $account = $request->request->get('account');
        $mailbox = $request->request->get('mailbox');

        $box  = $this->openBoxFromRequest($request);
        $msgs = $request->get('msgsno');

        if(is_array($msgs))
        {
            foreach($msgs as $id)
            {
                $box->markAs($id, $request->get('markas'));
            }

            return $this->responseAJAX(['msgsno' => $request->get('msgsno'), 'markas' => $request->get('markas') ]);
        }

        return $this->responseAJAX([ 'msgsno' => $request->get('msgno'), 'markas' => '' ]);
    }

    public function sendAction($request)
    {
        $account = $this->repo('Account')->find($request->get('account'));

        if(! $account)
        {
            return $this->responseAJAX([ 'status' => 'error', 'message' => 'Brak skonfigurowanego konta pocztowego, z którego można wysłać wiadomość.' ]);
        }

        try {
            $to  = new EmailAddressParser($request->get('to'));
            $cc  = new EmailAddressParser($request->get('cc'));
            $bcc = new EmailAddressParser($request->get('bcc'));
            $message = \Swift_Message::newInstance();
            $content = $request->get('content');

            $contentObj = \SimpleHtmlDom\str_get_html($content);

            if($request->get('originalMessageId'))
            {
                $originalMessage = $this->openBoxFromRequest($request)->readMessage($request->get('originalMessageId'), MailReader::READ_BODY_ATTACHMENTS);

                if($originalMessage)
                {
                    foreach($originalMessage->attachments as $attachment)
                    {
                        /**
                         * Add attachment to new message, and retrive it's ID.
                         */
                        $newAttId = $message->embed(\Swift_Image::fromPath($attachment->filePath));

                        /**
                         * Search for elements with given attribute and given ID of attachment.
                         */
                        $elements = $contentObj->find('*[data-attid="cid:'.$attachment->id.'"]');

                        foreach($elements as $element)
                        {
                            /**
                             * Few lines abowe we add attachment to new mail, so we save it's id
                             * in searched src of image (inline attachment). Old SRC we replace by
                             * new attachment's ID.
                             */
                            $element->src = $newAttId;

                            /**
                             * We only add this attribute to tage the ID of attachment in original message.
                             * Now we only remove it, couse we don't need it anymore.
                             */
                            $element->removeAttribute('data-attid');
                        }
                    }
                }
            }

            $content = $contentObj->save();

            $message->setSubject($request->get('subject'))
                ->setFrom(array($account->getSmtpUsername() => $account->getSenderName()))
                ->setTo($to->getAsPairs())
                ->setBody($content, 'text/html');

            if($cc->hasAny())
            {
                $message->setCc($cc->getAsPairs());
            }

            if($bcc->hasAny())
            {
                $message->setBcc($bcc->getAsPairs());
            }

            $attachmentsDir = BASEPATH.'/app/Cache/outgoing-attachments/'.$this->request()->getSession()->getId().'/'.$request->request->get('windowId');

            if(is_dir($attachmentsDir))
            {
                foreach(new \DirectoryIterator($attachmentsDir) as $fileInfo)
                {
                    if($fileInfo->isDot() || $fileInfo->isDir())
                    {
                        continue;
                    }

                    $message->attach(\Swift_Attachment::fromPath($fileInfo->getPathname()));
                }
            }


            $transport = \Swift_SmtpTransport::newInstance($account->getSmtpHost(), $account->getSmtpPort(), $account->getSmtpSecurity())
                ->setUsername($account->getSmtpUsername())
                ->setPassword($account->getSmtpPassword());

            $mailer = \Swift_Mailer::newInstance($transport);

            // Send the message
            $result = $mailer->send($message);

            $this->openBoxFromRequest($request)->appendMessage($message->toString(), $this->imap($account)->getSentBoxName(), '\\Seen');
        }
        catch(\Exception $e)
        {
            return $this->responseAJAX([ 'status' => 'error', 'message' => $e->getMessage() ]);
        }

        return $this->responseAJAX([ 'status' => $result ? 'success' : 'error', 'message' => 'Wiadomość została wysłana.' ]);
    }

    public function uploadAttachmentAction($request)
    {
        $uploader = new FilesUpload();
        $files    = $uploader->createResultForUploaderFromArray($_FILES['attachments']);
        $destination = BASEPATH.'/app/Cache/outgoing-attachments/'.$this->request()->getSession()->getId().'/'.$request->request->get('windowId');

        if(! is_dir($destination))
        {
            mkdir($destination, 0777, true);
        }

        return $this->responseAJAX([
            'files' => $uploader->uploadFromArray($_FILES['attachments'], $destination)
        ]);
    }

    public function removeOutgoingAttachmentAction($request)
    {
        $filepath = BASEPATH.'/app/Cache/outgoing-attachments/'.$this->request()->getSession()->getId().'/'.$request->request->get('windowId').'/'.$request->request->get('name');

        if(is_file($filepath))
        {
            unlink($filepath);

            return $this->responseAJAX([ 'status' => 'success' ]);
        }
        else
        {
            return $this->responseAJAX([ 'status' => 'error', 'message' => 'Plik nie istnieje.' ]);
        }
    }

    private function openBoxFromRequest($request)
    {
        $imap = $this->imap($this->repo('Account')->find($request->get('account')));

        return $imap->openBox($request->get('mailbox'))
            ->setAttachmentsDirectory(BASEPATH.'/app/Cache/incomming-attachments/'.$this->request()->getSession()->getId())
            ->setMailLocalStorage(new MailLocalStorage);
    }

    private function openBoxFromIMAP($imap, $box)
    {
        return $imap->openBox($box)
            ->setAttachmentsDirectory(BASEPATH.'/app/Cache/incomming-attachments/'.$this->request()->getSession()->getId())
            ->setMailLocalStorage(new MailLocalStorage);
    }

    private function imap(Account $account)
    {
        $imap = new IMAP($account->getImapUsername(), $account->getImapPassword());
        $imap->setHost($account->getImapHost());
        $imap->setPort($account->getImapPort());
        $imap->setSecurity($account->getImapSecurity());
        $imap->setValidateCertificate($account->getImapSecurity());
        $imap->open();

        return $imap;
    }
}
