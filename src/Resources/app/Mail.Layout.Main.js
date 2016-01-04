/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Main = function(target, options) {
    /**
     * jQuery object of target, where Mail Layout will be placed.
     */
    this.target = target;

    /**
     * Store Layout options.
     */
    this.options = options;

    /**
     * Store App object.
     */
    this.app = null;

    /**
     * Stores object of default options.
     */
    this.defaults = {
        /**
         * Define type of layout.
         * Allowed values: 1, 2
         */
        type: 1,
        /**
         * Stores default sizes of elements in layout
         */
        sizes: {
            /**
             * Width of menu with mail folders.
             */
            menu: 300,
            /**
             * Height of list with mails.
             */
            list: 200
        }
    };

    /**
     * Stores layout segments objects.
     */
    this.segments = {};

    /**
     * Initiation function
     */
    this.init = function() {
        this.options = $.extend(true, this.defaults, this.options);

        this.target.removeAttr('class').addClass('layout-type-' + this.options.type);

        this.resolveSegments();
    };

    this.resolveSegments = function() {
        this.segments['head']     = new Mail.Layout.Segment.Head($('#head', this.target), this);
        this.segments['body']     = new Mail.Layout.Segment.Body($('#body', this.target), this);
        this.segments['accounts'] = new Mail.Layout.Segment.Accounts($('#accounts', this.target), this);
        this.segments['content']  = new Mail.Layout.Segment.Content($('#content', this.target), this);
        this.segments['list']     = new Mail.Layout.Segment.List($('#list', this.target), this);
        this.segments['preview-head'] = new Mail.Layout.Segment.PreviewHead($('#mp-head', this.target), this);
        this.segments['preview-body'] = new Mail.Layout.Segment.PreviewBody($('#mp-body', this.target), this);
        this.segments['preview']  = new Mail.Layout.Segment.Preview($('#message-preview', this.target), this);
        this.segments['windows']  = new Mail.Layout.Segment.Windows($('#windows', this.target), this);

        for(var i in this.segments)
        {
            this.segments[i].init();
        }
    };

    this.setApp = function(app) {
        this.app = app;
    };

    /**
     * Returns Layout segment by given name. Segment is wraped by
     * Class, and stores jQuery object in method named node().
     * 
     * @param  string name Name of Layout segment.
     * @return Mail.Layout.Segment.*
     */
    this.segment = function(name) {
        return this.segments[name];
    };
};
