/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Account.Mailbox = function(app) {
    /**
     * Application object.
     * @type Mail.App.Main
     */
    this.app = app;

    /**
     * Mailbox ID.
     * @type mixed
     */
    this.id = 0;

    /**
     * Mailbox name. Translated if translation exists.
     * @type string
     */
    this.name = '';

    /**
     * Type of mailbox. One of available: sent, inbox, trash, drafts
     * If none of allowed, value is empty String.
     * @type string
     */
    this.type = '';

    /**
     * Account ID that mailbox belowed to.
     * @type integer
     */
    this.accountId = 0;

    /**
     * Total number of messages in this mailbox.
     * @type integer
     */
    this.messagesTotal = 0;

    /**
     * Total unseen (unread) messages in this mailbox.
     * @type integer
     */
    this.messagesUnseen = 0;

    this.init = function() {

    };

    this.incrementMessagesTotal = function() {
        this.messagesTotal++;

        this.updateMessagesCount();

        return this;
    };

    this.decrementMessagesTotal = function() {
        this.messagesTotal--;

        if(this.messagesTotal <= 0)
        {
            this.messagesTotal = 0;
        }

        this.updateMessagesCount();

        return this;
    };

    this.setMessagesTotal = function(count) {
        this.messagesTotal = count;

        this.updateMessagesCount();

        return this;
    };

    this.getMessagesTotal = function() {
        return this.messagesTotal;
    };

    this.incrementMessagesUnseen = function() {
        this.messagesUnseen++;

        this.updateMessagesCount();

        return this;
    };

    this.decrementMessagesUnseen = function() {
        this.messagesUnseen--;

        if(this.messagesUnseen <= 0)
        {
            this.messagesUnseen = 0;
        }

        this.updateMessagesCount();

        return this;
    };

    this.setMessagesUnseen = function(count) {
        this.messagesUnseen = count;

        this.updateMessagesCount();

        return this;
    };

    this.getMessagesUnseen = function() {
        return this.messagesUnseen;
    };

    this.updateMessagesCount = function() {
        this.app.layout.segment('accounts').updateMessagesCount(this.accountId, this.id, this.messagesTotal, this.messagesUnseen);
    };

    this.isSent = function() {
        return this.type == 'sent';
    };

    this.isInbox = function() {
        return this.type == 'inbox';
    };

    this.isTrash = function() {
        return this.type == 'trash';
    };

    this.isDrafts = function() {
        return this.type == 'drafts';
    };
};
