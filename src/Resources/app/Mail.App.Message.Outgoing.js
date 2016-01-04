/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Message.Outgoing = function() {
    this.subject = '';
    this.to = [];
    this.cc = '';
    this.bcc = '';
    this.content = '';
    this.isReply = false;
    this.isForward = false;
    this.messageDate = null;
    this.originalMessageId = null;
    this.mailbox = '';
    this.account = 0;
    this.contentMustBePlain = false;
    this.windowId = 0;
};
