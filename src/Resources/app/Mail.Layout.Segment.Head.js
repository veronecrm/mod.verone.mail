/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
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
        var self = this;

        this.layout.app.bind('onAccountsListEmpty', function() {
            self.hideHead();
        });
    };

    /**
     * Returns jQuery object of Head.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };

    this.showHead = function() {
        this.node.find('.info-layer.type-empty').hide();

        return this;
    };

    this.hideHead = function() {
        this.node.find('.info-layer.type-empty').show();

        return this;
    };
};
