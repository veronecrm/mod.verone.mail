<div class="page-header">
    <div class="page-header-content">
        <div class="page-title">
            <h1>
                <i class="fa fa-at"></i>
                <?php echo $app->t($account->getId() ? 'mailAccountEdit' : 'mailAccountNew'); ?>
            </h1>
        </div>
        <div class="heading-elements">
            <div class="heading-btn-group">
                <a href="#" data-form-submit="form" data-form-param="apply" class="btn btn-icon-block btn-link-success">
                    <i class="fa fa-save"></i>
                    <span>{{ t('apply') }}</span>
                </a>
                <a href="#" data-form-submit="form" data-form-param="save" class="btn btn-icon-block btn-link-success">
                    <i class="fa fa-save"></i>
                    <span>{{ t('save') }}</span>
                </a>
                <a href="#" class="btn btn-icon-block btn-link-danger app-history-back">
                    <i class="fa fa-remove"></i>
                    <span>{{ t('cancel') }}</span>
                </a>
            </div>
        </div>
        <div class="heading-elements-toggle">
            <i class="fa fa-ellipsis-h"></i>
        </div>
    </div>
    <div class="breadcrumb-line">
        <ul class="breadcrumb">
            <li><a href="{{ createUrl() }}"><i class="fa fa-home"> </i>Verone</a></li>
            <li><a href="{{ createUrl('Mail', 'Mail', 'index') }}">{{ t('mailMail') }}</a></li>
            @if $account->getId()
                <li class="active"><a href="{{ createUrl('Mail', 'Account', 'edit', [ 'id' => $account->getId() ]) }}">{{ t('mailAccountEdit') }}</a></li>
            @else
                <li class="active"><a href="{{ createUrl('Mail', 'Account', 'add') }}">{{ t('mailAccountNew') }}</a></li>
            @endif
        </ul>
    </div>
</div>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <form action="<?php echo $app->createUrl('Mail', 'Account', $account->getId() ? 'update' : 'save'); ?>" method="post" id="form" class="form-validation">
                <input type="hidden" name="id" value="<?php echo $account->getId(); ?>" />
                <div class="row">
                    <div class="col-md-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">{{ t('basicInformations') }}</div>
                            <div class="panel-body">
                                <div class="form-group">
                                    <label for="name" class="control-label">{{ t('mailAccountName') }}</label>
                                    <input class="form-control required" type="text" id="name" name="name" autofocus="" value="{{ $account->getName() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="senderName" class="control-label">{{ t('mailAccountSenderName') }}</label>
                                    <input class="form-control required" type="text" id="senderName" name="senderName" value="<?php echo $account->getId() ? $account->getSenderName() : $app->user()->getName(); ?>" />
                                </div>
                                <div class="form-group">
                                    <label for="savePassword" class="control-label">{{ t('mailSavePasswordInDatabase') }} <a href="#" class="btn-save-password-help help-inline" data-toggle="tooltip" title="{{ t('help') }}"><i class="fa fa-support text-danger"></i></a></label>
                                    <div class="input-group">
                                        <select name="savePassword" id="savePassword" class="form-control ">
                                            <option value="1"<?php echo $account->getSavePassword() == '1' ? ' selected="selected"' : ''; ?>>{{ t('syes') }}</option>
                                            <option value="0"<?php echo $account->getSavePassword() == '0' ? ' selected="selected"' : ''; ?>>{{ t('sno') }}</option>
                                        </select>
                                        <a class="input-group-addon btn-save-password-help help-inline" href="#" data-toggle="tooltip" title="{{ t('help') }}"><i class="fa fa-support text-danger"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6"></div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">{{ t('mailAccountImapPanel') }}</div>
                            <div class="panel-body">
                                <div class="form-group">
                                    <label for="imapHost" class="control-label">{{ t('mailHost') }}</label>
                                    <input class="form-control required" type="text" id="imapHost" name="imapHost" value="{{ $account->getImapHost() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="imapPort" class="control-label">{{ t('mailPort') }}</label>
                                    <input class="form-control required" type="text" id="imapPort" name="imapPort" value="{{ $account->getImapPort() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="imapUsername" class="control-label">{{ t('mailUsername') }}</label>
                                    <input class="form-control required" type="text" id="imapUsername" name="imapUsername" value="{{ $account->getImapUsername() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="imapPassword" class="control-label">{{ t('mailPassword') }}</label>
                                    <div class="input-group">
                                        <input class="form-control" type="password" id="imapPassword" name="imapPassword" value="{{ $account->getImapPassword() }}" />
                                        <span class="input-group-btn">
                                            <button class="btn btn-default btn-toggle-password-control" type="button">{{ t('mailShowPassword') }}</button>
                                        </span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="imapSecurity" class="control-label">{{ t('mailSecurity') }}</label>
                                    <select name="imapSecurity" id="imapSecurity" class="form-control ">
                                        <option value="nan"<?php echo $account->getImapSecurity() == 'nan' ? ' selected="selected"' : ''; ?>>{{ t('lack') }}</option>
                                        <option value="tls"<?php echo $account->getImapSecurity() == 'tls' ? ' selected="selected"' : ''; ?>>TLS</option>
                                        <option value="ssl"<?php echo $account->getImapSecurity() == 'ssl' ? ' selected="selected"' : ''; ?>>SSL</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="imapCertificateValidation" class="control-label">{{ t('mailImapCertificateValidation') }}</label>
                                    <select name="imapCertificateValidation" id="imapCertificateValidation" class="form-control ">
                                        <option value="1"<?php echo $account->getImapCertificateValidation() == '1' ? ' selected="selected"' : ''; ?>>{{ t('mailImapCertificateValidationYes') }}</option>
                                        <option value="0"<?php echo $account->getImapCertificateValidation() == '0' ? ' selected="selected"' : ''; ?>>{{ t('mailImapCertificateValidationNo') }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="imapProtocol" class="control-label">{{ t('mailImapProtocol') }}</label>
                                    <select name="imapProtocol" id="imapProtocol" class="form-control ">
                                        <option value="imap"<?php echo $account->getImapProtocol() == 'imap' ? ' selected="selected"' : ''; ?>>IMAP</option>
                                        <option value="imap4"<?php echo $account->getImapProtocol() == 'imap4' ? ' selected="selected"' : ''; ?>>IMAP4</option>
                                        <option value="imap2"<?php echo $account->getImapProtocol() == 'imap2' ? ' selected="selected"' : ''; ?>>IMAP2</option>
                                    </select>
                                </div>
                                <div class="row form-group">
                                    <div class="col-md-6 text-right">
                                        <button type="button" id="check-connection-imap" class="btn btn-primary" data-loading-text="{{ t('mailWait') }}">{{ t('mailCheckConnection') }}</button>
                                    </div>
                                    <div class="col-md-6">
                                        <label style="text-align:left;">{{ t('mailStatus') }}<span style="color:#aaa;">{{ t('mailStatusLack') }}</span></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="panel panel-default account-smtp-details">
                            <div class="panel-heading">{{ t('mailAccountSmtpPanel') }}</div>
                            <div class="panel-body">
                                <div class="form-group">
                                    <label for="smtpHost" class="control-label">{{ t('mailHost') }}</label>
                                    <input class="form-control required" type="text" id="smtpHost" name="smtpHost" value="{{ $account->getSmtpHost() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="smtpPort" class="control-label">{{ t('mailPort') }}</label>
                                    <input class="form-control required" type="text" id="smtpPort" name="smtpPort" value="{{ $account->getSmtpPort() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="smtpUsername" class="control-label">{{ t('mailUsername') }}</label>
                                    <input class="form-control required" type="text" id="smtpUsername" name="smtpUsername" value="{{ $account->getSmtpUsername() }}" />
                                </div>
                                <div class="form-group">
                                    <label for="smtpPassword" class="control-label">{{ t('mailPassword') }}</label>
                                    <div class="input-group">
                                        <input class="form-control" type="password" id="smtpPassword" name="smtpPassword" value="{{ $account->getSmtpPassword() }}" />
                                        <span class="input-group-btn">
                                            <button class="btn btn-default btn-toggle-password-control" type="button">{{ t('mailShowPassword') }}</button>
                                        </span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="smtpSecurity" class="control-label">{{ t('mailSecurity') }}</label>
                                    <select name="smtpSecurity" id="smtpSecurity" class="form-control ">
                                        <option value="nan"<?php echo $account->getSmtpSecurity() == 'nan' ? ' selected="selected"' : ''; ?>>{{ t('lack') }}</option>
                                        <option value="tls"<?php echo $account->getSmtpSecurity() == 'tls' ? ' selected="selected"' : ''; ?>>TLS</option>
                                        <option value="ssl"<?php echo $account->getSmtpSecurity() == 'ssl' ? ' selected="selected"' : ''; ?>>SSL</option>
                                    </select>
                                </div>
                                <div class="row form-group">
                                    <div class="col-md-6 text-right">
                                        <button type="button" id="check-connection-smtp" class="btn btn-primary" data-loading-text="{{ t('mailWait') }}">{{ t('mailCheckConnection') }}</button>
                                    </div>
                                    <div class="col-md-6">
                                        <label style="text-align:left;">{{ t('mailStatus') }}<span style="color:#aaa;">{{ t('mailStatusLack') }}</span></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="save-password-help" tabindex="-1" role="dialog" aria-labelledby="save-password-help-modal-label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="save-password-help-modal-label">{{ t('mailWhatMeanSavePasswordInDatabase') }}</h4>
            </div>
            <div class="modal-body">
                <p>{{ t('mailWhatMeanSavePasswordInDatabaseParagraphOne') }}</p>
                <p>{{ t('mailWhatMeanSavePasswordInDatabaseParagraphTwo') }}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Zamknij</button>
            </div>
        </div>
    </div>
</div>
<script>
    $(function() {
        $('.btn-save-password-help').click(function() {
            $('#save-password-help').modal();
            return false;
        });

        APP.FormValidation.bind('form', '#imapPassword', {
            validate: function(elm, val) {
                if($.trim(val) == '' && $('#savePassword').val() == 1)
                {
                    return false;
                }
            },
            errorText: APP.t('thisFieldIsRequired')
        });

        APP.FormValidation.bind('form', '#smtpPassword', {
            validate: function(elm, val) {
                if($.trim(val) == '' && $('#savePassword').val() == 1)
                {
                    return false;
                }
            },
            errorText: APP.t('thisFieldIsRequired')
        });

        $('#check-connection-smtp').on('click', function () {
            var btn = $(this).button('loading');
            setTimeout(function() {
                btn.button('reset');
            }, 2000);
        });

        $('.btn-toggle-password-control').click(function() {
            var pass = $(this).closest('.form-group').find('input[type=password]');

            if(pass.length == 1)
            {
                pass.attr('type', 'text');
                $(this).text('{{ t('mailHidePassword') }}');
                return false;
            }

            var text = $(this).closest('.form-group').find('input[type=text]');

            if(text.length == 1)
            {
                text.attr('type', 'password');
                $(this).text('{{ t('mailShowPassword') }}');
                return false;
            }
        });

        $('#check-connection-imap').on('click', function () {
            var btn = $(this).button('loading');

            $.ajax({
                type     : "POST",
                url      : APP.createUrl('Mail', 'Mail', 'connectionCheck'),
                data     : {
                    type: 'imap',
                    imapHost : $('#imapHost').val(),
                    imapPort : $('#imapPort').val(),
                    imapUsername : $('#imapUsername').val(),
                    imapPassword : $('#imapPassword').val(),
                    imapSecurity : $('#imapSecurity').val(),
                    imapCertificateValidation : $('#imapCertificateValidation').val(),
                    imapProtocol : $('#imapProtocol').val()
                },
                success : function(msg) {
                    console.log(msg);

                    try {
                        var result = jQuery.parseJSON(msg);

                        if(result.status)
                        {
                            btn.parent().parent().find('label span').text(result.message).css('color', (result.status == 'success' ? '#5CB85C' : '#D9534F'));
                        }
                    }
                    catch(e) {
                        btn.parent().parent().find('label span').text('Serwer zwrócił błędne dane: ' + e.message).css('color', '#D9534F');
                    }

                    btn.button('reset');
                },
                error:    function(error, textStatus, errorThrown) {
                    console.log(error);

                    btn.parent().parent().find('label span').text('Serwer zwrócił status błędu - 500 Internal Server Error.').css('color', '#D9534F');

                    btn.button('reset');
                }
            });
        });

        $('#check-connection-smtp').on('click', function () {
            var btn = $(this).button('loading');

            $.ajax({
                type     : "POST",
                url      : APP.createUrl('Mail', 'Mail', 'connectionCheck'),
                data     : {
                    type: 'smtp',
                    smtpHost : $('#smtpHost').val(),
                    smtpPort : $('#smtpPort').val(),
                    smtpUsername : $('#smtpUsername').val(),
                    smtpPassword : $('#smtpPassword').val(),
                    smtpSecurity : $('#smtpSecurity').val()
                },
                success : function(msg) {
                    console.log(msg);

                    try {
                        var result = jQuery.parseJSON(msg);

                        if(result.status)
                        {
                            btn.parent().parent().find('label span').text(result.message).css('color', (result.status == 'success' ? '#5CB85C' : '#D9534F'));
                        }
                    }
                    catch(e) {
                        btn.parent().parent().find('label span').text('Serwer zwrócił błędne dane: ' + e.message).css('color', '#D9534F');
                    }

                    btn.button('reset');
                },
                error:    function(error, textStatus, errorThrown) {
                    console.log(error);

                    btn.parent().parent().find('label span').text('Serwer zwrócił status błędu - 500 Internal Server Error.').css('color', '#D9534F');

                    btn.button('reset');
                }
            });
        });
    });
</script>
