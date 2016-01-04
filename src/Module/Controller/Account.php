<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\Controller;

use CRM\App\Controller\BaseController;

class Account extends BaseController
{
    public function indexAction()
    {
        return $this->render('index', [ 'elements' => $this->repo('Account')->all() ]);
    }

    public function addAction()
    {
        return $this->render('form', [
            'account' => $this->entity('Account')
        ]);
    }

    public function saveAction($request)
    {
        $account = $this->entity('Account')->fillFromRequest($request);
        $account->setOwner($this->user()->getId());

        if($account->getSavePassword() == 0)
        {
            $account->setImapPassword('');
            $account->setSmtpPassword('');
        }

        $this->repo('Account')->encryptPasswords($account);
        $this->repo('Account')->save($account);

        $this->flash('success', $this->t('mailAccountSaved'));

        if($request->get('apply'))
        {
            return $this->redirect('Mail', 'Account', 'edit', [ 'id' => $account->getId() ]);
        }
        else
        {
            return $this->redirect('Mail', 'Account', 'index');
        }
    }

    public function editAction($request)
    {
        $account = $this->repo('Account')->find($request->get('id'));

        if(! $account)
        {
            $this->flash('danger', $this->t('mailAccountDoesntExists'));
            return $this->redirect('Mail', 'Account', 'index');
        }

        $this->repo('Account')->decryptPasswords($account);

        return $this->render('form', [
            'account' => $account
        ]);
    }

    public function updateAction($request)
    {
        $account = $this->repo('Account')->find($request->get('id'));

        if(! $account)
        {
            $this->flash('danger', $this->t('mailAccountDoesntExists'));
            return $this->redirect('Mail', 'Account', 'index');
        }

        $account->fillFromRequest($request);

        if($account->getSavePassword() == 0)
        {
            $account->setImapPassword('');
            $account->setSmtpPassword('');
        }

        $this->repo('Account')->encryptPasswords($account);
        $this->repo('Account')->save($account);

        $this->flash('success', $this->t('mailAccountSaved'));

        if($request->get('apply'))
        {
            return $this->redirect('Mail', 'Account', 'edit', [ 'id' => $account->getId() ]);
        }
        else
        {
            return $this->redirect('Mail', 'Account', 'index');
        }
    }

    public function deleteAction($request)
    {
        $account = $this->repo('Account')->find($request->get('id'));

        if(! $account)
        {
            $this->flash('danger', $this->t('mailAccountDoesntExists'));
            return $this->redirect('Mail', 'Account', 'index');
        }

        $this->repo('Account')->delete($account);
        $this->flash('success', $this->t('mailAccountDeleted'));

        return $this->redirect('Mail', 'Account', 'index');
    }
}
