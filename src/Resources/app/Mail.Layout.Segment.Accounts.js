/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.Accounts = function(node, layout) {
    this.node   = node;
    this.layout = layout;

    /**
     * Stores values used when user resize layout elements.
     */
    this.resizeValues = {
        started: false,
        x: 0,
        y: 0,
        current: null,
        calculated: null
    };

    this.init = function() {
        var self = this;

        self.showLoader();

        self.resizeValues.current = self.resizeValues.calculated = this.setSize(self.layout.options.sizes.accounts);

        $('#layout-resize-menu', this.getNode()).mousedown(function(e) {
            self.resizeValues.x = e.pageX;
            self.resizeValues.y = e.pageY;
            self.resizeValues.started = true;

            e.preventDefault();
        });

        $('body, html').mousemove(function(e) {
            if(self.resizeValues.started)
            {
                self.resizeValues.calculated = self.setSize(self.resizeValues.current + (e.pageX - self.resizeValues.x));

                e.preventDefault();
            }
        }).mouseup(function(e) {
            /**
             * End of resizing - we update values.
             */
            if(self.resizeValues.started)
            {
                self.resizeValues.current = self.resizeValues.calculated;

                self.resizeValues.started = false;
                self.resizeValues.x = 0;
                self.resizeValues.y = 0;

                self.layout.app.trigger('onAccountsSizeChange', [self.resizeValues.calculated]);
            }
        });

        if($.fn.mCustomScrollbar)
        {
            this.getNode().find('.account-list').mCustomScrollbar({
                theme: 'minimal-dark',
                scrollEasing: 'linear',
                scrollInertia: 200,
                mouseWheel: {
                    scrollAmount: 150
                }
            });
        }
    };

    /**
     * Updates size of Menu.
     * 
     * @param integer size Size in piksels.
     */
    this.setSize = function(size) {
        // Mininal size of menu
        if(size <= 150)
        {
            size = 150;
        }

        this.getNode().css('width', size + 'px');
        this.layout.segment('content').getNode().css('left', size + 'px');

        return size;
    };

    /**
     * Returns jQuery object of Menu.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };

    /**
     * Renders mail account with his mailboxes.
     * 
     * @param  array account
     * @return void
     */
    this.renderAccount = function(account) {
        var destination = this.getNode().find('.account-list .wrapp');
        var boxes = [];

        for(var j in account.mailboxes)
        {
            // Icon of mailbox
            switch(account.mailboxes[j].type)
            {
                case 'inbox':  var icon = '<i class="fa fa-inbox"></i>';  break;
                case 'trash':  var icon = '<i class="fa fa-trash"></i>';  break;
                case 'sent':   var icon = '<i class="fa fa-send-o"></i>'; break;
                case 'drafts': var icon = '<i class="fa fa-newspaper-o"></i>'; break;
                case 'spam':   var icon = '<i class="fa fa-ban"></i>';    break;
                default:       var icon = '<i class="fa fa-minus"></i>';
            }

            boxes.push('<li data-account="' + account.id + '" data-box="' + account.mailboxes[j].id + '"><a href="#"><span class="badge account-status"><span class="fa fa-spinner fa-pulse"></span></span><span class="account-name">' + icon + account.mailboxes[j].name + '</span></a></li>');
        }

        destination.append('<div class="mailbox-folders" data-account="' + account.id + '"><div class="heading">' + account.name + '</div><div><ul class="list-group-alt">' + boxes.join('') + '</ul></div></div>');

        var self = this;
        this.getNode().find('[data-account=' + account.id + '] a').click(function() {
            self.layout.app.trigger('onAccountElementClick', [ $(this).parent().attr('data-account'), $(this).parent().attr('data-box') ]);

            return false;
        });
    };

    this.setActiveElement = function(account, mailbox) {
        this.getNode().find('li').removeClass('active');
        this.getNode().find('[data-account="' + account + '"] li[data-box="' + mailbox + '"]').addClass('active');

        return this;
    };

    this.updateMessagesCount = function(accountId, mailboxId, total, unseen) {
        this.getNode().find('[data-account="' + accountId + '"] li[data-box="' + mailboxId + '"] span.account-status').html((unseen != 0 ? unseen + '/' : '') + total);

        return this;
    };

    this.showAccountsEmptyPanel = function() {
        APP.VEPanel.open('.mail-accounts-empty');

        return this;
    };

    /**
     * Shows loader that covers all acounts and view
     * information text for user to wait.
     *
     * @return self
     */
    this.showLoader = function() {
        this.getNode().find('.info-layer').show();

        return this;
    };

    /**
     * Hides loader.
     *
     * @return self
     */
    this.hideLoader = function() {
        this.getNode().find('.info-layer').hide();

        return this;
    };

    this.showAccountPasswordProvider = function(id, name, callback)
    {
        var elm = APP.VEPanel.open('.mail-account-password');

        elm.data('account-id', id);
        elm.data('account-name', name);
        elm.find('h4 strong').text(name);

        var self = this;

        elm.find('input').unbind('focus').focus(function() {
            elm.find('.form-group')
                .removeClass('has-info-text')
                .removeClass('has-error')
                .find('.info-text')
                .remove();
        }).keydown(function(e) {
            /**
             * Enter = Button click
             */
            if(e.which == 13)
            {
                elm.find('button').trigger('click');
            }
        });

        elm.find('button').unbind('click').click(function() {
            elm.find('.loader').removeClass('hidden');

            callback(id, elm.find('input').val(), function(arg) {
                elm.find('.loader').addClass('hidden');
                elm.find('.form-group')
                    .removeClass('has-info-text')
                    .removeClass('has-error')
                    .find('.info-text')
                    .remove();

                if(arg === true)
                {
                    self.hideAccountPasswordProvider();
                }
                else
                {
                    elm.find('.form-group')
                        .addClass('has-info-text')
                        .addClass('has-error')
                        .find('input')
                        .after('<div class="info-text">Podane hasło jest niepoprawne.</div>');
                }
            });
        });

        elm.unbind('app.ve-panel:close').on('app.ve-panel:close', function(e, closedByScript) {
            if(closedByScript !== true)
            {
                callback(id, undefined, function() {});
            }

            elm.find('.loader').addClass('hidden');
            elm.find('.form-group')
                .removeClass('has-info-text')
                .removeClass('has-error')
                .find('.info-text')
                .remove();
        });

        return this;
    };

    this.hideAccountPasswordProvider = function() {
        APP.VEPanel.close(true);
        $('.mail-account-password .loader').addClass('hidden');
        $('.mail-account-password input').val('');

        return this;
    };
};
