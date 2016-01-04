/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
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

        this.app.bind('onAccountsListEmpty', function() {
            self.app.layout.segment('accounts')
                .showAccountsEmptyPanel()
                .hideLoader();
        });

        this.app.bind('onMarkAs', function(account, mailbox, msgsno, markas) {
            self.updateNotification();
        });


        this.resolveAccounts();

        var ids = this.getAccountsIds();

        if(ids.length == 0)
        {
            setTimeout(function() {
                self.app.trigger('onAccountsListEmpty');
            }, 400);
        }
        else
        {
            this.app.layout.segment('accounts').showLoader();
        }

        var accountNeedToProvidePassword = this.getAccountsThatNeedToProvidePassword();

        if(accountNeedToProvidePassword.length)
        {
            this.accountsPasswordRetrive();
        }
        else
        {
            this.renderMailboxes();
        }
    };

    this.renderMailboxes = function() {
        var self = this;

        this.app.api.call('getAccountsMailboxes', { 'accounts': this.getAccountsIds() }, function(result) {
            self.resolveMailboxes(result);
            self.app.trigger('onAccountsReady');
        });

        setInterval(function() {
            self.app.trigger('onGlobalRefresh');
        }, 600000);
    };

    this.accountsPasswordRetrive = function() {
        var self = this;
        var accountNeedToProvidePassword = this.getAccountsThatNeedToProvidePassword();

        if(accountNeedToProvidePassword.length)
        {
            this.app.layout.segment('accounts').showAccountPasswordProvider(accountNeedToProvidePassword[0].id, accountNeedToProvidePassword[0].name, function(id, password, terminationCallback) {
                if(password === undefined)
                {
                    accountNeedToProvidePassword[0].setPassword(undefined);
                    accountNeedToProvidePassword[0].needAskForPassword = false;
                    accountNeedToProvidePassword[0].active = false;
                    self.accountsPasswordRetrive();
                    return;
                }

                if($.trim(password) == '')
                {
                    terminationCallback(false);
                    return;
                }

                self.app.api.call('getAccountsMailboxes', { 'accounts': [ id ], 'passwords': [ { 'id': id, 'password': password } ] }, function(result) {
                    accountNeedToProvidePassword[0].setPassword(password);
                    accountNeedToProvidePassword[0].needAskForPassword = false;
                    terminationCallback(true);
                    self.accountsPasswordRetrive();
                }, function() {
                    terminationCallback(false);
                });
            });
        }
        else
        {
            this.renderMailboxes();
        }
    };

    this.getAccountsThatNeedToProvidePassword = function() {
        var list = [];

        for(var i in this.accounts)
        {
            if(this.accounts[i].isNeedAskForPassword() && this.accounts[i].getPassword() == '')
            {
                list.push(this.accounts[i]);
            }
        }

        return list;
    };

    this.getAccountsIds = function() {
        var ids = [];

        for(var i in this.accounts)
        {
            // Only active accounts.
            if(this.accounts[i].active)
            {
                ids.push(this.accounts[i].id);
            }
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
            account.needAskForPassword = this.app.options.accounts[i].needAskForPassword;

            this.accounts.push(account);
        }

        return this;
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

        return this;
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
     * @return self
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

        this.app.api.call('mailboxesStatus', { mailboxes: mailboxes }, function(result) {
            for(var r in result)
            {
                var account = self.getAccount(result[r].account);

                if(! account)
                {
                    continue;
                }

                var mailbox = account.getMailbox(result[r].mailbox);

                if(! mailbox)
                {
                    continue;
                }

                mailbox.setMessagesTotal(result[r].total);
                mailbox.setMessagesUnseen(result[r].unseen);
            }

            self.app.trigger('onMailboxesStatusUpdate');
        });

        return this;
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

        return this;
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

        return this;
    };

    this.updateCurrentMailbox = function() {
        this.updateStatuses([{
            account: this.account.id,
            mailbox: this.mailbox.id
        }]);

        return this;
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

        return this;
    };

    /**
     * Change current mailbox (and account) and refresh list of mails.
     * 
     * @param  object account Account object.
     * @param  object mailbox Mailbox object.
     * @return self
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

        return this;
    };

    this.notificationInterval = null;
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
            APP.PageTitle.clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
        else
        {
            var title = APP.t('mailNewMessageCount').replace('%d', total);

            if(this.notificationInterval == null)
            {
                this.notificationInterval = APP.PageTitle.setInterval(title);
            }
            else
            {
                APP.PageTitle.updateInterval(this.notificationInterval, title);
            }
        }

        this.generateFavicon(total);
    };

    this.originalFavicon = document.getElementById('page-favicon').href;
    this.generateFavicon = function(number) {
        if(number == 0)
        {
            document.getElementById('page-favicon').href = this.originalFavicon;
            return;
        }

        var canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;

        var ctx = canvas.getContext('2d');
        ctx.font = number <= 9 ? 'bold 128px "Open Sans"' : 'bold 110px "Open Sans"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0088CC';
        ctx.fillText(number <= 9 ? number : '9+', canvas.width / 2, 110);

        document.getElementById('page-favicon').href = canvas.toDataURL("image/x-icon");
    };
};
