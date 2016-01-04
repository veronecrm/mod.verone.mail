/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Main = function(options) {
    this.layout;
    this.api;
    this.manager = {
        account   : null,
        list      : null,
        message   : null,
        recipient : null,
        window    : null
    };
    this.options = options;

    this.dispatcher = null;

    this.preInit = function() {
        this.dispatcher = new Mail.EventDispatcher;
    };

    /**
     * Initiation function
     */
    this.init = function() {
        this.manager.account   = new Mail.App.Account.Manager(this);
        this.manager.list      = new Mail.App.List.Manager(this);
        this.manager.message   = new Mail.App.Message.Manager(this);
        this.manager.recipient = new Mail.App.Recipient.Manager(this);
        this.manager.window    = new Mail.App.Window.Manager(this);

        this.layout.init();

        this.manager.account.init();
        this.manager.list.init();
        this.manager.message.init();
        this.manager.recipient.init();
        this.manager.window.init();

        this.trigger('onAppInitEnd');
    };

    this.bind = function(event, listener)
    {
        this.dispatcher.bind(event, listener);

        return this;
    };

    this.trigger = function(event, params)
    {
        this.dispatcher.trigger(event, params);

        return this;
    };

    this.setApi = function(api)
    {
        this.api = api;
    };

    this.setLayout = function(layout)
    {
        this.layout = layout;
        this.layout.setApp(this);
    };

    this.getManager = function(name) {
        return this.manager[name];
    };

    /**
     * Object must do some actions for self-init.
     */
    this.preInit();
};
