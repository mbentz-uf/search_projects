<?php

namespace SP\ExternalModule;

use ExternalModules\AbstractExternalModule;
use REDCap;
use Exception;
class ExternalModule extends AbstractExternalModule {

    // An attempt at catching the exit() statement for self::checkProjectContext(__METHOD__); 
    function shutdown() {
        echo 'Script executed with success', PHP_EOL;
    }

    // Does not get called for Control Center Plugins
    // Neither does redcap_control_center
    function redcap_every_page_top() {
        $this->initializeJavascriptModuleObject();
        $this->tt_addToJavascriptModuleObject('key', 'value');
        $this->tt_addToJavascriptModuleObject('ajaxPage', json_encode($this->framework->getUrl("handler.php")));
        
        /*
         * Inline JS
            ?>
            <script>
                $(function(){
                    var module = ExternalModules;
                    // module.log('Hello from JavaScript!');
                    console.log(module);
                })
            </script>
            <?php
        */
        // echo '<script src="https://unpkg.com/vue@next";</script>';
        // echo '<script src="t";<\/script>';
        
        
        // $this->includeJs('js/sp.js');
    }

    function getAllData($data) {
        // Create anonymous object
        $response = (object)[];
        try {
            $data = REDCap::getData('array');
            $response->data = $data;
        } catch (Exception $e) {
            $response->error = 'Caught exception: ' . $e->getMessage() . "\n";
        }

        echo json_encode($response);
    }

    function getExternalModules($data) {
        // Create anonymous object
        $response = (object)[];
        try {
            $sql = "select * from redcap_external_modules";
            $result = $this->framework->query($sql);
            $response->data = $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }

        echo json_encode($response);
    }

    function getProjects($data) {
        // Create anonymous object
        $response = (object)[];
        try {
            $sql = "select * from redcap_projects";
            $result= $this->framework->query($sql);
            $response->data = $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }

        echo json_encode($response);
    }

    function getUsers($data) { //, $pid) {
        // TODO: Figure out how to catch the error when getUsers is called without pid context
        // self::checkProjectContext(__METHOD__);
        // register_shutdown_function('shutdown');
        
        // Create anonymous object
        $response = (object)[];
        try {
            $users = REDCap::getUsers();
            $response->data = $users;
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }
        
        echo json_encode($response);
    }

    function renderHTML() {
        $this->initializeJavascriptModuleObject();
        $this->tt_addToJavascriptModuleObject('key', 'value');
        // TODO: This page does not exist from a control center page
        $this->tt_addToJavascriptModuleObject('ajaxPage', json_encode($this->framework->getUrl("handler.php")));
        
        $this->includeJs('js/sp.js');
        include('html/app.html');
    }

    function includeJs($path) {
        echo '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">';
        echo '<script src="https://unpkg.com/vue@next"></script>';
        echo '<script src="' . $this->getUrl($path) . '"></script>';
    }

    private function parseException($e) {
        return 'Caught exception: ' . $e->getMessage() . "\n"; 
    }
}