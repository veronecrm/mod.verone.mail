/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Api = function(basepath) {
    this.basepath = basepath;

    this.call = function(api, params, callback, error) {
        $.ajax({
            type     : "POST",
            url      : this.basepath.replace('METHOD', api),
            data     : params,
            success  : callback,
            error    : error
        });
    };
};
