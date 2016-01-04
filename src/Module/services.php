<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

return [
    'mod.mail.beforeResponseSend' => [
        'class' => 'App\Module\Mail\Event\BeforeResponseSend',
        'use-factory' => true,
        'listen' => [
            'onBeforeResponseSend',
        ]
    ],
    'mod.mail.sessionCreateNew' => [
        'class' => 'App\Module\Mail\Event\SessionCreateNew',
        'use-factory' => true,
        'listen' => [
            'onSessionCreateNew',
        ]
    ],
    'mod.mail.chartData' => [
        'class' => 'App\Module\Mail\ChartData',
        'use-factory' => true
    ],
];
