/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.Content = function(node, layout) {
    this.node   = node;
    this.layout = layout;

    /**
     * Initiation function
     */
    this.init = function() {
        
    };

    /**
     * Returns jQuery object of Content.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };
};
