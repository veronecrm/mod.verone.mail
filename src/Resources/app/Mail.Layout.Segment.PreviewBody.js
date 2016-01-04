/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.PreviewBody = function(node, layout) {
    this.node   = node;
    this.layout = layout;

    /**
     * Initiation function
     */
    this.init = function() {

    };

    /**
     * Returns jQuery object of Message Preview Body.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };
};
