/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

/**
 * Segments of Layout. Each of it have own methods,
 */
Mail.Layout.Segment.Head = function(node, layout) {
    this.node   = node;
    this.layout = layout;

    /**
     * Initiation function
     */
    this.init = function() {

    };

    /**
     * Returns jQuery object of Head.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };
};
