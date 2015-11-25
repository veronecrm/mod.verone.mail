<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\ORM;

use CRM\ORM\Entity;

class Account extends Entity
{
    protected $id;
    protected $owner;
    protected $name;
    protected $senderName;
    protected $imapHost;
    protected $imapUsername;
    protected $imapPassword;
    protected $imapPort;
    protected $imapProtocol;
    protected $imapSecurity;
    protected $imapCertificateValidation;
    protected $smtpHost;
    protected $smtpPort;
    protected $smtpUsername;
    protected $smtpPassword;
    protected $smtpSecurity;
    protected $refreshTime;

    /**
     * Gets the value of id.
     *
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Sets the value of id.
     *
     * @param mixed $id the id
     *
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Gets the value of owner.
     *
     * @return mixed
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * Sets the value of owner.
     *
     * @param mixed $owner the owner
     *
     * @return self
     */
    public function setOwner($owner)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * Gets the value of name.
     *
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets the value of name.
     *
     * @param mixed $name the name
     *
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Gets the senderName.
     *
     * @return mixed
     */
    public function getSenderName()
    {
        return $this->senderName;
    }

    /**
     * Sets the $senderName.
     *
     * @param mixed $senderName the sender name
     *
     * @return self
     */
    public function setSenderName($senderName)
    {
        $this->senderName = $senderName;

        return $this;
    }

    /**
     * Gets the value of imapHost.
     *
     * @return mixed
     */
    public function getImapHost()
    {
        return $this->imapHost;
    }

    /**
     * Sets the value of imapHost.
     *
     * @param mixed $imapHost the imap host
     *
     * @return self
     */
    public function setImapHost($imapHost)
    {
        $this->imapHost = $imapHost;

        return $this;
    }

    /**
     * Gets the value of imapUsername.
     *
     * @return mixed
     */
    public function getImapUsername()
    {
        return $this->imapUsername;
    }

    /**
     * Sets the value of imapUsername.
     *
     * @param mixed $imapUsername the imap username
     *
     * @return self
     */
    public function setImapUsername($imapUsername)
    {
        $this->imapUsername = $imapUsername;

        return $this;
    }

    /**
     * Gets the value of imapPassword.
     *
     * @return mixed
     */
    public function getImapPassword()
    {
        return $this->imapPassword;
    }

    /**
     * Sets the value of imapPassword.
     *
     * @param mixed $imapPassword the imap password
     *
     * @return self
     */
    public function setImapPassword($imapPassword)
    {
        $this->imapPassword = $imapPassword;

        return $this;
    }

    /**
     * Gets the value of imapPort.
     *
     * @return mixed
     */
    public function getImapPort()
    {
        return $this->imapPort;
    }

    /**
     * Sets the value of imapPort.
     *
     * @param mixed $imapPort the imap port
     *
     * @return self
     */
    public function setImapPort($imapPort)
    {
        $this->imapPort = $imapPort;

        return $this;
    }

    /**
     * Gets the value of imapProtocol.
     *
     * @return mixed
     */
    public function getImapProtocol()
    {
        return $this->imapProtocol;
    }

    /**
     * Sets the value of imapProtocol.
     *
     * @param mixed $imapProtocol the imap protocol
     *
     * @return self
     */
    public function setImapProtocol($imapProtocol)
    {
        $this->imapProtocol = $imapProtocol;

        return $this;
    }

    /**
     * Gets the value of imapSecurity.
     *
     * @return mixed
     */
    public function getImapSecurity()
    {
        return $this->imapSecurity;
    }

    /**
     * Sets the value of imapSecurity.
     *
     * @param mixed $imapSecurity the imap security
     *
     * @return self
     */
    public function setImapSecurity($imapSecurity)
    {
        $this->imapSecurity = $imapSecurity;

        return $this;
    }

    /**
     * Gets the value of imapCertificateValidation.
     *
     * @return mixed
     */
    public function getImapCertificateValidation()
    {
        return $this->imapCertificateValidation;
    }

    /**
     * Sets the value of imapCertificateValidation.
     *
     * @param mixed $imapCertificateValidation the imap certificate validation
     *
     * @return self
     */
    public function setImapCertificateValidation($imapCertificateValidation)
    {
        $this->imapCertificateValidation = $imapCertificateValidation;

        return $this;
    }

    /**
     * Gets the value of smtpHost.
     *
     * @return mixed
     */
    public function getSmtpHost()
    {
        return $this->smtpHost;
    }

    /**
     * Sets the value of smtpHost.
     *
     * @param mixed $smtpHost the smtp host
     *
     * @return self
     */
    public function setSmtpHost($smtpHost)
    {
        $this->smtpHost = $smtpHost;

        return $this;
    }

    /**
     * Gets the value of smtpPort.
     *
     * @return mixed
     */
    public function getSmtpPort()
    {
        return $this->smtpPort;
    }

    /**
     * Sets the value of smtpPort.
     *
     * @param mixed $smtpPort the smtp port
     *
     * @return self
     */
    public function setSmtpPort($smtpPort)
    {
        $this->smtpPort = $smtpPort;

        return $this;
    }

    /**
     * Gets the value of smtpUsername.
     *
     * @return mixed
     */
    public function getSmtpUsername()
    {
        return $this->smtpUsername;
    }

    /**
     * Sets the value of smtpUsername.
     *
     * @param mixed $smtpUsername the smtp username
     *
     * @return self
     */
    public function setSmtpUsername($smtpUsername)
    {
        $this->smtpUsername = $smtpUsername;

        return $this;
    }

    /**
     * Gets the value of smtpPassword.
     *
     * @return mixed
     */
    public function getSmtpPassword()
    {
        return $this->smtpPassword;
    }

    /**
     * Sets the value of smtpPassword.
     *
     * @param mixed $smtpPassword the smtp password
     *
     * @return self
     */
    public function setSmtpPassword($smtpPassword)
    {
        $this->smtpPassword = $smtpPassword;

        return $this;
    }

    /**
     * Gets the value of smtpSecurity.
     *
     * @return mixed
     */
    public function getSmtpSecurity()
    {
        return $this->smtpSecurity;
    }

    /**
     * Sets the value of smtpSecurity.
     *
     * @param mixed $smtpSecurity the smtp security
     *
     * @return self
     */
    public function setSmtpSecurity($smtpSecurity)
    {
        $this->smtpSecurity = $smtpSecurity;

        return $this;
    }

    /**
     * Gets the value of refreshTime.
     *
     * @return mixed
     */
    public function getRefreshTime()
    {
        return $this->refreshTime;
    }

    /**
     * Sets the value of refreshTime.
     *
     * @param mixed $refreshTime the refresh time
     *
     * @return self
     */
    public function setRefreshTime($refreshTime)
    {
        $this->refreshTime = $refreshTime;

        return $this;
    }
}
