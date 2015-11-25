/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Recipient.SelectorEntity = function(manager, selector, selected, onClose) {
    this.manager  = manager;
    this.selector = selector;
    this.selected = selected;
    this.onClose  = onClose;

    this.init = function() {
        this.selector = $(this.selector);
        this.selected = this.resolveSelected(this.selected);

        var self = this;
        var customMails = [];

        // We select on list, selected mails
        for(var i = 0; i < this.selected.length; i++)
        {
            var cs = this.selected[i];

            this.selector.find('.mod-mail-recipients-list ul li').each(function() {
                if(cs != null && cs.address == $(this).data('address'))
                {
                    $(this).addClass('selected');
                    cs = null;
                }
            });

            /**
             * If this mail wan't added to predefined list, we must add it to custol list.
             */
            if(cs != null && cs.name != '' && cs.address != '')
            {
                customMails.push(cs.name + ' <' + cs.address + '>');
            }
        }

        self.selector.find('input[name=other_recipients]').val(customMails.join(', '));

        // Search button
        this.selector.find('.recipient-search').keyup(function() {
            var searchFor = $(this).val();

            if(searchFor.length <= 2)
            {
                $(this).parent().find('.form-control-feedback').css('display', 'none');
                self.selector.find('.mod-mail-recipients-list ul li').show();
                return false;
            }

            self.selector.find('.mod-mail-recipients-list ul li').each(function() {
                var name = $(this).text().toLowerCase();
                var addr = $(this).attr('data-address').toLowerCase();

                if(name.indexOf(searchFor) == -1 && addr.indexOf(searchFor) == -1)
                {
                    $(this).hide();
                }
                else
                {
                    $(this).show();
                }
            });

            $(this).parent().find('.form-control-feedback').css('display', 'block');
        });

        // Close search
        this.selector.find('.recipient-search').parent().find('.form-control-feedback').click(function() {
            self.selector.find('.recipient-search').val('').trigger('keyup');
        });

        // Select/deselect by clicking on element
        this.selector.find('.mod-mail-recipients-list ul li').click(function() {
            if($(this).hasClass('selected'))
            {
                $(this).removeClass('selected');
            }
            else
            {
                $(this).addClass('selected');
            }
        });

        // Close modal - do nothing else
        this.selector.find('.btn-close, button.close').click(function() {
            self.selector.modal('hide');
            return false;
        });

        // Close modal - notify notifier (onClose)
        this.selector.find('.btn-confirm').click(function() {
            var result = [];

            self.selector.find('.mod-mail-recipients-list ul li').each(function() {
                if($(this).hasClass('selected'))
                {
                    result.push({name: $(this).find('span').text(), address: $(this).data('address')});
                }
            });

            // Parse data from custom addresses and append them to result.
            var custom = self.manager.parseString(self.selector.find('input[name=other_recipients]').val(), true);

            if(custom.length)
            {
                for(var i in custom)
                {
                    if(custom[i].name != '' && custom[i].address != '')
                    {
                        result.push({name: custom[i].name, address: custom[i].address});
                    }
                }
            }

            self.selector.modal('hide');
            self.onClose(result);
        });
    };

    this.resolveSelected = function(source) {
        var newSelected = [];

        if(typeof source == 'string')
        {
            newSelected = this.manager.parseString(source, true);
        }
        else if(typeof source == 'Array')
        {
            alert('array');
        }

        return newSelected;
    };

    this.open = function() {
        var self = this;

        this.selector.modal('show');
    };

    this.getSelected = function() {
        return this.selected;
    };
};
