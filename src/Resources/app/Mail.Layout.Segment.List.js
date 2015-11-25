/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.List = function(node, layout) {
    this.node    = node;
    this.layout  = layout;

    this.focused = false;

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

    this.mcsScrollTop = 0;

    /**
     * Initiation function
     */
    this.init = function() {
        var self = this;

        self.showLoader();

        self.resizeValues.current = self.resizeValues.calculated = self.setSize(self.layout.options.sizes.messages);

        $('#layout-resize-list', this.node).mousedown(function(e) {
            self.resizeValues.x = e.pageX;
            self.resizeValues.y = e.pageY;
            self.resizeValues.started = true;

            e.preventDefault();
        });

        $('body, html').mousemove(function(e) {
            if(self.resizeValues.started)
            {
                if(self.layout.options.type == 1)
                {
                    self.resizeValues.calculated = self.setSize(self.resizeValues.current + (e.pageY - self.resizeValues.y));
                }
                else if(self.layout.options.type == 2)
                {
                    self.resizeValues.calculated = self.setSize(self.resizeValues.current + (e.pageX - self.resizeValues.x));
                }

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

                self.layout.app.trigger('onMessagesSizeChange', [self.resizeValues.calculated]);
            }
        });

        var self = this;

        /**
         * Code below is responsible for showind (disabling) buttons in mails lists
         * when list of selected mails changes.
         */
        this.layout.app.bind('onMessagePreviewRender', function() {
            $('.btn-mail-reply').removeAttr('disabled');
            $('.btn-mail-forward').removeAttr('disabled');
        });

        this.layout.app.bind('onMessageSelectedChange', function() {
            $('.btn-mail-reply').attr('disabled', 'disabled');
            $('.btn-mail-forward').attr('disabled', 'disabled');
            $('.btn-mail-remove').attr('disabled', 'disabled');
            $('.btn-mail-as-seen').attr('disabled', 'disabled');
            $('.btn-mail-as-unseen').attr('disabled', 'disabled');

            if(self.getSelected().length == 1)
            {
                $('.btn-mail-remove').removeAttr('disabled');
                $('.btn-mail-as-seen').removeAttr('disabled');
                $('.btn-mail-as-unseen').removeAttr('disabled');
            }
            else if(self.getSelected().length > 1)
            {
                $('.btn-mail-remove').removeAttr('disabled');
                $('.btn-mail-as-seen').removeAttr('disabled');
                $('.btn-mail-as-unseen').removeAttr('disabled');
            }
        });

        if($.fn.mCustomScrollbar)
        {
            this.node.find('.mails-list .mails-list-inner').mCustomScrollbar({
                theme: 'minimal-dark',
                scrollEasing: 'linear',
                scrollInertia: 200,
                mouseWheel: {
                    scrollAmount: 150
                },
                callbacks: {
                    whileScrolling: function() {
                        self.mcsScrollTop = this.mcs.top;
                    }
                }
            });
        }

        this.node.find('.mails-list').focusin(function() {
            self.focused = true;
        }).focusout(function() {
            self.focused = false;
        });
    };

    this.renderMessages = function(messages)
    {
        var listContainer = this.node.find('.mails-list .wrapp');

        for(var i in messages)
        {
            var row = '';

            row += '<div class="select"><input type="checkbox" name="message[]" value="' + messages[i].uid + '" /></div>';
            // @todo checks if mailbox is Sent and change from/to message is.
            //row += '<div class="author">' + (self.options.mailbox.indexOf('Sent') == -1 ? messages[i].from : messages[i].to) + '</div>';
            row += '<div class="author">' + messages[i].from + '</div>';
            row += '<div>' + messages[i].subject + '</div>';
            row += '<div class="size">' + messages[i].size + '</div>';
            row += '<div class="date">' + messages[i].date + '</div>';

            listContainer.append('<div data-msgno="' + messages[i].uid + '" class="message-row ' + (messages[i].seen == 0 ? ' status-unseen' : '') + '">' + row + '</tr>');
        }

        if($.fn.mCustomScrollbar)
        {
            this.node.find('.mails-list .mails-list-inner').mCustomScrollbar('update');
        }
    }

    /**
     * Sets size of messages list segment.
     * 
     * @param integer size Size in pixels.
     * @return integer Fixed size of list.
     */
    this.setSize = function(size) {
        if(size <= 150)
        {
            size = 150;
        }

        if(this.layout.options.type == 1)
        {
            this.node.css('height', size + 'px');
            this.layout.segment('preview').getNode().css('top', size + 'px');
        }
        else if(this.layout.options.type == 2)
        {
            this.node.find('.mails-list').css('width', size + 'px');
            this.node.find('#layout-resize-list').css('left', size + 'px');
            this.layout.segment('preview').getNode().css('left', size + 'px');
        }

        return size;
    };

    /**
     * Scrolls to top of the list.
     *
     * @return void
     */
    this.scrollTop = function() {
        if($.fn.mCustomScrollbar)
        {
            this.node.find('.mails-list .mails-list-inner').mCustomScrollbar('scrollTo', 0);
        }
        else
        {
            this.node.find('.mails-list .mails-list-inner').scrollTop(0);
        }
    };


    /**
     * Scrolls to first of the selected (on list) message.
     *
     * @return void
     */
    this.scrollToFirstSelected = function() {
        var list       = this.node.find('.mails-list');
        var listHeight = list.innerHeight();

        if($.fn.mCustomScrollbar)
        {
            var listTop    = Math.abs(this.mcsScrollTop);
            var listBottom = listTop + listHeight;
        }
        else
        {
            var listTop    = list.get(0).scrollTop;
            var listBottom = listTop + listHeight;
        }

        var element        = this.node.find('.mails-list .wrapp .focused').first();
        var elementTop     = element.get(0).offsetTop;
        var elementBottom  = elementTop + element.outerHeight();
        /**
         * If placed between top and bottom line of list, we do nothing.
         */
        if(listTop <= elementTop && listBottom >= elementBottom)
        {
            return false;
        }

        var scrollTo = 0;

        /**
         * Otherwise, we calculate if user get next or prev mesage,
         * and scroll list to see this message.
         */
        // Scroll to top
        if(listTop > elementTop)
        {
            scrollTo = elementTop;
        }

        if(listBottom < elementBottom)
        {
            scrollTo = elementBottom - listHeight;
        }

        if($.fn.mCustomScrollbar)
        {
            this.node.find('.mails-list .mails-list-inner').mCustomScrollbar('scrollTo', scrollTo);
        }
        else
        {
            this.node.find('.mails-list .mails-list-inner').scrollTop(scrollTo);
        }
    };

    /**
     * Returns jQuery object of Mails list.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };

    /**
     * Shows loader that covers all acounts and view
     * information text for user to wait.
     *
     * @return void
     */
    this.showLoader = function() {
        this.node.find('.info-layer.type-loading').show();
    };

    /**
     * Hides loader.
     *
     * @return void
     */
    this.hideLoader = function() {
        this.node.find('.info-layer.type-loading').hide();
    };

    this.showNoMessages = function() {
        this.node.find('.info-layer.type-no-messages').show();
    };

    this.hideNoMessages = function() {
        this.node.find('.info-layer.type-no-messages').hide();
    };

    /**
     * Return information if list of messages is focused.
     * 
     * @return boolean
     */
    this.isFocused = function() {
        return this.focused;
    };

    /**
     * Sets focus on messages list.
     *
     * @return void
     */
    this.setFocus = function() {
        this.node.find('.mails-list').trigger('focus');
    };

    /**
     * Returns message row (jQuery object) of given ID.
     * 
     * @param  integer id Message ID
     * @return jQuery
     */
    this.getMessageRow = function(id)
    {
        return this.node.find('.mails-list .wrapp div[data-msgno="' + id + '"]');
    };

    /**
     * Selects (check as selected) rows with given ID's in array.
     * 
     * @param  array ids Array of messages ID's.
     * @return void
     */
    this.select = function(ids) {
        for(var i in ids)
        {
            this.node.find('.mails-list .wrapp div[data-msgno="' + ids[i] + '"]')
            .addClass('focused')
            .find('.select input').each(function() {
                $(this)[0].checked = true;
            });
        }

        this.layout.app.trigger('onMessageSelectedChange', {'ids': ids, 'type': 'select'});
    };

    /**
     * Deselects (uncheck as selected) rows with given ID's in array.
     * 
     * @param  array ids Array of messages ID's.
     * @return void
     */
    this.deselect = function(ids) {
        for(var i in ids)
        {
            this.node.find('.mails-list .wrapp div[data-msgno="' + ids[i] + '"]')
            .removeClass('focused')
            .find('.select input').each(function() {
                $(this)[0].checked = false;
            });
        }

        this.layout.app.trigger('onMessageSelectedChange', {'ids': ids, 'type': 'deselect'});
    };

    /**
     * Selects all mails in list.
     * 
     * @return void
     */
    this.selectAll = function() {
        var ids = [];

        this.node.find('.mails-list .wrapp .select input').each(function() {
            $(this)[0].checked = true;

            $(this).parent().parent().addClass('focused');

            ids.push($(this).val());
        });

        this.layout.app.trigger('onMessageSelectedChange', {'ids': ids, 'type': 'select'});
    };

    /**
     * Deselects all selected mails in list.
     * 
     * @return void
     */
    this.deselectAll = function() {
        var ids = [];

        this.node.find('.mails-list .wrapp div.message-row').removeClass('focused');

        this.node.find('.mails-list .wrapp .select input').each(function() {
            $(this)[0].checked = false;

            ids.push($(this).val());
        });

        this.layout.app.trigger('onMessageSelectedChange', {'ids': ids, 'type': 'deselect'});
    };

    /**
     * Selects (check as selected) all unseen messages on list.
     * 
     * @return void
     */
    this.selectUnseen = function() {
        var ids = [];

        this.node.find('.mails-list .wrapp div.status-unseen .select input').each(function() {
            $(this)[0].checked = true;

            $(this).parent().parent().addClass('focused');

            ids.push($(this).val());
        });

        this.layout.app.trigger('onMessageSelectedChange', {'ids': ids, 'type': 'select'});
    };

    /**
     * Returns info, if given message ID is selected on mails list.
     * 
     * @param  integer id ID of message.
     * @return boolean
     */
    this.isSelected = function(id) {
        return this.node.find('.mails-list .wrapp div[data-msgno="' + id + '"]').hasClass('focused');
    };

    /**
     * Returns array of ID's of selected messages on list.
     * 
     * @return array
     */
    this.getSelected = function() {
        var list = [];

        this.node.find('.mails-list .wrapp .select input:checked').each(function() {
            list.push($(this).val());
        });

        return list;
    };

    /**
     * Returns info, if given message ID is unseen.
     * 
     * @param  integer id ID of message.
     * @return boolean
     */
    this.isUnseen = function(id) {
        return this.node.find('.mails-list .wrapp div[data-msgno="' + id + '"]').hasClass('status-unseen');
    };

    /**
     * Mark given mails ID's as (status) unseen.
     * 
     * @param  array ids Array of ID's.
     * @return void
     */
    this.markAsUnseen = function(ids) {
        for(var i in ids)
        {
            this.node.find('.mails-list .wrapp div[data-msgno="' + ids[i] + '"]').addClass('status-unseen');
        }
    };

    /**
     * Mark given mails ID's as (status) seen.
     * 
     * @param  array ids Array of ID's.
     * @return void
     */
    this.markAsSeen = function(ids) {
        for(var i in ids)
        {
            this.node.find('.mails-list .wrapp div[data-msgno="' + ids[i] + '"]').removeClass('status-unseen');
        }
    };

    /**
     * Removes messages rows from messages list.
     * 
     * @param  array ids Array of messages ID's.
     * @return void
     */
    this.removeRows = function(ids) {
        for(var i in ids)
        {
            this.node.find('.mails-list .wrapp div[data-msgno="' + ids[i] + '"]').remove();
        }
    };
};
