<?php

namespace SP\ExternalModule;
require_once(__DIR__ . '/ExternalModule.php');

$function = $_REQUEST["function"];
$data = $_REQUEST["data"];
// This needs to be within the context but does not need to be passed for self::checkProjectContext(__METHOD__); to pass
$pid = $_REQUEST["pid"];

// TODO: Figure out how to get a hold of the current ExternalModule
$EM = new ExternalModule();

// TODO: Figure out how to do this without a switch statement
switch ($function) {
    case 'getEvents':
        $EM->getEvents($data); //, $pid);
        break;
    case 'getExternalModules':
        $EM->getExternalModules($data); //, $pid);
        break;
    case 'getProjects':
        $EM->getProjects($data); //, $pid);
        break;
    case 'getTemplates':
        $EM->getTemplates($data); //, $pid);
        break;
    case 'getUsers':
        $EM->getUsers($data); //, $pid);
        break;
    case 'getAllData':
        $EM->getAllData($data);
        break;
}

// Works
// ExternalModule::sampleFunction('hi');
//$EM->sampleFunction($data);

// Does NOT work
// call_user_func_array(array($EM, $function($data)), $data);
// call_user_func_array("SP\ExternalModule\ExternalModule::" . $function, $data);
// call_user_func_array($function, $data); 
