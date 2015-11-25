/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Main = function(options) {
    this.layout;
    this.api;
    this.manager = {
        account: null,
        list: null,
        message: null,
        recipient: null,
        window: null
    };
    this.options = options;

    this.dispatcher = null;

    this.generatedTimeoutedErrorsIntervals = {};

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

    this.generateTimeoutedErrorWithCallback = function(ID, text, secondsTimeout, callback) {
        if($('.mod-mail-' + ID).length == 0)
        {
            APP.FluidNotification.open(text.replace('%d', '<span class="mod-mail-' + ID + '">' + secondsTimeout + '</span>'), { theme: 'error', sticky: true });
        }

        var self = this;

        self.generatedTimeoutedErrorsIntervals[ID] = setInterval(function() {
            var val = parseInt($('.mod-mail-' + ID).text());

            $('.mod-mail-' + ID).text(val - 1);

            if(val == 1)
            {
                clearInterval(self.generatedTimeoutedErrorsIntervals[ID]);
                $('.mod-mail-' + ID).parent().parent().data('jGrowl').sticky = false;

                setTimeout(function() {
                    callback();
                }, 1000);
            }
        }, 1000);
    };

    /**
     * Object must do some actions for self-init.
     */
    this.preInit();
};
