/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Account.Manager = function(app) {
    /**
     * Store Application object.
     * @type Mail.App.Main
     */
    this.app = app;

    /**
     * Store current Account object.
     * @type object
     */
    this.account = null

    /**
     * Store current Mailbox object.
     * @type object
     */
    this.mailbox = null;

    /**
     * Store Accounts objects.
     * @type array
     */
    this.accounts = [];

    /**
     * Initiation function
     */
    this.init = function() {
        this.renderAccounts();
    };

    /**
     * Gets list of accounts with their mailboxes and renders it.
     */
    this.renderAccounts = function(refreshOnly) {
        var self = this;

        this.app.bind('onAccountElementClick', function(accountId, mailboxId) {
            var account = self.getAccount(accountId);

            if(! account)
            {
                return false;
            }

            var mailbox = account.getMailbox(mailboxId);

            if(! mailbox)
            {
                return false;
            }

            self.select(account, mailbox);
        });

        this.app.bind('onAccountsReady', function() {
            /**
             * When accounts will be ready, we 'click' on first mailbox in first account
             * to set its active.
             */
            if(self.accounts[0] && self.accounts[0].mailboxes[0])
            {
                self.select(self.accounts[0], self.accounts[0].mailboxes[0]);
            }

            self.updateStatuses();
        });

        this.app.bind(['onMailboxesStatusUpdate', 'onMessagePreviewRender'], function() {
            self.updateNotification();
        });

        this.app.bind('onGlobalRefresh', function() {
            self.updateStatuses();
        });


        this.resolveAccounts();

        var ids = this.getAccountsIds();

        if(ids.length == 0)
        {
            this.app.layout.segment('accounts').showAccountsEmptyPanel();
            return;
        }

        this.app.layout.segment('accounts').showLoader();

        this.app.api.call('getAccountsMailboxes', { 'accounts': ids }, function(msg) {
            try {
                var result = jQuery.parseJSON(msg);
            }
            catch(e) {
                self.app.generateTimeoutedErrorWithCallback('maam-renderaccounts', APP.t('mailErrorWhenTryingGetListOfAccountsTryingAgain'), 5, function() {
                    self.renderAccounts(refreshOnly);
                });

                console.log(['this.renderAccounts', e]);
                return false;
            }

            self.resolveMailboxes(result.data);
        });

        setInterval(function() {
            self.app.trigger('onGlobalRefresh');
        }, 600000);
    }

    this.getAccountsIds = function() {
        var ids = [];

        for(var i in this.accounts)
        {
            ids.push(this.accounts[i].id);
        }

        return ids;
    };

    this.resolveAccounts = function() {
        for(var i in this.app.options.accounts)
        {
            var account = new Mail.App.Account(this.app);

            account.id   = this.app.options.accounts[i].id;
            account.name = this.app.options.accounts[i].name;
            account.refreshTime = this.app.options.accounts[i].refreshTime;
            account.senderName  = this.app.options.accounts[i].senderName;
            account.editLink    = this.app.options.accounts[i].editLink;

            this.accounts.push(account);
        }
    };

    this.resolveMailboxes = function(data) {
        for(var i in this.accounts)
        {
            for(var j in data)
            {
                if(data[j].account == this.accounts[i].id)
                {
                    this.accounts[i].setMailboxes(data[j].boxes);
                }
            }
        }

        this.app.trigger('onAccountsReady');
    };

    this.getAccount = function(id) {
        for(var i in this.accounts)
        {
            if(this.accounts[i].id == id)
            {
                return this.accounts[i];
            }
        }

        return false;
    };

    /**
     * Calls app for informations about total ammount of messages,
     * and ammount of unseen in every one mailbox.
     *
     * @param object mailboxes Object stored mailboxes to update. If not provided,
     *                         method updates every one mailbox.
     * @return void
     */
    this.updateStatuses = function(mailboxes) {
        var self = this;
        
        /**
         * If mailboxes wasn't provided, we update status for every one.
         */
        if(! mailboxes)
        {
            mailboxes = [];

            for(var i in this.accounts)
            {
                for(var j in this.accounts[i].mailboxes)
                {
                    mailboxes.push({
                        account: this.accounts[i].id,
                        mailbox: this.accounts[i].mailboxes[j].id
                    });
                }
            }
        }

        this.app.api.call('mailboxesStatus', { mailboxes: mailboxes }, function(msg) {
            var result = jQuery.parseJSON(msg);

            for(var r in result.data)
            {
                var account = self.getAccount(result.data[r].account);

                if(! account)
                {
                    continue;
                }

                var mailbox = account.getMailbox(result.data[r].mailbox);

                if(! mailbox)
                {
                    continue;
                }

                mailbox.setMessagesTotal(result.data[r].total);
                mailbox.setMessagesUnseen(result.data[r].unseen);
            }

            self.app.trigger('onMailboxesStatusUpdate');
        });
    };

    this.updateSentMailbox = function(account) {
        var mailboxes = [];

        for(var i in this.account.mailboxes)
        {
            if(this.account.mailboxes[i].isSent())
            {
                mailboxes.push({
                    account: this.account.id,
                    mailbox: this.account.mailboxes[i].id
                });
            }
        }

        this.updateStatuses(mailboxes);
    };

    this.updateTrashMailbox = function(account) {
        var mailboxes = [];

        for(var i in this.account.mailboxes)
        {
            if(this.account.mailboxes[i].isTrash())
            {
                mailboxes.push({
                    account: this.account.id,
                    mailbox: this.account.mailboxes[i].id
                });
            }
        }

        this.updateStatuses(mailboxes);
    };

    this.updateCurrentMailbox = function() {
        this.updateStatuses([{
            account: this.account.id,
            mailbox: this.mailbox.id
        }]);
    };

    this.updateCurrentAccount = function() {
        var mailboxes = [];

        for(var i in this.account.mailboxes)
        {
            mailboxes.push({
                account: this.account.id,
                mailbox: this.account.mailboxes[i].id
            });
        }

        this.updateStatuses(mailboxes);
    };

    /**
     * Change current mailbox (and account) and refresh list of mails.
     * 
     * @param  object account Account object.
     * @param  object mailbox Mailbox object.
     * @return void
     */
    this.select = function(account, mailbox) {
        var accountChanged = false;
        var mailboxChanged = false;

        /**
         * If account has change, mailbox changes to becouse many accounts
         * can have the same named mailbox.
         */
        if(! this.account || this.account.id != account.id)
        {
            accountChanged = true;
            mailboxChanged = true;
        }

        if(! this.mailbox || this.mailbox.id != mailbox.id)
        {
            mailboxChanged = true;
        }

        this.account = account;
        this.mailbox = mailbox;

        if(accountChanged)
        {
            this.app.trigger('onAccountChange', [
                this.account
            ]);
        }

        if(mailboxChanged)
        {
            this.app.trigger('onMailboxChange', [
                this.account,
                this.mailbox
            ]);
        }

        this.app.layout.segment('accounts').setActiveElement(this.account.id, this.mailbox.id);
    };

    this.notificationInterval = null;
    this.pageTitle = $('head title').text();
    this.updateNotification = function() {
        var self = this;
        var total = 0;

        for(var i in this.accounts)
        {
            for(var j in this.accounts[i].mailboxes)
            {
                if(this.accounts[i].mailboxes[j].getMessagesUnseen() && this.accounts[i].mailboxes[j].isTrash() == false)
                {
                    total += this.accounts[i].mailboxes[j].getMessagesUnseen();
                }
            }
        }

        if(total == 0)
        {
            $('#page-favicon').attr('href', APP.filePath('/images/fi.png'));
            $('head title').text(self.pageTitle);

            clearInterval(this.notificationInterval);
        }
        else
        {
            if(total <= 10)
            {
                $('#page-favicon').attr('href', APP.filePath('images/fi-' + total + '.png'));
            }
            else
            {
                $('#page-favicon').attr('href', APP.filePath('/images/fi-9+.png'));
            }

            clearInterval(this.notificationInterval);

            self.notificationInterval = setInterval(function() {
                $('head title').text($('head title').text() == self.pageTitle ? APP.t('mailNewMessageCount').replace('%d', total) : self.pageTitle);
            }, 1000);
        }
    };
};
