@no-extends
<div role="tabpanel" class="tab-pane active" id="mail">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">{{ t('basicInformations') }}</div>
                    <div class="panel-body">
                        <div class="form-group">
                            <label for="mod-mail-app-message-perpage" class="control-label">{{ t('mailMessagesPerPage') }}</label>
                            <input type="text" name="mod_mail_app_message_perpage" id="mod-mail-app-message-perpage" class="form-control" value="{{ $settingsUser->get('mod.mail.app.message.perpage') }}">
                        </div>
                        <div class="form-group">
                            <label for="mail-layout-type" class="control-label">{{ t('mailLayoutType') }}</label>
                            <select name="mail_layout_type" id="mail-layout-type" class="form-control">
                                <option value="1"<?php echo ($settingsUser->get('mod.mail.app.layout.type') == 1 ? ' selected="selected"' : ''); ?>>{{ t('mailLayoutType1') }}</option>
                                <option value="2"<?php echo ($settingsUser->get('mod.mail.app.layout.type') == 2 ? ' selected="selected"' : ''); ?>>{{ t('mailLayoutType2') }}</option>
                            </select>
                        </div>
                        <div class="form-group textarea-content">
                            <label for="mail-language" class="control-label">{{ t('mailMessageSignature') }}</label>
                            <textarea name="mail_signature" id="mail_signature">{{ $settingsUser->get('mod.mail.message.signature')|raw }}</textarea>
                            <script>
                                $(document).ready(function() {
                                    $('textarea#mail_signature').summernote({
                                        height: 400,
                                        minHeight: null,
                                        maxHeight: null,
                                        lang: 'pl-PL'
                                    });
                                });
                            </script>
                            <!--<div class="bg-info panel-help"><h6>{{ t('prompt') }}</h6><p>{{ t('mailMessageSignatureInfo') }}</p></div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<link href="{{ asset('/modules/Mail/summernote/summernote.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('/modules/Mail/summernote/summernote-bs3.css') }}" rel="stylesheet" type="text/css" />
<script src="{{ asset('/modules/Mail/summernote/summernote.min.js') }}"></script>
<script src="{{ asset('/modules/Mail/summernote/lang/summernote-pl-PL.js') }}"></script>
<style>
    .modal-backdrop {display:none;}
    .textarea-content .note-editor {border:1px solid #ddd;border-radius:3px;}
    .textarea-content .note-editor h4,
    .textarea-content .note-editor h5,
    .textarea-content .note-editor h6 {margin:0;}
    .textarea-content .note-editor .panel-heading {padding:5px 10px 10px;border-bottom:1px solid #ddd;}
    .textarea-content .note-editor blockquote,
    .textarea-content .note-editor blockquote p {font-size:12px;font-weight:normal;line-height:1.4;}
    /* Block upload image from local disk */
    .textarea-content .note-group-select-from-files {display:none;}
</style>
