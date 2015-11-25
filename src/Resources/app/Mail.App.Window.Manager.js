/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Window.Manager = function(app) {
    this.app     = app;
    this.segment = null;
    this.windows = [];

    /**
     * Initiation function
     */
    this.init = function() {
        this.segment = this.app.layout.segment('windows');
    };

    /**
     * Creates Window object and DOC elements and returns Window Object.
     * @param  string name      Name/title of window.
     * @param  object content   Content objecte, that creates and manage content of window.
     * @return Mail.App.Window  Window object.
     */
    this.create = function(name, content) {
        if(content.setApp)
        {
            content.setApp(this.app);
        }

        var o = new Mail.App.Window(this.generateWindowId(name), name, content, this);

        this.windows.push(o);
        this.segment.createElements(o);

        // Pass ID of window to content object
        o.content.setWindowId(o.id);
        // Pass Layout object to Manager
        o.content.setLayout(this.app.layout);
        // Calling method of content object that creates window content.
        o.content.render();

        // We must open bar with windows when we create new window.
        this.openWindowsBar();

        return this.get(o.id);
    };

    /**
     * Destroys (removes) Window by given ID.
     * @param  string id Window ID.
     * @return void
     */
    this.destroy = function(id) {
        var newWindows = [];

        /**
         * We must rebuild our array because delete directive called on selected index of array,
         * only removes value, not update length value of this array...
         */
        for(var i in this.windows)
        {
            if(this.windows[i].id == id)
            {
                // If methos exists, we call it.
                if(this.windows[i].content.onDestroy)
                {
                    this.windows[i].content.onDestroy();
                }

                this.segment.destroy(id);
            }
            else
            {
                newWindows.push(this.windows[i]);
            }
        }

        // Reassign array of windows
        this.windows = newWindows;

        // If there isn't any windows, we hide bar with windows.
        if(this.windows.length == 0)
        {
            this.closeWindowsBar();
        }
    }

    /**
     * Search for Window by given ID and returns it.
     * @param  string id Window ID.
     * @return Mail.App.Window|void
     */
    this.get = function(id) {
        for(var i in this.windows)
        {
            if(this.windows[i].id == id)
            {
                return this.windows[i];
            }
        }
    };

    /**
     * Opens (shows) Window by ID.
     * @param  string id Window ID.
     * @return void
     */
    this.open = function(id) {
        for(var i in this.windows)
        {
            if(this.windows[i].id == id)
            {
                this.windows[i].open();
            }
        }
    };

    /**
     * Closes (hides) all Windows on screen.
     * @return void
     */
    this.closeAll = function() {
        for(var i in this.windows)
        {
            this.windows[i].close();
        }
    };

    /**
     * Open windows bar at the bottom of page.
     * @return void
     */
    this.openWindowsBar = function() {
        this.segment.openWindowsBar(this.segment.node.outerHeight());
    };

    /**
     * Close windows bar.
     * @return void
     */
    this.closeWindowsBar = function() {
        this.segment.closeWindowsBar();
    };

    /**
     * Generates window ID for identification in Windows List.
     * @param  string name Window name/title.
     * @return string Window ID.
     */
    this.generateWindowId = function(name) {
        return (new Date).getTime() + Math.floor((Math.random() * 100) + 1);
    };
};
