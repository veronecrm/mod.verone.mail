/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.Layout.Segment.Windows = function(node, layout) {
    this.node    = node;
    this.layout  = layout;
    this.manager = null;

    this.windowsBarOpened = false;

    /**
     * Initiation function
     */
    this.init = function() {
        this.manager = this.layout.app.getManager('window');
    };

    /**
     * Generate necesary elements of window. Bar on WindowsBar and framework of
     * the window. Next, calls the content method of windows, and methods generate
     * content of this window itself.
     * 
     * @param  object o Window Object.
     * @return void
     */
    this.createElements = function(o) {
        var self = this;

        // Creating bar i Windows Bar
        self.getNode().append('<div class="window-bar" id="window-bar-' + o.id + '" data-id="' + o.id + '"><h3>' + o.name + '</h3></div>');

        // Creating Windows framework
        $('body').append('<div class="mail-window" id="window-' + o.id + '"><div class="mail-window-backlay"></div><div class="mail-window-wrap"><div class="window-head"><h3>' + o.name + '</h3><div class="mbtns"><button type="button" class="mbtn-minimalyze"><i class="fa fa-minus"></i></button><button type="button" class="mbtn-destroy"><i class="fa fa-remove"></i></button></div></div><div class="window-body"></div></div></div>')

        // Toogle Window visibility on the screen.
        self.getNode().find('#window-bar-' + o.id).click(function() {
            var wind = self.manager.get($(this).data('id'));

            if(wind.opened)
            {
                wind.close();
            }
            else
            {
                wind.open();
            }
        });

        // Minimalyze button
        $('.mail-window#window-' + o.id + ' button.mbtn-minimalyze').click(function() {
            o.close();
        });

        // Minimalyze by clicking on background
        $('.mail-window#window-' + o.id + ' .mail-window-backlay').click(function() {
            o.close();
        });

        // Destroy button
        $('.mail-window#window-' + o.id + ' button.mbtn-destroy').click(function() {
            self.manager.destroy(o.id);
        });
    };

    this.destroy = function(id) {
        $('.window-bar#window-bar-' + id).remove();
        $('.mail-window#window-' + id).remove();
    };

    this.openWindowsBar = function(height) {
        if(this.windowsBarOpened === false)
        {
            this.getNode().show();
            this.layout.segment('body').getNode().css('bottom', this.getNode().outerHeight());
            this.windowsBarOpened = true;
        }
    };

    this.closeWindowsBar = function() {
        if(this.windowsBarOpened === true)
        {
            this.getNode().hide();
            this.layout.segment('body').getNode().css('bottom', '0px');
            this.windowsBarOpened = false;
        }
    };

    /**
     * Returns jQuery object of Windows Bar.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return this.node;
    };
};
