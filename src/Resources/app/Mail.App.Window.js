/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

/**
 * Instance of Window.
 * 
 * @param string id      Window ID.
 * @param string name    Window name/title.
 * @param object content Window content object.
 * @param object manager Windws Manager object.
 */
Mail.App.Window = function(id, name, content, manager) {
    /**
     * Window Identificator.
     * @type string
     */
    this.id = id;

    /**
     * Name/title of window.
     * @type string
     */
    this.name = name;

    /**
     * Window content object.
     * @type object
     */
    this.content = content;

    /**
     * Windows Manager object.
     * @type object
     */
    this.manager = manager;

    /**
     * Tells if Window is already opened (showed)
     * @type Boolean
     */
    this.opened = false;

    /**
     * Updates name of window.
     * 
     * @param string name Name of window you want to set.
     */
    this.setName = function(name) {
        this.name = name;

        $('.window-bar#window-bar-' + this.id + ' h3').text(this.name);
        $('.mail-window#window-' + this.id + ' .window-head h3').text(this.name);
    };

    /**
     * Opens (shows) window.
     *
     * @return void
     */
    this.open = function() {
        this.manager.closeAll();
        this.opened = true;

        $('.window-bar#window-bar-' + this.id).addClass('opened');
        $('.mail-window#window-' + this.id).show();
    };

    /**
     * Close (hides) window.
     *
     * @return void
     */
    this.close = function() {
        this.opened = false;

        $('.window-bar#window-bar-' + this.id).removeClass('opened');
        $('.mail-window#window-' + this.id).hide();
    };

    /**
     * Returns Window HTML node.
     *
     * @return jQuery
     */
    this.getNode = function() {
        return $('.mail-window#window-' + this.id);
    };

    /**
     * Appends loader, overflowed window.
     * @return void
     */
    this.showLoader = function() {
        this.getNode().find('.mail-window-wrap .window-body').append('<div class="loader loader-fit-to-container mail-window-loader"><div class="loader-animate"></div></div>');
    };

    /**
     * Hides Window loader.
     * @return void
     */
    this.hideLoader = function() {
        this.getNode().find('.mail-window-wrap .loader.mail-window-loader').remove();
    };
};
