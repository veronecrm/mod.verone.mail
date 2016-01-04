/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Message.Manager = function(app) {
    /**
     * Application object.
     * @type Mail.App.Main
     */
    this.app = app;

    this.cache = {};

    /**
     * Current opened message in preview.
     * @type object
     */
    this.currentInPreview = null;

    /**
     * Initiation function
     */
    this.init = function() {
        var self = this;

        this.app.bind('onAccountsListEmpty', function() {
            self.app.layout.segment('preview')
                .hideLoader()
                .coverPreview();
        });
    };

    this.getCurrentMessage = function() {
        return this.currentInPreview;
    };

    /**
     * Show message in preview section of layout.
     * 
     * @param  integer id Message ID.
     * @return void
     */
    this.preview = function(id) {
        var self = this;

        this.app.layout.segment('preview').showLoader();

        // If message is in Cache
        if(this.cache[id])
        {
            var message           = new Mail.App.Message.Incomming();
            message.id            = this.cache[id].data.id;
            message.subject       = this.cache[id].data.subject;
            message.to            = this.cache[id].data.toString;
            message.contentHtml   = this.cache[id].data.textHtml;
            message.contentPlain  = this.cache[id].data.textPlain;
            message.date          = this.cache[id].data.date_timestamp;
            message.dateTimeAgo   = this.cache[id].data.date_timeago;
            message.dateFull      = this.cache[id].data.date_full;
            message.fromAddress   = this.cache[id].data.fromAddress;
            message.fromName      = this.cache[id].data.fromName;
            message.replyTo       = this.cache[id].data.replyToString;
            message.attachments   = this.cache[id].data.attachments;
            message.inboxName     = self.app.getManager('account').account.name;
            message.related       = this.cache[id].related;
            message.fromCache     = true;

            self._previewMessage(message);
        }
        else
        {
            this.app.api.call('openMail', {
                'account': self.app.getManager('account').account.id,
                'mailbox': self.app.getManager('account').mailbox.id,
                'msgno': id,
                'markAsSeen': 'yes'
            }, function(result) {
                var message           = new Mail.App.Message.Incomming();
                message.id            = result.data.id;
                message.subject       = result.data.subject;
                message.to            = result.data.toString;
                message.contentHtml   = result.data.textHtml;
                message.contentPlain  = result.data.textPlain;
                message.date          = result.data.date_timestamp;
                message.dateTimeAgo   = result.data.date_timeago;
                message.dateFull      = result.data.date_full;
                message.fromAddress   = result.data.fromAddress;
                message.fromName      = result.data.fromName;
                message.replyTo       = result.data.replyToString;
                message.attachments   = result.data.attachments;
                message.inboxName     = self.app.getManager('account').account.name;
                message.related       = result.related;
                message.fromCache     = false;

                self.cache[id] = result;

                self._previewMessage(message);
            });
        }
    };

    this._previewMessage = function(message) {
        var self = this;

        this.currentInPreview = message;
        this.app.layout.segment('preview').render(message, function(iFrame) {
            $(iFrame.contentWindow.document).find('a[href*=mailto]').click(function(e) {
                e.preventDefault();

                self.newMessage({
                    account : self.app.getManager('account').account.id,
                    mailbox : self.app.getManager('account').mailbox.id,
                    to      : $(this).attr('href').split(':')[1]
                });

                return false;
            });
        });
        this.app.layout.segment('preview').updateRelated(message.related);
        this.app.getManager('list').markAs([message.id], 'seen');
    };

    this.newMessage = function(params) {
        /**
         * Extends params object,
         */
        params = $.extend({
            account  : null,
            mailbox  : null,
            isReply  : 0,
            isForward: 0,
            originalMessageId : 0,
            content  : '',
            to       : '',
            fromName : '',
            fromAddress : '',
            date     : '',
            subject  : ''
        }, params);

        var wnd = this.app.getManager('window').create(APP.t('mailNewEmail'), new Mail.Layout.Content.Message.Write(params));
        wnd.open();

        if(params.isForward)
        {
            wnd.content.forbidSubmit();

            this.app.api.call('copyAttachments', {
                account  : params.account,
                mailbox  : params.mailbox,
                msgno    : params.originalMessageId,
                windowId : wnd.id
            }, function(data) {
                var result = jQuery.parseJSON(data);

                for(var i in result.data)
                {
                    wnd.content.appendAttachment(result.data[i]);
                }

                wnd.content.allowSubmit();
            }, function() {
                wnd.content.allowSubmit();
            });
        }

        return wnd;
    };

    this.submitMessageFromWindow = function(windowId) {
        var self    = this;
        var wnd     = this.app.getManager('window').get(windowId);
        var wndNode = wnd.getNode();

        // New Message object
        var message     = new Mail.App.Message.Outgoing();
        // Message content
        message.subject = wndNode.find('input[name=message_write_subject]').val();
        message.to      = wndNode.find('input[name=message_write_to]').val();
        message.content = wndNode.find('.message_write_content').code();

        // Message metadata
        message.isReply     = wndNode.find('input[name=message_write_isreply]').val();
        message.isForward   = wndNode.find('input[name=message_write_isforward]').val();
        message.messageDate = null;
        message.originalMessageId = wndNode.find('input[name=message_write_original_msgid]').val();
        message.mailbox     = wndNode.find('input[name=message_write_mailbox]').val();
        message.account     = wndNode.find('input[name=message_write_account]').val();
        message.cc          = wndNode.find('input[name=message_write_cc]').val();
        message.bcc         = wndNode.find('input[name=message_write_bcc]').val();
        message.contentMustBePlain = false;
        message.windowId    = windowId;

        wnd.showLoader();

        this.app.api.call('send', message, function(result) {
            if(result.status == 'success')
            {
                APP.FluidNotification.open(result.message, { theme: 'success' });
                self.app.getManager('window').destroy(windowId);
            }
            else
            {
                APP.FluidNotification.open(result.message, { theme: 'error' });
            }

            self.app.getManager('account').updateSentMailbox(message.account);

            wnd.hideLoader();
        });
    };
};
