<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 - 2016 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail;

use CRM\Base;

class ChartData extends Base
{
    public function getDataByUsersGroups()
    {
        $groups = $this->repo('Group', 'User')->getTree();
        $db     = $this->db();
        $result = [];

        foreach($groups as $group)
        {
            $data = $db->query(
            "SELECT COUNT(id) AS count, ms.date AS date
            FROM #__mail_sent AS ms
            WHERE ms.userId IN (
                SELECT id
                FROM #__user AS u
                WHERE u.group = {$group->getId()}
                GROUP BY u.id
            )
            GROUP BY YEAR(ms.date), MONTH(ms.date)
            ORDER BY ms.date DESC");

            foreach($data as $key => $item)
            {
                $trueTs = strtotime($item['date']);
                $data[$key]['date'] = strtotime(date('Y-m', $trueTs).'-01 01:00:00') * 1000;
            }

            $result[] = [
                'name' => $group->getName(),
                'id'   => $group->getId(),
                'depth'=> $group->depth,
                'data' => $data
            ];
        }

        return $result;
    }

    public function getDataByUsers()
    {
        $users  = $this->repo('User', 'User')->findAll();
        $db     = $this->db();
        $result = [];

        foreach($users as $user)
        {
            $data = $db->query(
            "SELECT COUNT(id) AS count, ms.date AS date
            FROM #__mail_sent AS ms
            WHERE ms.userId IN (
                SELECT id
                FROM #__user AS u
                WHERE u.id = {$user->getId()}
                GROUP BY u.id
            )
            GROUP BY YEAR(ms.date), MONTH(ms.date)
            ORDER BY ms.date DESC");

            foreach($data as $key => $item)
            {
                $trueTs = strtotime($item['date']);
                $data[$key]['date'] = strtotime(date('Y-m', $trueTs).'-01 01:00:00') * 1000;
            }

            $result[] = [
                'name' => $user->getName(),
                'id'   => $user->getId(),
                'data' => $data
            ];
        }

        return $result;
    }
}
