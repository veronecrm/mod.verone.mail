@no-extends
<?php 
    $app->assetter()
    ->load('datetimepicker')
    ->load([
        'files' => [ 'js' => [ '{ASSETS}/flot/jquery.flot.time.min.js', '{ASSETS}/flot/jquery.flot.resize.min.js', '{ASSETS}/flot/jquery.flot.axislabels.js' ] ],
        'require' => [ 'flot' ]
    ]);
?>
<div class="page-header">
    <div class="page-header-content">
        <div class="page-title">
            <h1>
                <i class="fa fa-bar-chart-o"></i>
                {{ t('mailStatistics') }}
            </h1>
        </div>
        <div class="heading-elements">
            <div class="heading-btn-group">
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
            <li><a href="{{ createUrl('Statistics', 'Statistics', 'index') }}">{{ t('statistics') }}</a></li>
            <li class="active"><a href="{{ createUrl('Mail', 'Stats', 'index') }}">{{ t('mailMail') }}</a></li>
        </ul>
    </div>
</div>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">{{ t('mailChartSentMailsForUsersGoups') }}</div>
                <div class="panel-body">
                    <div class="chart-container">
                        <div id="chart-placeholder-1" class="chart-placeholder"></div>
                        <div class="chart-sidebar">
                            <strong>{{ t('mailSelectUsersGroup') }}</strong>
                            <p id="chart-choices-1" class="chart-choices"></p>
                            <hr />
                            <label><input type="checkbox" class="chart-toggle-legend" checked="checked" /> {{ t('mailLegend') }}</label>
                        </div>
                    </div>
                    {# <!--
                    <div class="container-fluid chart-options">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Wybierz przedział czasowy</label>
                                    <div class="container-fluid">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="input-group date">
                                                    <input type="text" class="form-control" name="chart_1_date_from" id="chart-1-zmr-date-from" placeholder="Od" value="{{ date('Y-m', strtotime('now - 3 months')) }}" />
                                                    <span class="input-group-addon calendar-open">
                                                        <span class="glyphicon glyphicon-calendar"></span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="input-group date">
                                                    <input type="text" class="form-control" name="chart_2_date_from" id="chart-1-zmr-date-to" placeholder="Od" value="{{ date('Y-m') }}" />
                                                    <span class="input-group-addon calendar-open">
                                                        <span class="glyphicon glyphicon-calendar"></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    --> #}
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">{{ t('mailChartSentMailsForUsers') }}</div>
                <div class="panel-body">
                    <div class="chart-container">
                        <div id="chart-placeholder-2" class="chart-placeholder"></div>
                        <div class="chart-sidebar">
                            <strong>{{ t('mailSelectUser') }}</strong>
                            <p id="chart-choices-2" class="chart-choices"></p>
                            <hr />
                            <label><input type="checkbox" class="chart-toggle-legend" checked="checked" /> {{ t('mailLegend') }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    var Chart = function(placeholder, choices, datasets) {
        this.id          = null;
        this.wrapper     = wrapper;
        this.placeholder = placeholder;
        this.choices     = choices;
        this.datasets    = datasets;
        /**
         * Store tooltip object.
         * @type jQuery
         */
        this.tooltip = null;

        this.init = function() {
            this.placeholder = $(this.placeholder);
            this.choices     = $(this.choices);
            this.wrapper     = this.placeholder.closest('.chart-container');
            this.id = this.placeholder.attr('id');
            this.createTooltip();
            this.prepareDatasets();
            this.prepareChoicesList();
            this.plotAccordingToChoices();

            var self = this;

            this.placeholder.bind('plothover', function(event, pos, item) {
                if(item)
                {
                    var x = self.formatDateFromTimestamp(item.datapoint[0]),
                        y = item.datapoint[1];

                    self.tooltip.html(x + ' - ' + y)
                        .css({top: item.pageY + 5, left: item.pageX + 5})
                        .fadeIn(200);
                }
                else
                {
                    self.tooltip.hide();
                }
            });

            this.wrapper.find('.chart-toggle-legend').change(function() {
                if($(this).prop('checked'))
                    self.wrapper.find('.legend').show();
                else
                    self.wrapper.find('.legend').hide();
            });
        };

        this.createTooltip = function() {
            this.tooltip = $('<div class="chart-tooltip"></div>');
            this.tooltip.appendTo('body');
        };

        this.prepareDatasets = function() {
            var i = 0;

            $.each(this.datasets, function(key, val) {
                val.color = i++;
            });
        };

        this.prepareChoicesList = function() {
            var self = this;
            var i = 0;

            $.each(this.datasets, function(key, val) {
                self.choices.append('<label for="id-' + self.id + key + '"><input type="checkbox" name="' + key + '"' + (i < 4 ? ' checked="checked"' : '') + ' id="id-' + self.id + key + '"></input>&nbsp;' + repeat('&ndash;&nbsp;&nbsp;', val.depth) + val.label + '</label>');
                i++;
            });

            self.choices.find("input").click(function() {
                self.plotAccordingToChoices();
            });
        };

        this.plotAccordingToChoices = function() {
            var self = this;
            var data = [];

            self.choices.find('input:checked').each(function() {
                var key = $(this).attr('name');

                if(key && self.datasets[key])
                {
                    data.push(self.datasets[key]);
                }
            });

            if(data.length > 0) {
                $.plot(self.placeholder, data, {
                    yaxis: {
                        min: 0
                    },
                    xaxis: {
                        mode: 'time',
                        timeformat: '%Y-%m'
                    },
                    xaxes: [{
                        axisLabel: '{{ t('mailDatePeriod') }}',
                    }],
                    yaxes: [{
                        position: 'left',
                        axisLabel: '{{ t('mailSentMailsCount') }}',
                    }, {
                        position: 'right',
                        axisLabel: 'bleem'
                    }],
                    shadowSize: 0,
                    points: { show: true },
                    lines: { show: true },
                    grid: { hoverable: true },
                    axisLabels: { show: true }
                });
            }
        };

        this.formatDateFromTimestamp = function(ts) {
            var d = new Date(ts);

            return d.getFullYear() + '.' + (d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1));
        }
    };

    $(function() {
        /* 
         * @todo
        $('.input-group.date input')
            .datetimepicker({
                format:'YYYY-MM',
                defaultDate:'<?php echo date('Y-m'); ?>',
                viewMode: 'months'
            })
            .parent()
            .find('.input-group-addon.calendar-open')
            .click(function() {
                $(this).parent().find('input').trigger('focus');
            });
        */

        var datasets1 = {
            @loop $groups
                "{{ $item['id'] }}": {
                    label: "{{ $item['name'] }}",
                    depth: {{ $item['depth'] }},
                    data: [
                        @loop $item['data'] as $data
                            [{{ $data['date'] }}, {{ $data['count'] }}],
                        @endloop
                    ]
                },  
            @endloop
        };

        var chart1 = new Chart('#chart-placeholder-1', '#chart-choices-1', datasets1);
            chart1.init();

        var datasets2 = {
            @loop $users
                "{{ $item['id'] }}": {
                    label: "{{ $item['name'] }}",
                    depth: 0,
                    data: [
                        @loop $item['data'] as $data
                            [{{ $data['date'] }}, {{ $data['count'] }}],
                        @endloop
                    ]
                },  
            @endloop
        };

        var chart2 = new Chart('#chart-placeholder-2', '#chart-choices-2', datasets2);
            chart2.init();
    });

    function repeat(pattern, count)
    {
        if(count < 1)
            return '';

        var result = '';

        while(count > 1)
        {
            if (count & 1) result += pattern;
            count >>= 1, pattern += pattern;
        }

        return result + pattern;
    }
</script>
<style>
.chart-container {width:100%;height:450px;padding:0 15px 25px 25px;padding-right:230px;position:relative;z-index:1}
.chart-container .chart-placeholder {width:100%;height:100%;font-size:14px;line-height:1.3;position:relative;}
.chart-container .chart-sidebar {width:230px;top:0;right:0;position:absolute;z-index:10;margin:0;padding:5px 10px 0 10px;}
.chart-container .chart-sidebar strong {font-size:16px;text-transform:uppercase;display:block;margin:0 0 10px 0;}
.chart-container .legend table td {padding:3px;}
.chart-options {position:relative;z-index:2}
.chart-tooltip {position:absolute;z-index:2;display:none;padding:3px 8px;color:#fff;background-color:#0088CC;border-radius:2px}
.axisLabels {font-size:14px;line-height:1;}
.axisLabels.xaxisLabel {top:15px !important;}
.axisLabels.yaxisLabel {left:-15px !important;}
</style>
