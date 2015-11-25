/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Recipient.Manager = function(app) {
    /**
     * Application object.
     * @type Mail.App.Main
     */
    this.app = app;

    /**
     * Initiation function
     */
    this.init = function() {
        
    };

    this.openSelector = function(selected, onClose) {
        $('#mail-recipients-list').remove();
        $('#mail-templates #content-recipients-list > div').clone(true, true).addClass('modal').addClass('fade').attr('id', 'mail-recipients-list').appendTo('body');

        var entity = new Mail.App.Recipient.SelectorEntity(this, '#mail-recipients-list', selected, onClose);
                entity.init();
                entity.open();

        return entity;
    };

    this.parseString = function(data, asPairs) {
        var interation = 0;
        var index      = 'name';
        var result     = [];
                result[interation] = {};
                result[interation][index] = '';
        var arrayString = data.split('');

        for(var i in arrayString)
        {
            var chr = arrayString[i];

            switch(chr)
            {
                case '<':
                    index = 'address';
                    break;
                case '>':
                    break;
                case ',':
                    interation++;
                    index = 'name';
                    break;
                default:
                    if(! result[interation])
                    {
                        result[interation] = {};
                    }

                    if(! result[interation][index])
                    {
                        result[interation][index] = '';
                    }

                    result[interation][index] += chr;
            }
        }

        var newResult  = [];
        var interation = 0;

        for(var i in result)
        {
            newResult[interation] = {
                address: '',
                name: ''
            };

            if(result[i].address)
            {
                newResult[interation].address = jQuery.trim(result[i].address);
            }
            else
            {
                if(this.isValid(jQuery.trim(result[i].name)))
                {
                    newResult[interation].address = jQuery.trim(result[i].name);
                }
                else
                {
                    continue;
                }
            }

            if(result[i].name)
            {
                newResult[interation].name = jQuery.trim(result[i].name);
            }
            else
            {
                newResult[interation].name = '"' + jQuery.trim(result[i].address) + '"';
            }

            interation++;
        }

        if(asPairs)
        {
            return newResult;
        }
        else
        {
            var result = [];

            for(var i in newResult)
            {
                result.push(newResult[i].name + ' <' + newResult[i].address + '>');
            }

            return result;
        }
    }

    this.isValid = function(address) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(address);
    };
};
