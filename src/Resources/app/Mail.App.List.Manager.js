/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.List.Manager = function(app) {
    /**
     * Application object.
     * @type Mail.App.Main
     */
    this.app = app;

    /**
     * List mails segment object.
     * @type Mail.Layout.Segment.List
     */
    this.list = null;

    /**
     * Search details.
     * @type object
     */
    this.search = {
        // Query to search
        query    : '',
        // Where search?
        searchIn : 'SUBJECT',
        // INPUT element in DOC
        input    : null,
        // DIV container of search-box.
        searchInContainer : null,
        // BUTTON for cancel search.
        cancelButton      : null
    };

    /**
     * Pagination details.
     * @type object
     */
    this.pagination = {
        page    : 1,
        perpage : 20,
        total   : 0
    };

    /**
     * Is list of messages focused?
     * @type boolean
     */
    this.focused = false;

    /**
     * Initiation function
     */
    this.init = function() {
        this.pagination.perpage = this.app.options.list.perpage;

        var accountManager = this.app.getManager('account');
        var list    = this.list = this.app.layout.segment('list');
        var preview = this.app.layout.segment('preview');
        var app     = this.app;
        var self    = this;

        this.app.bind('onMessageSelectedChange', function() {
            if(list.getSelected().length == 1)
            {
                preview.hideSelectMessage();

                /**
                 * BUG - If we start to select more than one message, we can also deselect selected
                 * messages. If we start to deselect, we can count down selected to one. In that way,
                 * system shows preview, but not selected message - only previously selected message.
                 * Below, in this case, if user have selected one message, we must download this message
                 * manually here, to show it to him.
                 */
                app.getManager('message').preview(list.getSelected()[0]);
            }
            else
            {
                preview.showSelectMessage();
            }
        });

        var head = this.app.layout.segment('head').getNode();

        head.find('.btn-mail-select-unseen').click(function() {
            list.deselectAll();
            list.selectUnseen();
        });

        head.find('.btn-mail-select-all').click(function() {
            list.selectAll();
        });

        head.find('.btn-mail-select-nan').click(function() {
            list.deselectAll();
        });

        head.find('.btn-mail-refresh').click(function() {
            self.app.layout.segment('preview').preventSelectMessageShow();
            self.app.getManager('account').updateCurrentAccount();
            self.renderMessages();
        });

        head.find('.btn-mail-as-seen').click(function() {
            self.markAs(list.getSelected(), 'seen');
        });

        head.find('.btn-mail-as-unseen').click(function() {
            self.markAs(list.getSelected(), 'unseen');
        });

        head.find('.btn-mail-remove').click(function() {
            self.removeMessages(list.getSelected());
        });

        head.find('.btn-mail-create').click(function() {
            self.app.getManager('message').newMessage({
                account : self.app.getManager('account').account.id,
                mailbox : self.app.getManager('account').mailbox.id
            });
        });

        head.find('.btn-mail-reply').click(function() {
            var manager = self.app.getManager('message');
            var message = manager.getCurrentMessage();

            manager.newMessage({
                account : self.app.getManager('account').account.id,
                mailbox : self.app.getManager('account').mailbox.id,
                isReply : 1,
                originalMessageId : message.id,
                to      : message.replyTo,
                fromName: message.fromName,
                fromAddress : message.fromAddress,
                date    : message.dateFull,
                content : message.getContent(),
                subject : message.subject
            });
        });

        head.find('.btn-mail-forward').click(function() {
            var manager = self.app.getManager('message');
            var message = manager.getCurrentMessage();

            var wnd = manager.newMessage({
                account : self.app.getManager('account').account.id,
                mailbox : self.app.getManager('account').mailbox.id,
                isForward : 1,
                originalMessageId: message.id,
                to      : '',
                fromName: '',
                fromAddress : message.fromAddress,
                date    : message.dateFull,
                content : message.getContent(),
                subject : message.subject
            });
        });

        $('body').keyup(function(e) {
            // Delete button = 46
            // Delete selected mails
            if(self.focused && e.which == 46)
            {
                self.removeMessages(list.getSelected());
            }
        }).keydown(function(e) {
            if(self.focused === false)
            {
                return;
            }

            // A = 65
            // Select all mails in list
            if(e.which == 65 && e.ctrlKey == true)
            {
                list.selectAll();

                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            // ESC = 27
            // Deselect all mails
            if(e.which == 27)
            {
                list.deselectAll();

                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });

        list.getNode().find('.mails-list').keydown(function(e) {
            if(self.list.isFocused())
            {
                return self.eventKeyupMessageChange(e);
            }
        });


        /**
         * Mails list Focus determination
         */
        list.getNode().click(function(e) {
            self.focused = true;
            $('body').data('mail-list-node-clicked-first', 1);
        });

        $('body').click(function() {
            if(! $('body').data('mail-list-node-clicked-first'))
            {
                self.focused = false;
            }

            $('body').data('mail-list-node-clicked-first', 0);
        });

        this.app.bind(['onAccountsRender', 'onMailboxChange'], function() {
            self.renderMessages();
        });

        this.app.bind('onGlobalRefresh', function() {
            self.app.layout.segment('preview').preventSelectMessageShow();
            self.renderMessages();
        });

        this.app.bind('onAccountsListEmpty', function() {
            self.app.layout.segment('list')
                .hideLoader()
                .hideNoMessages();
        });

        this.searchInit();
        this.paginationInit();
    };

    /**
     * 38 - Arrow Up
     * 40 - Arrow Down
     * 
     * @param  object e EventObject.
     * @return false
     */
    this.eventKeyupMessageChange = function(e) {
        if(this.focused === false)
        {
            return;
        }

        // Next message on list
        if(e.which == 40)
        {
            // List of selected messages
            var list = this.list.getSelected();

            // Only if any is selected
            if(list.length == 0)
            {
                return true;
            }

            // Get next of first of selected message
            var next = this.list.getMessageRow(list[0]).next();

            if(next.length == 0)
            {
                return true;
            }

            // Deselect all...
            this.list.deselectAll();
            // ..and select next
            this.list.select([next.data('msgno')]);
            this.list.scrollToFirstSelected();

            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Previous message on list
        if(e.which == 38)
        {
            // List of selected messages
            var list = this.list.getSelected();

            // Only if any is selected
            if(list.length == 0)
            {
                return true;
            }

            // Get next of first of selected message
            var prev = this.list.getMessageRow(list[0]).prev();

            if(prev.length == 0)
            {
                return true;
            }

            // Deselect all...
            this.list.deselectAll();
            // ..and select prev
            this.list.select([prev.data('msgno')]);
            this.list.scrollToFirstSelected();

            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        return true;
    };

    /**
     * Downloads list of messages in current mailbon in current
     * account and renders these messages in messages list.
     * 
     * @return void
     */
    this.renderMessages = function() {
        var self = this;
        var preview       = this.app.layout.segment('preview');
        var listManager   = self.app.layout.segment('list');
        var listContainer = listManager.getNode().find('.mails-list .wrapp');
        var options = {
            'account':    this.app.getManager('account').account.id,
            'mailbox':    this.app.getManager('account').mailbox.id,
            'page':       self.pagination.page,
            'perpage':    self.pagination.perpage,
            'query':      this.search.query,
            'search-in':  this.search.searchIn
        };

        listManager.hideNoMessages();
        listManager.showLoader();

        this.app.api.call('getMailList', options, function(result) {
            // Clear list area...
            listContainer.html('');

            self.pagination.total = parseInt(result.total);

            self.updatePagination();

            if(result.list.length == 0)
            {
                listManager.showNoMessages();
                preview.showSelectMessage();
            }
            else
            {
                listManager.hideNoMessages();
            }

            listManager.renderMessages(result.list);

            /**
             * Selecting mail from list (not view - just select)
             */
            listContainer.find('input').click(function(e) {
                e.stopPropagation();
            }).change(function() {
                if($(this)[0].checked)
                {
                    self.list.select([$(this).val()]);
                }
                else
                {
                    self.list.deselect([$(this).val()]);
                }
            });

            /**
             * Selecting from list by clicking on container of checkbox.
             */
            self.list.getNode().find('.select').click(function() {
                var input = $(this).find('input');

                if(input[0].checked)
                {
                    self.list.deselect([input.val()]);
                }
                else
                {
                    self.list.select([input.val()]);
                }
            });

            self.list.getNode().find('.message-row').not('.select').click(function(e) {
                var id = $(this).attr('data-msgno');
                /**
                 * If client press CTRL we only select elements, not view it.
                 */
                if(e.ctrlKey == false)
                {
                    self.list.deselectAll();
                    self.list.select([id]);
                }
                else
                {
                    if(self.list.isSelected(id))
                    {
                        self.list.deselect([id]);
                    }
                    else
                    {
                        self.list.select([id]);
                    }
                }

                self.list.setFocus();
            });

            //self.list.movable.init();

            listManager.hideLoader();
            listManager.scrollTop();
            preview.showSelectMessage();

            self.app.trigger('onMessagesListRender');
        });
    };

    /**
     * Marks messages (array of ID's) as given type. Also, if mark in 'seen' or 'unseen',
     * method changes message row in list.
     * 
     * @param  array  msgsno  Array of messages ID's.
     * @param  string markas  Mark type. Eg. seen, unseen.
     * @return void
     */
    this.markAs = function(msgsno, markas) {
        var self = this;
        var list = self.app.layout.segment('list');
        var accountManager = self.app.getManager('account');

        if(markas == 'seen')
        {
            for(var i in msgsno)
            {
                if(list.isUnseen(msgsno[i]) == true)
                {
                    list.markAsSeen([msgsno[i]]);

                    accountManager.mailbox.decrementMessagesUnseen();
                }
            }
        }
        if(markas == 'unseen')
        {
            for(var i in msgsno)
            {
                if(list.isUnseen(msgsno[i]) == false)
                {
                    list.markAsUnseen([msgsno[i]]);

                    accountManager.mailbox.incrementMessagesUnseen();
                }
            }
        }

        var accountManager = self.app.getManager('account');

        var arguments = {'account': accountManager.account.id, 'mailbox': accountManager.mailbox.id, 'msgsno': msgsno, 'markas': markas};

        self.app.api.call('markAs', arguments , function(result) {
            self.app.trigger('onMarkAs', [ arguments.account, arguments.mailbox, arguments.msgsno, arguments.markas ]);
        });
    };

    /**
     * Removes given messages (by ID) from current mailbox.
     * 
     * @param  array ids Array of ID's.
     * @return void
     */
    this.removeMessages = function(ids) {
        var self            = this;
        var accountManager  = self.app.getManager('account');
        var list            = self.app.layout.segment('list');

        self.app.api.call('removeMessages', {'account': accountManager.account.id, 'mailbox': accountManager.mailbox.id, 'msgsno': ids}, function(result) {
            for(var i in result.msgsno)
            {
                accountManager.mailbox.decrementMessagesTotal();
            }

            list.deselectAll();

            // And remove removed... (if you know what i mean...)
            list.removeRows(result.msgsno);

            accountManager.updateTrashMailbox(accountManager.account.id);
            accountManager.updateCurrentMailbox();

            self.app.trigger('onMessagesRemove', [ result.msgsno ]);
        });
    };



    /**
     * Search methods START.
     */
    this.searchInit = function() {
        this.search.input             = this.list.getNode().find('.mail-search-input');
        this.search.searchInContainer = this.list.getNode().find('.mail-search-in');
        this.search.cancelButton      = this.list.getNode().find('.mail-search-container span');

        var self    = this;
        var preview = this.app.layout.segment('preview');

        /**
         * Binding events for keys for search input.
         */
        this.search.input.keyup(function(e) {
            self.search.query = $(this).val();

            // 27 == ESC
            if(e.which == 27)
            {
                self.cancelSearch();

                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            if($(this).val().length < 3)
            {
                self.search.cancelButton.hide();
            }
            else
            {
                self.search.cancelButton.css('display', 'block');
            }

            if($(this).val().length < 3)
            {
                return true;
            }

            // 13 == Enter
            if(e.which == 13)
            {
                self.openPage(1);

                preview.showLoader();
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        /**
         * Change SearchIN condition.
         */
        this.search.searchInContainer.find('button').click(function() {
            self.search.searchInContainer.find('li').removeClass('active');
            $(this).parent().addClass('active');

            self.search.searchIn = $(this).attr('data-searchin');

            if(self.search.query != '')
            {
                self.renderMessages();
                self.search.input.focus();
            }
        });

        /**
         * Click on search Cancel Button.
         */
        this.search.cancelButton.click(function(e) {
            self.cancelSearch();
            return false;
        });
    };

    this.cancelSearch = function() {
        this.openPage(1);
        this.search.query = '';
        this.search.cancelButton.hide();
        this.search.input.val('');
        this.renderMessages();
    };

    this.paginationInit = function() {
        var self = this;
        this.list.getNode().find('.mails-pagination .prev a').click(function() {
            if(self.pagination.page > 1)
            {
                self.openPage(self.pagination.page - 1);
            }

            return false;
        });

        this.list.getNode().find('.mails-pagination .next a').click(function() {
            if(self.pagination.page < Math.ceil(self.pagination.total / self.pagination.perpage))
            {
                self.openPage(self.pagination.page + 1);
            }

            return false;
        });

        this.list.getNode().find('.mails-pagination .first a').click(function() {
            if(self.pagination.page != 1)
            {
                self.openPage(1);
            }

            return false;
        });

        this.list.getNode().find('.mails-pagination .last a').click(function() {
            if(self.pagination.page != Math.ceil(self.pagination.total / self.pagination.perpage))
            {
                self.openPage(Math.ceil(self.pagination.total / self.pagination.perpage));
            }

            return false;
        });

        this.list.getNode().find('.mails-pagination a').click(function() {
            return false;
        });
    };

    this.openPage = function(page) {
        if(page < 1)
        {
            page = 1;
        }

        if(page > Math.ceil(this.pagination.total / this.pagination.perpage))
        {
            page = Math.ceil(this.pagination.total / this.pagination.perpage);
        }

        this.pagination.page = page;
        this.renderMessages();
        this.list.scrollTop();
    };

    this.updatePagination = function() {
        if(this.pagination.total <= this.pagination.perpage)
        {
            this.list.getNode().find('.mails-pagination').hide();
        }
        else
        {
            this.list.getNode().find('.mails-pagination').show();
        }

        if(this.pagination.page == 1)
        {
            this.list.getNode().find('.mails-pagination .prev, .mails-pagination .first').addClass('disabled');
        }
        else
        {
            this.list.getNode().find('.mails-pagination .prev, .mails-pagination .first').removeClass('disabled');
        }

        if(this.pagination.page == Math.ceil(this.pagination.total / this.pagination.perpage))
        {
            this.list.getNode().find('.mails-pagination .next, .mails-pagination .last').addClass('disabled');
        }
        else
        {
            this.list.getNode().find('.mails-pagination .next, .mails-pagination .last').removeClass('disabled');
        }

        this.list.getNode().find('.mails-pagination .active a').text(this.pagination.page);
    };

    /*movable: {
        started: false,
        element: null,
        mailsMousedownEvent: function(e) {
            if(APP.Mail.list.getSelected().length == 0 || $(this).parent().hasClass('focused') == false)
            {
                return true;
            }

            $('body')
                .unbind('mousemove', APP.Mail.list.movable.events.mailsMousemoveEvent)
                .unbind('mouseup', APP.Mail.list.movable.events.mailsMouseupEvent)
                .bind('mousemove', APP.Mail.list.movable.events.mailsMousemoveEvent)
                .bind('mouseup', APP.Mail.list.movable.events.mailsMouseupEvent);

            APP.Mail.list.movable.start();

            e.preventDefault();
        },
        mailsMouseupEvent: function() {
            if(APP.Mail.list.getSelected().length == 0)
            {
                return true;
            }

            $('body')
                .unbind('mouseup', APP.Mail.list.movable.events.mailsMouseupEvent)
                .unbind('mousemove', APP.Mail.list.movable.events.mailsMousemoveEvent);

            APP.Mail.list.movable.stop();
        },
        mailsMousemoveEvent: function(e) {
            if(APP.Mail.list.getSelected().length == 0)
            {
                return true;
            }

            APP.Mail.list.movable.element.css({
                left: e.pageX + 2,
                top:  e.pageY + 2,
                display: 'block'
            });

            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        boxMouseenterEvent: function(e) {
            if(APP.Mail.list.movable.started == false)
            {
                return true;
            }

            $(this).addClass('mmt');
        },
        boxMouseleaveEvent: function(e) {
            if(APP.Mail.list.movable.started == false)
            {
                return true;
            }

            $(this).removeClass('mmt');
        },
        boxMouseupEvent: function(e) {
            if(APP.Mail.list.movable.started == false)
            {
                return true;
            }

            $('.mod-mail-container #mailbox-list li').removeClass('mmt');

            APP.Mail.list.action.moveToMailbox(APP.Mail.list.getSelected(), $(this).parent().parent().parent().attr('data-account'), $(this).attr('data-box'));

            console.log('boxMouseupEvent');
        },
        init: function() {
            $('.mail-list table tr td')
                .unbind('mousedown', APP.Mail.list.movable.events.mailsMousedownEvent)
                .bind('mousedown', APP.Mail.list.movable.events.mailsMousedownEvent);

            $('.mod-mail-container #mailbox-list li')
                .unbind('mouseenter', APP.Mail.list.movable.events.boxMouseenterEvent)
                .unbind('mouseleave', APP.Mail.list.movable.events.boxMouseleaveEvent)
                .unbind('mouseup', APP.Mail.list.movable.events.boxMouseupEvent)
                .bind('mouseenter', APP.Mail.list.movable.events.boxMouseenterEvent)
                .bind('mouseleave', APP.Mail.list.movable.events.boxMouseleaveEvent)
                .bind('mouseup', APP.Mail.list.movable.events.boxMouseupEvent);
        },
        start: function() {
            $('body').append('<div class="app-movable mail-movable-notif-window">Przenieś wiadomości (' + APP.Mail.list.getSelected().length + ') do...</div>');

            APP.Mail.list.movable.element = $('.mail-movable-notif-window');
            APP.Mail.list.movable.started = true;
        },
        stop: function() {
            APP.Mail.list.movable.element.remove();
            APP.Mail.list.movable.started = false;
        }
    }*/
};
