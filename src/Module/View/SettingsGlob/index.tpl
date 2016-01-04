@no-extends

<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">{{ t('basicInformations') }}</div>
                <div class="panel-body">
                    <div class="form-group">
                        <label for="mod_mail_stat_savesentmailsinfo" class="control-label">{{ t('mailSaveSentMailsAsStats') }}</label>
                        <select name="mod_mail_stat_savesentmailsinfo" id="mod_mail_stat_savesentmailsinfo" class="form-control ">
                            <option value="1"<?php echo $settings->get('mod.mail.stat.savesentmailsinfo') == '1' ? ' selected="selected"' : ''; ?>>{{ t('syes') }}</option>
                            <option value="0"<?php echo $settings->get('mod.mail.stat.savesentmailsinfo') == '0' ? ' selected="selected"' : ''; ?>>{{ t('sno') }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
