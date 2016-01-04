/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.PreviewHead = function(node, layout) {
    this.node   = node;
    this.layout = layout;

    this.init = function() {

    };

    /**
     * Returns jQuery object of Message Preview Head.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };

    this.getHeight = function() {
        return this.node.outerHeight();
    };
};
