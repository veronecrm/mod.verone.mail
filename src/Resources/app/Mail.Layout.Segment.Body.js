/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.Body = function(node, layout) {
    this.node   = node;
    this.layout = layout;

    /**
     * Initiation function
     */
    this.init = function() {

    };

    /**
     * Returns jQuery object of Body.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };
};
