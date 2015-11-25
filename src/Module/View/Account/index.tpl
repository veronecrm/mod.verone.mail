<div class="page-header">
    <div class="page-header-content">
        <div class="page-title">
            <h1>
                <i class="fa fa-at"></i>
                {{ t('mailAccounts') }}
            </h1>
        </div>
        <div class="heading-elements">
            <div class="heading-btn-group">
                <a href="<?php echo $app->createUrl('Mail', 'Account', 'add'); ?>" class="btn btn-icon-block btn-link-success">
                    <i class="fa fa-plus"></i>
                    <span>{{ t('mailAccountNew') }}</span>
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
            <li class="active"><a href="{{ createUrl('Mail', 'Account', 'index') }}">{{ t('mailAccounts') }}</a></li>
        </ul>
    </div>
</div>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <table class="table table-default table-clicked-rows table-responsive">
                <thead>
                    <tr>
                        <th>{{ t('name') }}</th>
                        <th class="text-right">{{ t('action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach $elements
                        <tr data-row-click-target="<?php echo $app->createUrl('Mail', 'Account', 'edit', [ 'id' => $item->getId() ]); ?>">
                            <td data-th="{{ t('name') }}" class="th"><?php echo $item->getName(); ?></td>
                            <td data-th="{{ t('action') }}" class="app-click-prevent">
                                <div class="actions-box">
                                    <div class="btn-group right">
                                        <a href="<?php echo $app->createUrl('Mail', 'Account', 'edit', [ 'id' => $item->getId() ]); ?>" class="btn btn-default btn-xs btn-main-action" title="{{ t('edit') }}"><i class="fa fa-pencil"></i></a>
                                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu with-headline right">
                                            <li class="headline">{{ t('moreOptions') }}</li>
                                            <li><a href="<?php echo $app->createUrl('Mail', 'Account', 'edit', [ 'id' => $item->getId() ]); ?>" title="{{ t('edit') }}"><i class="fa fa-pencil"></i> {{ t('edit') }}</a></li>
                                            <li role="separator" class="divider"></li>
                                            <li class="item-danger"><a href="#" data-toggle="modal" data-target="#account-delete" data-href="<?php echo $app->createUrl('Mail', 'Account', 'delete', [ 'id' => $item->getId() ]); ?>" title="{{ t('delete') }}"><i class="fa fa-remove danger"></i> {{ t('delete') }}</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="account-delete" tabindex="-1" role="dialog" aria-labelledby="account-delete-modal-label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content modal-danger">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="{{ t('close') }}"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="account-delete-modal-label">{{ t('mailAccountDeleteConfirmationHeader') }}</h4>
            </div>
            <div class="modal-body">
                {{ t('mailAccountDeleteConfirmationContent') }}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">{{ t('close') }}</button>
                <a href="#" class="btn btn-danger">{{ t('syes') }}</a>
            </div>
        </div>
    </div>
</div>
<script>
    $('#account-delete').on('show.bs.modal', function (event) {
        $(this).find('.modal-footer a').attr('href', $(event.relatedTarget).attr('data-href'));
    });
</script>
