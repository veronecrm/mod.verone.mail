<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
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
}
