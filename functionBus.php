<?php

namespace SP\ExternalModule;
require_once(__DIR__ . '/ExternalModule.php');

$function = $_REQUEST["function"];
$data = $_REQUEST["data"];

// TODO: Figure out how to get a hold of the current ExternalModule
$EM = new ExternalModule();

// TODO: Figure out how to do this without a switch statement
switch ($function) {
    case 'sampleFunction':
        $EM->sampleFunction($data);
        break;
}

// Works
// ExternalModule::sampleFunction('hi');
//$EM->sampleFunction($data);

// Does NOT work
// call_user_func_array(array($EM, $function($data)), $data);
// call_user_func_array("SP\ExternalModule\ExternalModule::" . $function, $data);
// call_user_func_array($function, $data); 
?>