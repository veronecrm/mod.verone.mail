/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
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

            boxes.push('<li data-account="' + account.id + '" data-box="' + account.mailboxes[j].id + '"><a href="#">' + icon + account.mailboxes[j].name + '<span class="badge right"><span class="fa fa-spinner fa-pulse"></span></span></a></li>');
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
    };

    this.updateMessagesCount = function(accountId, mailboxId, total, unseen) {
        this.getNode().find('[data-account="' + accountId + '"] li[data-box="' + mailboxId + '"] span').html((unseen != 0 ? unseen + '/' : '') + total);
    };

    this.showAccountsEmptyPanel = function() {
        APP.VEPanel.open('.mail-accounts-empty');
    };

    /**
     * Shows loader that covers all acounts and view
     * information text for user to wait.
     *
     * @return void
     */
    this.showLoader = function() {
        this.getNode().find('.info-layer').show();
    };

    /**
     * Hides loader.
     *
     * @return void
     */
    this.hideLoader = function() {
        this.getNode().find('.info-layer').hide();
    };
};
