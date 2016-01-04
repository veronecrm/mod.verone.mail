/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

var Mail = {
    Layout: {
        Main: null,
        Segment: {
            Accounts: null,
            Body: null,
            Content: null,
            Preview: null,
            PreviewHead: null,
            PreviewBody: null,
            Windows: null
        },
         /**
         * Stores objects that creates contents of Windows.
         * @type object
         */
        Content: {
            Message: {
                /**
                 * Entity of Window Content that manage new message content.
                 */
                Write: null
            }
        }
    },
    App: {
        Api: null,
        Account: {
            Mailbox: null,
            Manager: null
        },
        List: {
            Manager: null
        },
        Main: null,
        Message: {
            Manager: null,
            Incomming: null,
            Outgoing: null
        },
        Recipient: {
            Manager: null,
            SelectorEntity: null
        },
        Window: {
            Manager: null
        }
    },
    EventDispatcher: null
};
