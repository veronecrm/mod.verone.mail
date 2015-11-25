<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Mail\App;

class EmailAddressParser
{
	private $list = [];

	public function __construct($data)
	{
		$this->parse($data);
	}

	public function hasAny()
	{
		return count($this->list) ? true : false;
	}

	public function parse($data)
	{
		$interation = 0;
		$index      = 'name';
		$result     = array();
		$result[$interation] = array($index => '');

		foreach($this->stringToArray($data) as $char)
		{
			switch($char)
			{
				case '<':
					$index = 'address';
					break;
				case '>':
					break;
				case ',':
					$interation++;
					$index = 'name';
					break;
				default:
					if(! isset($result[$interation][$index]))
					{
						$result[$interation][$index] = '';
					}

					$result[$interation][$index] .= $char;
			}
		}

		$newResult  = array();
		$interation = 0;

		foreach($result as $val)
		{
			$address = '';

			if(! isset($val['address']))
			{
				if(filter_var(trim($val['name']), FILTER_VALIDATE_EMAIL))
				{
					$newResult[$interation]['address'] = trim($val['name']);
				}
				else
				{
					continue;
				}
			}
			else
			{
				$newResult[$interation]['address'] = trim($val['address']);
			}

			if(! isset($val['name']))
			{
				$newResult[$interation]['name'] = '"'.$address.'"';
			}
			else
			{
				$newResult[$interation]['name'] = trim($val['name']);
			}

			$interation++;
		}

		$this->list = $newResult;

		return $this;
	}

	public function getListed()
	{
		return $this->list;
	}

	public function getAsPairs()
	{
		$return = [];

		foreach($this->list as $item)
		{
			$return[$item['address']] = $item['name'];
		}

		return $return;
	}

	public function toString()
	{
		$return = [];

		foreach($this->list as $item)
		{
			$return[] = "{$item['name']} <{$item['address']}>";
		}

		return implode(', ', $return);
	}

	private function stringToArray($string)
	{ 
		$array = array();
		
		if(function_exists('mb_strlen'))
		{
			if(mb_strlen($string, 'UTF-8') == 0)
			{
				return array();
			}
		 
			$alen = strlen ($string);
			$char = '';
			
			for($i = 0; $i < $alen; $i++)
			{
				$char .= $string[$i];
				
				if(mb_check_encoding($char, 'UTF-8'))
				{
					array_push($array, $char);
					$char = '';
				}
			}
		}
		else
		{
			$i = 0;
			
			while(isset($string[$i]))
			{
				$array[] = $string[$i++];
			}
		}
		
		return $array; 
	}
}
