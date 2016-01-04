/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Api = function(basepath) {
    this.basepath = basepath;

    this.call = function(api, params, success, error) {
        APP.AJAX.call({
            type : 'POST',
            url  : this.basepath.replace('METHOD', api),
            data : params,
            success : success,
            error   : error
        });
    };

    this.callRaw = function(api, params, success, error) {
        APP.AJAX.call({
            type : 'POST',
            url  : this.basepath.replace('METHOD', api),
            data : params,
            parseResult: false,
            success : success,
            error   : error
        });
    };
};
