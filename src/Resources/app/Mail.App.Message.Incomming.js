/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

Mail.App.Message.Incomming = function() {
    this.id = 0;
    this.subject = '';
    this.to = '';
    this.contentHtml = '';
    this.contentPlain = '';
    this.date = 0;
    this.dateTimeAgo = '';
    this.dateFull = '';
    this.fromAddress = '';
    this.fromName = '';
    this.replyTo = '';
    this.inboxName = '';
    this.attachments = [];
    this.related = [];
    this.fromCache = false;

    this.getToFull = function() {
        return $('<div />').text(this.to).text().replace('<', '&lt;').replace('>', '&gt;').replace(',', '<br />');
    };

    this.getContent = function() {
        return this.contentHtml ? this.contentHtml : this.contentPlain.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
    };

    this.getFromFull = function() {
        return this.fromName + ' <span class="detail">&lt;' + this.fromAddress + '&gt;</span>';
    };
};
