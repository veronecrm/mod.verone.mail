/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Account = function(app) {
    /**
     * Application object.
     * @type Mail.App.Main
     */
    this.app = app;

    /**
     * Account ID (in DB).
     * @type integer
     */
    this.id = 0;

    /**
     * Account name.
     * @type string
     */
    this.name = '';

    /**
     * Tefresh time of this account.
     * Temporary not usable.
     * @type integer
     */
    this.refreshTime = 18000;

    /**
     * Sender name.
     * @type string
     */
    this.senderName = '';

    /**
     * Edit link of this account.
     * Temporary not usable.
     * @type string
     */
    this.editLink = '';

    /**
     * Mailboxes created in this account.
     * @type array
     */
    this.mailboxes = [];

    this.init = function() {

    };

    /**
     * Set mailboxes array. Convert array to objects of Mailbox.
     * @param array data Mailboxes array datas.
     */
    this.setMailboxes = function(data) {
        for(var i in data)
        {
            var box = new Mail.App.Account.Mailbox(this.app);

            box.id   = data[i].id;
            box.name = data[i].name;
            box.type = data[i].type;
            box.accountId = this.id;

            this.mailboxes.push(box);
        }

        var self = this;
        var accountsLayout = this.app.layout.segment('accounts');

        accountsLayout.renderAccount(this);
        accountsLayout.hideLoader();

        this.app.trigger('onAccountReady', [ this ]);
    };

    /**
     * Return mailbox by given ID.
     * @param  mixed id Mailbox ID. ID can be interer or string.
     * @return object Mailbox.
     */
    this.getMailbox = function(id) {
        for(var i in this.mailboxes)
        {
            if(this.mailboxes[i].id == id)
            {
                return this.mailboxes[i];
            }
        }

        return null;
    };
};
