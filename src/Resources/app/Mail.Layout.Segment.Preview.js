/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.Preview = function(node, layout) {
    this.node   = node;
    this.layout = layout;
    this.bussinesCardContainer = null;

    /**
     * Tell if SelectMessage nofitier can be showed next time.
     * @type boolean
     */
    this.selectMessagePrevented = false;

    /**
     * Initiation function
     */
    this.init = function() {
        this.showLoader();

        this.updateSizes();
    };

    /**
     * Returns jQuery object of Message Preview.
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };

    this.render = function(message, iFrameLoaded) {
        var self = this;

        this.bussinesCardContainer = APP.Movable.movable($('.contact-bussiness-card'));

        this.node.find('.mod-mail-mail-subject').text(message.subject);
        this.node.find('.mod-mail-mail-from').html(message.getFromFull());
        this.node.find('.mod-mail-mail-to').html(message.getToFull());
        this.node.find('.mod-mail-mail-date').text(message.dateFull);
        this.node.find('.mod-mail-mail-box').text(message.inboxName);

        var attachmentsContainer = this.layout.segment('preview-head').getNode().find('.message-attachments');
        attachmentsContainer.html('');

        if(message.attachments.length > 0)
        {
            attachmentsContainer.show();

            for(var i in message.attachments)
            {
                if(message.attachments[i].type == 'image')
                {
                    attachmentsContainer.append('<div class="attachment-item attachment-image" style="background-image:url(\'' + message.attachments[i].thumbnailUrl + '\');" title="' + message.attachments[i].name + '"><div class="hover"><a href="' + message.attachments[i].downloadUrl + '" title="Pobierz ten załącznik"><i class="fa fa-download"></i></a><a href="' + message.attachments[i].previewUrl + '" class="file-image" title="Podgląd załącznika"><i class="fa fa-search-plus"></i></a></div><span class="name">' + message.attachments[i].name + '</span></div>');
                }
                else
                {
                    attachmentsContainer.append('<div class="attachment-item attachment-file" title="' + message.attachments[i].name + '"><div class="file-icon"><i class="fa fa-file-' + (message.attachments[i].type == 'file' ? '' : message.attachments[i].type + '-') + 'o"></i></div><div class="hover"><a href="' + message.attachments[i].downloadUrl + '" title="Pobierz ten załącznik"><i class="fa fa-download"></i></a></div><span class="name">' + message.attachments[i].name + '</span></div>');
                }
            }
        }
        else
        {
            attachmentsContainer.hide();
        }

        /**
         * Images attachments we shows in popup.
         */
        attachmentsContainer.magnificPopup({
            delegate: 'a.file-image',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [1,1]
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        });

        /**
         * When click, we "focus" element.
         */
        attachmentsContainer.find('.attachment-item').click(function() {
            attachmentsContainer.find('.attachment-item').removeClass('focus');
            $(this).addClass('focus');
        });

        var iFrame = this.layout.segment('preview-body').getNode().find('iFrame')[0];
        
        iFrame.onload = function() {
            self.hideLoader();

            if(iFrameLoaded)
            {
                iFrameLoaded(iFrame);
            }

            self.layout.app.trigger('onMessagePreviewRender', [ message ]);

            var bq = $(iFrame.contentWindow.document).find('blockquote').eq(0);

            bq.hide();
            bq.before('<button type="button" class="btn btn-default message-show-history">Dalsza część wiadomości&hellip;</button>');

            bq.parent().find('.message-show-history').click(function() {
                $(this).remove();
                bq.show();
            });

            iFrame.contentWindow.scrollTo(0, 0);
            self.updateSizes();
        };

        var doc = iFrame.contentWindow.document;
        doc.open();
        doc.write('<!doctype html>' + '<html><head>' + '<title>' + message.subject + '</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE7"><link rel="stylesheet" href="' + APP.filePath('/modules/Mail/bootstrap/bootstrap.min.css') + '"><meta charset="utf-8" /><style>body{font-size:12px;padding:10px;}blockquote{font-size:12px;padding-right:0px;}</style></head><body>' + message.getContent() + '</body></html>');
        doc.close();
    };

    this.updateRelated = function(list) {
        var self = this;

        this.node.find('.mail-related-contacts').html('');

        if(list.length == 0)
        {
            this.node.find('.mail-related-contacts').append('<strong style="color:red;text-transform:uppercase;">' + APP.Locale.t('mailNoRelatedContacts') + '</strong>');
        }
        else
        {
            this.node.find('.mail-related-contacts').append('<strong>Powiązane: &nbsp; </strong>');
        }

        for(var i in list)
        {
            var listItem = $('<a href="#">' + ( list[i].isContractor ? '<i class="fa fa-briefcase"></i> ' : '<i class="fa fa-phone-square"></i> ' ) + list[i].name + '</a>');

            listItem.click(function() {
                self.bussinesCardContainer.object.find('.name').text($(this).data('name'));
                self.bussinesCardContainer.object.find('.company').text($(this).data('companyName'));
                self.bussinesCardContainer.object.find('.details .phone').text('Tel.: ' + $(this).data('phone'));
                self.bussinesCardContainer.object.find('.details .email').text('E-mail: ' + $(this).data('email'));
                self.bussinesCardContainer.object.find('.position').text($(this).data('position'));
                self.bussinesCardContainer.object.find('.edit-link').attr('href', $(this).data('editURL'));

                self.bussinesCardContainer.open();
            })
            .data('name', list[i].name)
            .data('email', list[i].email)
            .data('phone', list[i].phone)
            .data('companyName', list[i].companyName)
            .data('position', list[i].position)
            .data('editURL', list[i].editURL);

            this.node.find('.mail-related-contacts').append(listItem);
        }
    };

    /**
     * Checks current height of message header, and updates view sizes.
     * 
     * @return void
     */
    this.updateSizes = function() {
        this.layout.segment('preview-body').getNode().css('top', this.layout.segment('preview-head').getHeight());
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

    this.preventSelectMessageShow = function() {
        this.selectMessagePrevented = true;
    };

    this.showSelectMessage = function() {
        if(this.selectMessagePrevented)
            this.selectMessagePrevented = false;
        else
            this.node.find('.info-layer.type-select').show();
    };

    this.hideSelectMessage = function() {
        this.node.find('.info-layer.type-select').hide();
    };
};
