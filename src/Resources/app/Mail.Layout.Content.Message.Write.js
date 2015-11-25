/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

/**
 * Entity of Window Content that manage new message content.
 */
Mail.Layout.Content.Message.Write = function(message) {
    /**
     * Window ID.
     * @type string
     */
    this.windowId = null;
    this.layout = null;
    this.app = null;

    this.message = message;

    /**
     * Sets Window ID.
     *
     * @param string id Window ID.
     */
    this.setWindowId = function(id) {
        this.windowId = id;
    };

    /**
     * Sets Layout object.
     *
     * @param string layout Layout object.
     */
    this.setLayout = function(layout) {
        this.layout = layout;
    }

    this.setApp = function(app) {
        this.app = app;
    };

    this.allowSubmit = function() {
        this.getWindowNode().find('.btn-mail-send').removeAttr('disabled');
    };

    this.forbidSubmit = function() {
        this.getWindowNode().find('.btn-mail-send').attr('disabled', 'disabled');
    };

    /**
     * Renders new message content in Window.
     */
    this.render = function() {
        var wind = this.getWindowNode();
        var self = this;

        wind.find('.window-body').append($('#mail-templates #content-message-write > div').clone());

        this.updateMessageData();

        /**
         * EDITOR
         */
        $('#window-' + self.windowId + ' .message_write_content')
            .attr('id', 'message-write-content-' + self.windowId);

        $('#message-write-content-' + self.windowId).summernote({
            height: 400,
            minHeight: null,
            maxHeight: null,
            focus: true,
            lang: 'pl-PL'
        });



        /**
         * ATTACHMENTS
         */
        $('#window-' + self.windowId + ' input.attachments')
            .attr('id', 'message-write-attachments-' + self.windowId);

        $('#message-write-attachments-' + self.windowId).fileupload({
            url: APP.createUrl('Mail', 'Mail', 'uploadAttachment'),
            dataType: 'json',
            // Send WindowID, to know, what attachments are sent with this message.
            formData: { windowId: self.windowId },
            dropZone: false,
            disableValidation: true,
            progress: function (e, data) {
                var file = data.files[0];
                self.setProgressBar(self.hashCode(file.name), parseInt(data.loaded / data.total * 100, 10));
            },
            done: function (e, data) {
                $.each(data.result.files, function(index, file) {
                    if(file.error)
                    {
                        self.setErrorProgressBar(self.hashCode(file.name), file.error);
                    }
                    else
                    {
                        self.successProgressBar(self.hashCode(file.name));

                        self.appendAttachment(file.name);
                    }
                });

                self.allowSubmit();
            },
            add: function (e, data) {
                var isAnyFILE = false;

                $.each(data.files, function (index, file) {
                    if(file.type == '')
                    {
                        return;
                    }

                    self.appendProgressBar(self.hashCode(file.name), file.name);

                    isAnyFILE = true;
                });

                if(isAnyFILE)
                {
                    data.submit();
                    self.forbidSubmit();
                }
            },
            fail: function (e, data) {
                console.log('error');
                console.log(data);
            },
            stop: function (e) {

            },
        });

        $('#window-' + self.windowId + ' .message-write-attachments-list').on('click', '.fa-remove', function() {
            var label = $(this).parent();
            var name  = label.attr('data-name');

            label.remove();

            self.app.api.call('removeOutgoingAttachment', {
                windowId: self.windowId,
                name: name
            }, function(msg) {
                
            });
        });



        /**
         * RECIPIENTS
         */
        wind.find('.window-body .message-write-addresses-list .label-new').click(function() {
            self.app.getManager('recipient').openSelector(wind.find('.window-body input[name=message_write_to]').val(), function(selected) {
                self.updateRecipients(selected);
            });
        });



        /**
         * SUBMIT CLICK - FIELDS VALIDATION
         */
        wind.find('.btn-mail-send').click(function() {
            if($(this).attr('disabled') == 'disabled')
            {
                return false;
            }

            if(wind.find('input[name=message_write_to]').val() == '')
            {
                alert('Podaj nadawców wiadomości.');
                wind.find('.message-write-addresses-list .label-new').trigger('click');

                return false;
            }

            if(wind.find('input[name=message_write_subject]').val() == '')
            {
                alert('Podaj temat wiadomości.');
                wind.find('input[name=message_write_subject]').trigger('focus');

                return false;
            }

            self.app.getManager('message').submitMessageFromWindow(self.windowId);
        });



        /**
         * ADDITIONALLY FIELDS
         */
        wind.find('.message-details-panel .write-add-fields button').click(function() {
            $(this).addClass('hidden');
            wind.find('.add-field.' + $(this).attr('data-field')).removeClass('hidden');
        });
    };

    this.updateMessageData = function() {
        var wndNode = this.getWindowNode();
        var subject = this.message.subject;
        var content = $('<div/>').html(this.message.content).html();

        // Prepare subject
        if(this.message.isReply)
        {
            subject = 'Re: ' + subject;
        }
        if(this.message.isForward)
        {
            subject = 'Fwd: ' + subject;
        }

        // Prepare Content
        if(this.message.isReply || this.message.isForward)
        {
            content = '<p><br></p><p>W dniu ' + this.message.date + ', <b>' + this.message.fromName + '</b> &lt;<a href="mailto:' + this.message.fromAddress + '">' + this.message.fromAddress + '</a>&gt; napisał:</p><blockquote style="margin-left: 7px; border-left: 2px solid #0088CC; padding-left: 8px;">' + content + '</blockquote>';
        }

        wndNode.find('input[name=message_write_account]').val(this.message.account);
        wndNode.find('input[name=message_write_mailbox]').val(this.message.mailbox);
        wndNode.find('input[name=message_write_isreply]').val(this.message.isReply);
        wndNode.find('input[name=message_write_isforward]').val(this.message.isForward);
        wndNode.find('input[name=message_write_original_msgid]').val(this.message.originalMessageId);
        wndNode.find('.message_write_content').html(this.app.options.message.footer + content);
        wndNode.find('input[name=message_write_to]').val(this.message.to);
        wndNode.find('input[name=message_write_subject]').val(subject);

        this.updateRecipients(this.app.getManager('recipient').parseString(this.message.to, true));

        /**
         * Remove default styles from Content, to prevent restyling CRM document.
         */
        var x = wndNode.find('.message_write_content').get(0).getElementsByTagName('style');
        for(var i = x.length - 1; i >= 0; i--)
            x[i].parentElement.removeChild(x[i]);
    };

    this.updateRecipients = function(selected) {
        var wind = this.getWindowNode();
        var self = this;

        // Remove current recipients labels
        wind.find('.window-body .message-write-addresses-list.labels-list-container div').not('.label-new').remove();

        var input = [];

        for(var i = 0; i < selected.length; i++)
        {
            if(selected[i].name == '' || selected[i].address == '')
            {
                continue;
            }

            // Recipent to input
            input.push(selected[i].name + '<' + selected[i].address + '>');

            // Append recipient label
            wind.find('.window-body .message-write-addresses-list.labels-list-container').append('<div data-address="' + selected[i].address + '">' + selected[i].name + ' <i class="fa fa-remove"></i></div>');
        }

        // Set recipients to input
        wind.find('.window-body input[name=message_write_to]').val(input.join(','));

        // Bind remove recipient by clicking on x
        wind.find('.window-body .message-write-addresses-list.labels-list-container .fa-remove').click(function() {
            var result    = self.app.getManager('recipient').parseString(wind.find('.window-body input[name=message_write_to]').val(), true);
            var newResult = [];
            var toRemove  = $(this).parent().attr('data-address');

            for(var i = 0; i < result.length; i++)
            {
                if(result[i].address != toRemove)
                {
                    newResult.push(result[i]);
                }
            }

            self.updateRecipients(newResult);
        });
    };

    this.appendAttachment = function(name) {
        $('#window-' + this.windowId + ' .message-write-attachments-list').append('<div data-name="' + name + '">' + name + ' <i class="fa fa-remove"></i></div>');
    };

    this.getWindowNode = function() {
        return this.app.getManager('window').get(this.windowId).getNode();
    };

    this.hashCode = function(input) {
        var hash = 0, i, chr, len;
        if (input.length == 0) return hash;
        for (i = 0, len = input.length; i < len; i++) {
            chr   = input.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    this.appendProgressBar = function(id, name) {
        var container = $('#window-' + this.windowId + ' .attachments-progress-box .progresses');

        container.append('<div class="pbar" id="pbar-' + id + '"><span>' + name + '</span><div class="progress" role="progressbar"><div class="progress-bar" style="width:0%"/></div></div></div>');
        container.parent().show();
    };

    this.removeProgressBar = function(id) {
        $('#window-' + this.windowId + ' .attachments-progress-box .progresses #pbar-' + id).remove();

        if($('#window-' + this.windowId + ' .attachments-progress-box .progresses .pbar').length == 0)
        {
            $('#window-' + this.windowId + ' .attachments-progress-box').hide();
        }
    };

    this.successProgressBar = function(id) {
        $('#window-' + this.windowId + ' .attachments-progress-box .progresses #pbar-' + id + ' .progress-bar').addClass('progress-bar-success');
        var self = this;

        setTimeout(function() {
            self.removeProgressBar(id);
        }, 5000);
    };

    this.setProgressBar = function(id, val) {
        $('#window-' + this.windowId + ' .attachments-progress-box .progresses #pbar-' + id + ' .progress-bar').width(val + '%');
    };

    this.getProgressBar = function(id) {
        return $('#window-' + this.windowId + ' .attachments-progress-box .progresses #pbar-' + id);
    };

    this.setErrorProgressBar = function(id, error) {
        var self = this;
        var bar  = $('#window-' + this.windowId + ' .attachments-progress-box .progresses #pbar-' + id);

        bar.append('<div class="error">' + error + '</div>');
        bar.find('.progress').remove();

        setTimeout(function() {
            self.removeProgressBar(id);
        }, 5000);
    };
};
