<?php
    $app->assetter()->load('magnific-popup')->load('mcustomscrollbar');
?>
<div id="mod-mail" class="layout-type-1">
    <div id="body">
        <div id="accounts">
            <div class="account-list">
                <div class="wrapp"></div>
                @if count($accounts) == 0
                    <div style="padding:30px 10px;text-transform:uppercase;text-align:center;font-size:15px;font-weight:bold;color:#ccc;">Brak skrzynek pocztowych</div>
                @endif
                <div class="accounts-configuration-btn">
                    <a href="{{ createUrl('Mail', 'Account', 'index') }}" class="btn btn-default btn-block"><i class="fa fa-at"></i> {{ t('mailAccounts') }}</a>
                </div>
            </div>
            <div class="info-layer">
                <div>
                    <div>
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                        {{ t('mailAccountsLoadingInProgress_ddd') }}
                    </div>
                </div>
            </div>
            <div class="settings">
                <a href="{{ createUrl('Settings', 'User', 'index', [ 'module' => 'Mail', 'tab' => 'main' ]) }}">
                    <i class="fa fa-cog"></i>
                    <span>{{ t('settings') }}</span>
                </a>
            </div>
            <div id="layout-resize-menu"><i class="fa fa-ellipsis-v"></i></div>
        </div>
        <div id="content">
            <div id="list">
                <div id="head" class="mail-list-header" tabindex="-1">
                    <span class="dropdown" style="display:inline-block;">
                        <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-check-square-o"></i> <span class="caret"></span></button>
                        <ul class="dropdown-menu with-headline">
                            <li class="headline">{{ t('mailMailsList') }}</li>
                            <li><button type="button" class="btn-mail-select-unseen"><i class="fa fa-check-square-o"></i> {{ t('mailCheckUnseen') }}</button></li>
                            <li><button type="button" class="btn-mail-select-all"><i class="fa fa-check-square-o"></i> {{ t('mailCheckAll') }}</button></li>
                            <li><button type="button" class="btn-mail-select-nan"><i class="fa fa-square-o"></i> {{ t('mailCheckNone') }}</button></li>
                            <li class="divider"></li>
                            <li><button type="button" class="btn-mail-as-seen"><i class="fa fa-check-square-o"></i> {{ t('mailMarkAsSeen') }}</button></li>
                            <li><button type="button" class="btn-mail-as-unseen"><i class="fa fa-square-o"></i> {{ t('mailMarkAsUnseen') }}</button></li>
                        </ul>
                    </span>
                    <button type="button" class="btn btn-sm btn-default btn-mail-refresh" data-toggle="tooltip" title="{{ t('refresh') }}"><i class="fa fa-refresh"></i></button>
                    <button type="button" class="btn btn-sm btn-success btn-mail-create"><i class="fa fa-envelope"></i> {{ t('mailNewEmail') }}</button>
                    <button type="button" disabled="disabled" class="btn btn-primary btn-mail-reply"><i class="fa fa-reply"></i> {{ t('mailRewrite') }}</button>
                    <button type="button" disabled="disabled" class="btn btn-default btn-mail-forward"><i class="fa fa-mail-forward"></i> {{ t('mailForward') }}</button>
                    <button type="button" disabled="disabled" class="btn btn-default btn-mail-as-unseen"><i class="fa fa-square-o"></i> {{ t('mailUnseen') }}</button>
                    <button type="button" disabled="disabled" class="btn btn-sm btn-default btn-mail-remove"><i class="fa fa-trash"></i> {{ t('delete') }}</button>

                    <nav class="mails-pagination">
                        <ul class="pagination">
                            <li class="disabled first">
                                <a href="#" aria-label="First">
                                    <span aria-hidden="true" class="fa fa-angle-double-left"></span>
                                </a>
                            </li>
                            <li class="disabled prev">
                                <a href="#" aria-label="Previous">
                                    <span aria-hidden="true" class="fa fa-angle-left"></span>
                                </a>
                            </li>
                            <li class="active"><a href="#">1</a></li>
                            <li class="next">
                                <a href="#" aria-label="Next">
                                    <span aria-hidden="true" class="fa fa-angle-right"></span>
                                </a>
                            </li>
                            <li class="last">
                                <a href="#" aria-label="Next">
                                    <span aria-hidden="true" class="fa fa-angle-double-right"></span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div class="search-form">
                        <div class="form-group has-feedback mail-search-container">
                            <input type="text" placeholder="Szukaj..." name="mail-search" class="form-control mail-search-input" />
                            <span class="fa fa-remove form-control-feedback" aria-hidden="true"></span>
                        </div><!-- 
                         --><span class="dropdown mail-search-in-dropdown" style="display:inline-block;">
                            <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-search"></i> <span class="caret"></span></button>
                            <ul class="dropdown-menu right with-headline mail-search-in">
                                <li class="headline">{{ t('mailSearchInDD') }}</li>
                                <li class="active"><button type="button" data-searchin="SUBJECT">{{ t('mailTSubject') }}</button></li>
                                <li><button type="button" data-searchin="TO">{{ t('mailRecipient') }}</button></li>
                                <li><button type="button" data-searchin="FROM">{{ t('mailSender') }}</button></li>
                            </ul>
                        </span>
                    </div>

                    <div class="info-layer type-empty">
                        <div>
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="mails-list" tabindex="-1">
                    <div class="mails-list-inner">
                        <div class="wrapp"></div>
                    </div>
                    <div class="mails-list-empty">{{ t('mailEmptyMailbox') }}</div>
                    <div class="info-layer type-loading">
                        <div>
                            <div>
                                <i class="fa fa-circle-o-notch fa-spin"></i>
                                {{ t('mailMessagesLoadingInProgress_ddd') }}
                            </div>
                        </div>
                    </div>
                    <div class="info-layer type-no-messages">
                        <div>
                            <div>
                                <i class="fa fa-circle-o"></i>
                                {{ t('mailEmptyMailbox') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="layout-resize-list"><i class="fa fa-ellipsis-v"></i></div>
            </div>
            <div id="message-preview">
                <div id="mp-head" class="mail-list-header">
                    <h2 class="mod-mail-mail-subject"></h2>
                    <strong>{{ t('mailSender_colon') }} </strong> &nbsp; <span class="mod-mail-mail-from"></span><br />
                    <strong>{{ t('mailRecipient_colon') }} </strong> &nbsp; <span class="mod-mail-mail-to"></span><br />
                    <span class="mail-related-contacts"></span>
                    <div style="height:8px;"></div>
                        <span class="message-date"><i class="fa fa-clock-o"></i> &nbsp;<span class="mod-mail-mail-date"></span></span><span class="mailbox-name"> &nbsp; &nbsp; &nbsp; <i class="fa fa-inbox"></i> &nbsp;<span class="mod-mail-mail-box"></span></span>
                    <div class="message-attachments"></div>
                </div>
                <div id="mp-body">
                    <iframe src="{{ createUrl('Mail', 'Mail', 'iframeEmpty') }}"></iframe>
                </div>
                <div class="info-layer type-loading">
                    <div>
                        <div>
                            <i class="fa fa-circle-o-notch fa-spin"></i>
                            {{ t('mailMessagesLoadingInProgress_ddd') }}
                        </div>
                    </div>
                </div>
                <div class="info-layer type-select">
                    <div>
                        <div>
                            <i class="fa fa-hand-o-left"></i>
                            {{ t('mailSelectMessage_ddd') }}
                        </div>
                    </div>
                </div>
                <div class="info-layer type-empty">
                    <div>
                        <div>&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="windows">

    </div>
</div>

<div class="app-movable contact-bussiness-card">
    <a href="#" class="close">&times;</a>
    <div class="company movable-handler"></div>
    <div class="name"></div>
    <div class="position"></div>
    <div class="details">
        <span class="phone"></span>
        <span class="email"></span>
    </div>
    <a href="#" target="_blank" class="edit-link fa fa-external-link"></a>
</div>

{# Mail templates START #}
<div style="display:none" id="mail-templates">
    <div id="content-recipients-list">
        <div tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="{{ t('close') }}"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{ t('mailSelectMessageRecipients') }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="mod-mail-recipients-list">
                            <div class="form-group has-feedback">
                                <input type="text" placeholder="{{ t('mailSearchDDD') }}" name="search-recipient" class="form-control recipient-search" />
                                <span class="fa fa-remove form-control-feedback" aria-hidden="true"></span>
                            </div>
                            <ul>
                                <?php foreach($contractors as $i => $item): ?>
                                    <?php if($item->getEmail() == '') continue; ?>
                                    <li data-address="<?php echo $item->getEmail(); ?>" class="contractor"><span><?php echo $item->getName(); ?></span><i class="fa fa-check-square-o"></i><i class="fa fa-square-o"></i></li>
                                    <?php foreach($item->contacts as $j => $item2): ?>
                                        <li data-address="<?php echo $item2->getEmail(); ?>" class="contact"><i class="fa fa-caret-right"></i> &nbsp; <span><?php echo $item2->getName(); ?></span> (<?php echo $item2->getEmail(); ?>)<i class="fa fa-check-square-o"></i><i class="fa fa-square-o"></i></li>
                                    <?php endforeach; ?>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                        <hr />
                        <h5>{{ t('mailOtherRecipients') }}</h5>
                        <input type="text" name="other_recipients" class="form-control" class="other-recipients" />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close">{{ t('close') }}</button>
                        <a href="#" class="btn btn-primary btn-confirm">{{ t('confirm') }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="content-message-write">
        <div>
            <div class="mail-list-header">
                <button type="button" class="btn btn-success btn-mail-send">{{ t('mailSubmit') }} <i class="fa fa-send"></i></button>
            </div>
            <div class="message-details-panel">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">{{ t('mailTo_colon') }}</label>
                                    <input type="hidden" class="form-control" name="message_write_to" />
                                    <div class="col-sm-9">
                                        <div class="message-write-addresses-list labels-list-container">
                                            <div class="label-new"><i class="fa fa-plus"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">{{ t('mailSubject_colon') }}</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" name="message_write_subject" placeholder="{{ t('mailTSubjectDDD') }}" />
                                    </div>
                                </div>
                                <div class="form-group add-field hidden field-cc">
                                    <label class="col-sm-3 control-label">{{ t('mailCC_colon') }}</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" name="message_write_cc" placeholder="{{ t('mailCCDDD') }}" />
                                    </div>
                                </div>
                                <div class="form-group add-field hidden field-bcc">
                                    <label class="col-sm-3 control-label">{{ t('mailBCC_colon') }}</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" name="message_write_bcc" placeholder="{{ t('mailBCCDDD') }}" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3"></div>
                                    <div class="col-sm-9">
                                        <div class="write-add-fields">
                                            <button class="btn btn-xs" data-field="field-cc" type="button"><i class="fa fa-plus"></i> {{ t('mailCC') }}</button>
                                            <button class="btn btn-xs" data-field="field-bcc" type="button"><i class="fa fa-plus"></i> {{ t('mailBCC') }}</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">{{ t('mailAttachments_colon') }}</label>
                                    <div class="col-sm-9">
                                        <div class="message-write-attachments-list labels-list-container">
                                            <div class="label-new file-input-contains"><i class="fa fa-plus"></i><input type="file" name="attachments[]" class="attachments" multiple /></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Message Metadata -->
                                <input type="hidden" name="message_write_isreply" value="0" />
                                <input type="hidden" name="message_write_isforward" value="0" />
                                <input type="hidden" name="message_write_original_msgid" value="0" />
                                <input type="hidden" name="message_write_account" value="0" />
                                <input type="hidden" name="message_write_mailbox" value="0" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="textarea-content">
                <div class="message_write_content"></div>
            </div>
            <div class="attachments-progress-box"><h3>{{ t('mailAttachmentsSendInProgress_ddd') }}</h3><div class="progresses"></div></div>
        </div>
    </div>
</div>
{# Mail templates STOP #}

<div class="ve-panel mail-accounts-empty hidden">
    <div class="ve-bl"></div>
    <div class="ve-fl">
        <h4>{{ t('mailLackOfAccounts') }}</h4>
        <p>{{ t('mailLackOfAccountsInfo') }}</p>
        <a href="{{ createUrl('Mail', 'Account', 'index') }}" class="btn btn-default"><span class="fa fa-plus"></span> {{ t('mailWantToAddNewAccount') }}</a>
    </div>
</div>

<div class="ve-panel mail-account-password hidden">
    <div class="ve-bl"></div>
    <div class="ve-fl">
        <h4 class="text-center">Wymagane jest podanie hasła do konta:<br /> <big><strong style="display:block;padding:10px 0"></strong></big></h4>
        <div class="form-group">
            <input type="password" class="form-control text-center" placeholder="Podaj hasło" />
        </div>
        <div class="text-center">
            <button type="button" class="btn btn-default">Zatwierdź</button>
        </div>
        <div class="loader loader-fit-to-container hidden">
            <div class="loader-animate"></div>
        </div>
    </div>
</div>

<style>
    .attachments-progress-box {display:none;position:fixed;right:10px;bottom:10px;width:300px;min-height:100px;padding:15px;background-color:#fff;z-index:9999;border:1px solid #dddddd;border-top:3px solid #0088CC;border-radius:3px;box-shadow:0px 0px 5px rgba(0,0,0,.2);}
    .attachments-progress-box h3 {margin:0 0 15px 0;padding:0;font-size:20px;color:#444;}
    .attachments-progress-box span {display:block;margin-bottom:4px;text-transform:uppercase;}
    .attachments-progress-box .error {color:#fff;padding:5px 8px;font-weight:bold;color:#fff;background-color:#D9534F;line-height:1.4;border-radius:3px;margin-bottom:15px;}
    #mod-mail {position:fixed;left:44px;top:51px;right:0;bottom:38px;background-color:#fff}
    #mod-mail #head {position:absolute;left:0;top:0;right:0;height:46px;}
    #mod-mail #body {position:absolute;top:0;left:0;right:0;bottom:0;}
    #mod-mail #accounts {position:absolute;top:0;left:0;bottom:0;width:300px;padding-right:7px;background-color:#fff;border-right:1px solid #DDDDDD;}
    #mod-mail #content {position:absolute;top:0;left:300px;bottom:0;right:0;}
    #mod-mail .settings {bottom:0;display:block;position:absolute;left:0;right:23px;}
    #mod-mail .settings > a {color:gray;display:inline-block;height:32px;line-height:32px;padding:0 8px;position:relative;text-align:center;}
    #mod-mail .settings > a span {display:inline-block;font-size:13px;opacity:0;padding-left:6px;vertical-align:middle;}
    #mod-mail .settings > a i {font-size:20px;vertical-align:middle;}
    #mod-mail .settings:hover {background-color:#fff;}
    #mod-mail .settings:hover > a span {opacity:1}
    #mp-head {position:absolute;left:0;top:0;right:0;min-height:46px;border-bottom:1px solid #DDDDDD;}
    #mp-body {position:absolute;left:0;top:46px;right:0;bottom:0;background-color:#fff;}
    #mp-body iframe {display:block;border:none;padding:0;margin:0;width:100%;height:100%;}
    #windows {position:absolute;left:0;bottom:0;right:0;z-index:10;overflow:hidden;height:35px;padding:5px 5px 0 5px;display:none;border-top:1px solid #DDDDDD;}
    #windows .window-bar {display:block;padding:7px 9px;float:left;margin-right:6px;background-color:#0088CC;min-width:300px;-webkit-border-top-left-radius: 3px;-webkit-border-top-right-radius: 3px;-moz-border-radius-topleft: 3px;-moz-border-radius-topright: 3px;border-top-left-radius: 3px;border-top-right-radius: 3px;}
    #windows .window-bar:hover {cursor:pointer;}
    #windows .window-bar.opened {background-color:#29B12B}
    #windows .window-bar h3 {color:#fff;font-size:14px;font-weight:normal;margin:0;padding:0;}

    #list {position:absolute;left:0;top:0;background-color:#fff}
    #message-preview {position:absolute;right:0;bottom:0;overflow:auto;background-color:#000}
    #message-preview.hidden {display:none;}
    #message-preview h2 {margin:0 0 6px;font-size:20px;}
    #layout-resize-menu {overflow:hidden;position:absolute;right:0;top:0;bottom:0;width:6px;background-color:#fff;border-left:1px solid #DDDDDD}
    #layout-resize-menu:hover {cursor:w-resize;}
    #layout-resize-menu i {display:block;font-size:14px;height:14px;width:6px;text-align:center;line-height:1;color:#666;top:50%;margin-top:-50%;position:absolute;}
    #layout-resize-list {position:absolute;bottom:0;background-color:#fff;border-top:1px solid #DDDDDD}

    #list .mails-list {position:absolute;left:0;top:46px;bottom:5px;right:0;overflow:auto;}
    #list .mails-list:focus {outline:0 !important;border:0 !important}
    #list .mails-list-inner {position:absolute;left:0;top:0;bottom:0;right:0;overflow:auto;}

    .account-list {position:absolute;left:0;top:0;bottom:0;right:7px;overflow:auto;}
    .account-list ul a .account-status {position:relative;float:right;}
    .account-list ul a .account-name {display:block;padding:0 5px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

    .mail-window {display:none;left:0;top:0;right:0;bottom:0;position:fixed;background-color:rgba(0,0,0,.6);z-index:1000;}
    .mail-window .mail-window-wrap {left:20%;right:20%;top:10px;bottom:10px;position:absolute;z-index:2;background-color:#fff;box-shadow:0 0 5px rgba(0,0,0,.3);-webkit-border-radius: 6px;-moz-border-radius: 6px;border-radius: 6px;}
    .mail-window .mail-window-backlay {left:0;top:0;right:0;bottom:0;position:absolute;}
    .mail-window .mail-window-backlay:hover {cursor:pointer;}
    .mail-window .window-head {width:100%;border-bottom:1px solid #ddd;background-color:#0088CC;padding:6px 10px;line-height:1.5;height:44px;-webkit-border-top-left-radius: 6px;-webkit-border-top-right-radius: 6px;-moz-border-radius-topleft: 6px;-moz-border-radius-topright: 6px;border-top-left-radius: 6px;border-top-right-radius: 6px;}
    .mail-window .window-head:after {content:" ";clear:both;display:table;}
    .mail-window .window-head h3 {font-size:16px;font-weight:normal;float:left;margin:0;padding:6px;color:#fff;}
    .mail-window .window-body {position:absolute;left:0;top:44px;right:0;bottom:0;overflow:auto;}
    .mail-window .mbtns {float:right;display:block;margin:3px 0 0 0;}
    .mail-window .mbtns button {border:none;float:left;font-size:14px;font-weight:normal;background-color:transparent;display:block;margin-left:3px;opacity:0.3;text-shadow: 0 1px 0 #FFFFFF}
    .mail-window .mbtns button:hover {cursor:pointer;opacity:0.6;}
    .mail-window .mbtns button.mbtn-minimalyze {margin-top:5px;}

    .info-layer {display:none;position:absolute;left:0;top:0;right:0;bottom:0;background-color:#fff;z-index:10;}
    .info-layer > div {position:static;left:auto;top:auto;display:table;line-height:1.4;width:100%;height:100%;overflow:hidden;text-transform:uppercase;text-align:center;font-size:15px;font-weight:bold;color:#ccc;}
    .info-layer > div > div {display:table-cell;width:100%;height:100%;vertical-align:middle;}
    .info-layer > div > div i {display:block;font-size:35px;text-align:center;margin:0 0 12px 0;}
    .info-layer.type-loading:hover {cursor:wait;}
    .info-layer.type-select i {font-size:65px;}

    /* ---------------------- */
    #mod-mail button[disabled],
    #mod-mail .btn[disabled] {opacity:.2;cursor:not-allowed;}
    .mail-list-header {width:100%;padding:8px;background-color:#fff;border-bottom:1px solid #DDDDDD;}
    .mails-pagination {float:right;display:block;}
    .mails-pagination .pagination {margin:0;}
    .mails-pagination .pagination .disabled {display:none;}
    .mails-pagination .pagination .disabled a {opacity:0.4;}

    .mail-search-container {display:inline-block;max-width:350px;margin:0;padding:0;}
    .mail-search-container input,
    .mail-search-container input:hover,
    .mail-search-container input:focus {margin:0;display:inline-block;}
    .mail-search-container .form-control-feedback {display:none;}
    .mail-search-container .form-control-feedback:hover {cursor:pointer;}
    .mail-search-in-dropdown .btn {border-left:none;}

    .mails-list-empty {border-top:1px solid #DDDDDD;display:none;padding:70px 0;font-size:30px;color:#EBEBEB;font-weight:bold;text-align:center;text-transform:uppercase;}

    .search-form {float:right;margin-right:15px;}
    .accounts-configuration-btn {padding:0 15px 30px;}

    .mails-list .wrapp {display:table;width:100%;}
    .mails-list .message-row {display:table-row;}
    .mails-list .message-row:hover {cursor:pointer;}
    .mails-list .message-row > div {display:table-cell;padding:3px 4px;border-bottom:1px solid #DDDDDD;vertical-align:top;}
    .mails-list .message-row:nth-child(odd) {background-color:#F9F9F9}
    .mails-list .message-row:hover {background-color:#F3F3F4}
    .mails-list .message-row.focused {background-color:#0088CC;color:#fff;}
    .mails-list .message-row.status-unseen > div {font-weight:bold;}
    .mails-list .message-row > div.select {width:30px;padding:1px 4px;}
    .mails-list .message-row > div.date {width:130px;text-align:right;}
    .mails-list .message-row > div.size {width:80px;text-align:right;}
    .mails-list .message-row > div.author {width:250px;}

    .mail-related-contacts a:after {display:inline-block;content:", ";padding-right:6px;}
    .mail-related-contacts a:last-child:after {display:none}

    #accounts .heading {font-size:13px;text-transform:uppercase;padding:0px 10px;margin-top:10px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    #accounts .list-group {padding:10px 10px 30px;}
    #accounts .list-group li .badge .fa {margin:0;}
    #accounts .list-group li.mmt {color:#fff;background-color:#29B12B;}
    #accounts .list-group li.mmt .badge {color:#000;background-color:#fff;}

    .labels-list-container {display:block;width:100%;}
    .labels-list-container > div {font-size:12px;color:#000;display:block;float:left;padding:6px 8px;line-height:1;margin:0 3px 3px 0;background-color:#F8F8F8;border:1px solid #EFEFEF;}
    .labels-list-container > div i {display:inline-block;margin-left:4px;}
    .labels-list-container > div:hover i {cursor:pointer;color:#D9534F;}
    .labels-list-container > div.label-new {background-color:#5CB85C;border:1px solid #4CAE4C;color:#fff;font-size:12px;color:#fff;padding:6px 8px;line-height:1;margin:0 3px 3px 0;}
    .labels-list-container > div.label-new:hover {cursor:pointer;background:#449D44;border:1px solid #398439;}
    .labels-list-container > div.label-new i {margin:0;display:inline-block;}
    .labels-list-container > div.label-new:hover i {color:#fff}
    .labels-list-container > div.file-input-contains {position:relative;overflow:hidden;}
    .labels-list-container > div.file-input-contains input {display:block;position:absolute;left:0;top:0;opacity:0;}
    .labels-list-container > div.file-input-contains input:hover {cursor:pointer;}
    .labels-list-container > div.file-input-contains input:focus {outline:none;}
    .has-error .labels-list-container >  div.label-new {background-color:#A94442;border:1px solid #A94442;}

    .message-attachments {display:block;margin-top:8px;position:relative;overflow:auto;max-height:125px;}
    .message-attachments:after {display:table;clear:both;content:" "}
    .message-attachments .attachment-item {width:120px;height:120px;margin:5px 5px 0 0;display:block;float:left;position:relative;border:1px solid #E7E7E7;overflow:hidden;border-radius:2px;}
    .message-attachments .attachment-item .hover {opacity:0;position:absolute;left:0;top:0;right:0;bottom:0;text-align:center;background-color:rgba(0,0,0,.5);border-radius:2px;-moz-transition:all 0.15s ease;-webkit-transition:all 0.15s ease;transition:all 0.15s ease;}
    .message-attachments .attachment-item .hover a {display:inline-block;width:25px;height:25px;color:#fff;text-align:center;line-height:25px;font-size:25px;margin:40px 5px;-moz-transition:all 0.15s ease;-webkit-transition:all 0.15s ease;transition:all 0.15s ease;}
    .message-attachments .attachment-item .hover a:hover {color:#0088CC;}
    .message-attachments .attachment-item .name {display:block;position:absolute;left:0;bottom:0;right:0;padding:5px 6px;background-color:#E7E7E7;color:#000;line-height:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
    .message-attachments .attachment-item .file-icon {position:absolute;color:#777;font-size:66px;width:66px;height:66px;text-align:center;line-height:66px;position:absolute;left:50%;top:50%;margin-left:-33px;margin-top:-45px;}
    .message-attachments .attachment-item.attachment-image {background-position:center center;background-repeat:no-repeat;}
    .message-attachments .attachment-item.focus {border:1px solid #0088CC;}
    .message-attachments .attachment-item:hover .hover {opacity:1;}

    .textarea-content {position:relative;min-height:300px;}
    .textarea-content .textarea-loader {position:absolute;left:0;top:0;right:0;bottom:0;z-index:2;background-color:#fff;}
    .textarea-content .textarea-loader i {display:block;font-size:40px;color:#ddd;text-align:center;margin-top:80px;}

    .contact-bussiness-card {line-height:1.1;width:350px;height:160px;}
    .contact-bussiness-card .company {position:absolute;right:10px;left:10px;top:10px;font-size:14px;font-weight:300;min-height:15px;}
    .contact-bussiness-card .name {margin-top:50px;text-align:center;font-size:15px;font-weight:600;}
    .contact-bussiness-card .position {margin-top:0;text-align:center;font-size:12px;font-weight:normal;}
    .contact-bussiness-card .details {position:absolute;left:10px;bottom:10px;font-size:11px;color:#888;}
    .contact-bussiness-card .details span {display:block;}
    .contact-bussiness-card .edit-link {font-size:15px;display:none;text-align:center;position:absolute;line-height:30px;width:30px;height:30px;bottom:0;right:0;color:#222;}
    .contact-bussiness-card:hover .edit-link {display:block;}

    .mod-mail-recipients-list ul,
    .mod-mail-recipients-list ul li {padding:0;margin:0;list-style-image:none;list-style:none;display:block;}
    .mod-mail-recipients-list ul {overflow:auto;max-height:160px;}
    .mod-mail-recipients-list ul li {padding:4px 8px;font-size:13px;background-color:#f8f8f8;margin:0 0 2px 0;color:#000;}
    .mod-mail-recipients-list ul li:hover {cursor:pointer;background-color:#f0f0f0}
    .mod-mail-recipients-list ul li.contact {padding-left:20px;color:#999;}
    .mod-mail-recipients-list ul li.selected {background-color:#0088CC;color:#fff;}
    .mod-mail-recipients-list ul li .fa-check-square-o,
    .mod-mail-recipients-list ul li .fa-square-o {display:none;float:right;font-size:14px;padding:3px;}
    .mod-mail-recipients-list ul li .fa-square-o {display:block;}
    .mod-mail-recipients-list ul li.selected .fa-square-o {display:none;}
    .mod-mail-recipients-list ul li.selected .fa-check-square-o {display:block;}
    .mod-mail-recipients-list .form-control-feedback {display:none;}
    .mod-mail-recipients-list .form-control-feedback:hover {cursor:pointer;color:#AA3434;}

    /* Layout styling */
    .layout-type-1 #list {height:200px;right:0;}
    .layout-type-1 #message-preview {left:0;top:200px;}
    .layout-type-1 #layout-resize-list {overflow:hidden;right:0;left:0;height:7px;border-bottom:1px solid #DDDDDD}
    .layout-type-1 #layout-resize-list:hover {cursor:s-resize;}
    .layout-type-1 #layout-resize-list i {display:block;font-size:14px;height:14px;width:6px;text-align:center;line-height:1;color:#666;left:50%;top:-4px;position:absolute;-ms-transform:rotate(90deg);-webkit-transform:rotate(90deg);transform:rotate(90deg);}

    .layout-type-2 #list {bottom:0;right:0;}
    .layout-type-2 #list .mails-list {bottom:0;}
    .layout-type-2 #message-preview {left:200px;top:46px;margin-left:7px;}
    .layout-type-2 #layout-resize-list {overflow:hidden;z-index:2;top:46px;bottom:0;right:0;width:7px;border:1px solid #DDDDDD;border-top:none;border-bottom:none;}
    .layout-type-2 #layout-resize-list:hover {cursor:w-resize;}
    .layout-type-2 #layout-resize-list i {display:block;font-size:14px;height:14px;width:6px;text-align:center;line-height:1;color:#666;top:50%;margin-top:-50%;position:absolute;}
    .layout-type-2 .mails-list .wrapp {display:block;}
    .layout-type-2 .mails-list .message-row {display:block;position:relative;border-bottom:1px solid #DDDDDD;padding:4px;}
    .layout-type-2 .mails-list .message-row:after {display:table;clear:both;content:" ";}
    .layout-type-2 .mails-list .message-row > div {padding:2px 0;display:block;border-bottom:none;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}
    .layout-type-2 .mails-list .message-row > div.select {position:absolute;left:6px;top:2px;min-height:20px;width:25px;}
    .layout-type-2 .mails-list .message-row > div.author {margin-left:20px;width:auto;clear:both;min-height:20px;}
    .layout-type-2 .mails-list .message-row > div.size {float:left;width:auto;font-weight:normal;opacity:.5;font-size:11px;padding:0;}
    .layout-type-2 .mails-list .message-row > div.date {float:right;width:auto;font-weight:normal;opacity:.5;font-size:11px;padding:0;}

    .message-details-panel .form-horizontal .form-group {margin-left:0;margin-right:0;}
    .message-details-panel .form-horizontal .form-control {margin-bottom:0;}

    .message-details-panel .write-add-fields {padding:0 6px;}
    .message-details-panel .write-add-fields button {background-color:#fff}

    .modal-backdrop {display:none;}
    .textarea-content .note-editor {border:none;border-top:1px solid #ddd;border-radius:0;}
    .textarea-content .note-editor h4,
    .textarea-content .note-editor h5,
    .textarea-content .note-editor h6 {margin:0;}
    .textarea-content .note-editor .panel-heading {padding:5px 10px 10px;border-bottom:1px solid #ddd;}
    .textarea-content .note-editor blockquote,
    .textarea-content .note-editor blockquote p {font-size:12px;font-weight:normal;line-height:1.4;}
    /* Block upload image from local disk */
    .textarea-content .note-group-select-from-files {display:none;}
</style>
<link href="{{ asset('/modules/Mail/summernote/summernote.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('/modules/Mail/summernote/summernote-bs3.css') }}" rel="stylesheet" type="text/css" />
<script src="{{ asset('/modules/Mail/summernote/summernote.min.js') }}"></script>
<script src="{{ asset('/modules/Mail/summernote/lang/summernote-pl-PL.js') }}"></script>
<script src="{{ asset('/modules/Mail/jq-fu/jquery.ui.widget.js') }}"></script>
<script src="{{ asset('/modules/Mail/jq-fu/jquery.iframe-transport.js') }}"></script>
<script src="{{ asset('/modules/Mail/jq-fu/jquery.fileupload.js') }}"></script>
<script src="{{ asset('/modules/Mail/jq-fu/jquery.fileupload-process.js') }}"></script>
<script src="{{ asset('/modules/Mail/jq-fu/jquery.fileupload-validate.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.EventDispatcher.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Main.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.Head.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.Accounts.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.Body.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.Content.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.List.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.Preview.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.PreviewHead.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.PreviewBody.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Segment.Windows.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.Layout.Content.Message.Write.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Main.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Api.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Account.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Account.Mailbox.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Account.Manager.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.List.Manager.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Message.Incomming.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Message.Outgoing.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Message.Manager.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Recipient.Manager.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Recipient.SelectorEntity.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Window.js') }}"></script>
<script src="{{ asset('/modules/Mail/app/Mail.App.Window.Manager.js') }}"></script>
<script>
    var addressees = [];

    $(document).ready(function() {
        APP.Locale.translations.mailNewMessageCount = '{{ t('mailNewMessageCount') }}';
        APP.Locale.translations.mailNoRelatedContacts = '{{ t('mailNoRelatedContacts') }}';
        APP.Locale.translations.mailSubmit = '{{ t('mailSubmit') }}';
        APP.Locale.translations.mailErrorWhenTryingGetListOfMessagesTryingAgain = '{{ t('mailErrorWhenTryingGetListOfMessagesTryingAgain') }}';
        APP.Locale.translations.mailErrorWhenTryingGetListOfAccountsTryingAgain = '{{ t('mailErrorWhenTryingGetListOfAccountsTryingAgain') }}';
        APP.Locale.translations.mailErrorWhenTryingGetMessageTryingAgain = '{{ t('mailErrorWhenTryingGetMessageTryingAgain') }}';
        APP.Locale.translations.mailTo_colon = '{{ t('mailTo_colon') }}';
        APP.Locale.translations.mailSubject_colon = '{{ t('mailSubject_colon') }}';
        APP.Locale.translations.mailTSubjectDDD = '{{ t('mailTSubjectDDD') }}';
        APP.Locale.translations.mailAttachments_colon = '{{ t('mailAttachments_colon') }}';
        APP.Locale.translations.mailNewEmail = '{{ t('mailNewEmail') }}';

        var app = new Mail.App.Main({
            message: {
                footer: '<?php echo preg_replace('/\s+/', ' ', $settings->get('mod.mail.message.signature')); ?>'
            },
            list: {
                perpage: parseInt('{{ $settings->get('mod.mail.app.message.perpage') }}')
            },
            accounts: <?php echo json_encode($accounts); ?>
        });
        app.setApi(new Mail.App.Api('<?php echo $app->createUrl('Mail', 'Mail', 'METHOD'); ?>'));
        app.setLayout(new Mail.Layout.Main($('#mod-mail'), {
            type: {{ $settings->get('mod.mail.app.layout.type') }},
            sizes: {
                accounts: {{ $settings->get('mod.mail.app.layout.size.accounts') }},
                messages: {{ $settings->get('mod.mail.app.layout.size.messages') }}
            },
            addressees: addressees
        }));
        app.init();

        /**
         * Change size of messages list.
         */
        app.bind('onMessagesSizeChange', function(size) {
            APP.AJAX.call({
                url: APP.createUrl('Mail', 'Settings', 'updateSizes'),
                data: {
                    messages: size
                }
            });
        });

        /**
         * Change size of accounts list.
         */
        app.bind('onAccountsSizeChange', function(size) {
            APP.AJAX.call({
                url: APP.createUrl('Mail', 'Settings', 'updateSizes'),
                data: {
                    accounts: size
                }
            });
        });

        var APP_Movable = new APP.factory.plugin('Movable');
        // Main function
        APP_Movable.movable = function(object, options) {
            var movable = new this.factory.Movable(object, options);
            movable.init();

            return movable;
        };

        APP_Movable.factory = {};
        APP_Movable.factory.Movable = function(object) {
            this.object = object;
            this.pageX = 0;
            this.pageY = 0;
            this.currentX = 0;
            this.currentY = 0;
            this.started = false;
            this.init = function() {
                this.object.addClass('app-movable').appendTo('body');

                var windowWidth  = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                var windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                var elementSizes = this.getSizes();

                var left  = (windowWidth / 2) - (elementSizes.width / 2);
                var top   = (windowHeight / 2) - (elementSizes.height / 2);

                this.object.css({
                    left: left + 'px',
                    top: top + 'px'
                });

                this.currentX = parseInt(left);
                this.currentY = parseInt(top);

                this.start();
            };

            this.start = function() {
                var self = this;

                this.object.find('.movable-handler').mousedown(function(e) {
                    self.pageX = e.pageX;
                    self.pageY = e.pageY;
                    self.started = true;
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });

                this.object.find('> .close').click(function() {
                    self.close();
                    return false;
                });

                $('body').mouseup(function(e) {
                    self.currentX = parseInt(self.object.css('left').replace('px', ''));
                    self.currentY = parseInt(self.object.css('top').replace('px', ''));

                    self.pageX = 0;
                    self.pageY = 0;
                    self.started = false;

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });

                $('body').mousemove(function(e) {
                    if(self.started)
                    {
                        var sizes = {
                            left: self.currentX - (self.pageX - e.pageX),
                            top : self.currentY - (self.pageY - e.pageY)
                        };

                        if(sizes.left <= 0)
                        {
                            sizes.left = 0;
                        }
                        if(sizes.top <= 0)
                        {
                            sizes.top = 0;
                        }

                        var elementSizes = self.getSizes();

                        if(sizes.left + elementSizes.width >= ((window.innerWidth > 0) ? window.innerWidth : screen.width))
                        {
                            sizes.left = ((window.innerWidth > 0) ? window.innerWidth : screen.width) - elementSizes.width;
                        }
                        if(sizes.top + elementSizes.height >= ((window.innerHeight > 0) ? window.innerHeight : screen.height))
                        {
                            sizes.top = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - elementSizes.height;
                        }

                        self.object.css(sizes);

                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                });
            };

            this.open = function() {
                this.object.addClass('open');
            };

            this.close = function() {
                this.object.removeClass('open');
            };

            this.getSizes = function() {
                return {
                    width: (this.object.outerWidth()),
                    height: (this.object.outerHeight())
                };
            };
        };

        // Registering plugin
        APP.plugin.register(APP_Movable);
    });
</script>
