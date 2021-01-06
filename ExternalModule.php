<?php

namespace SP\ExternalModule;

use ExternalModules\AbstractExternalModule;
use REDCap;
use Exception;

const ymdFormat = "%Y-%m-%d";
class ExternalModule extends AbstractExternalModule
{

    // An attempt at catching the exit() statement for self::checkProjectContext(__METHOD__); 
    function shutdown()
    {
        echo 'Script executed with success', PHP_EOL;
    }

    // Does not get called for Control Center Plugins
    // Neither does redcap_control_center
    function redcap_every_page_top()
    {
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
    }

    function getAllData($data = '')
    {
        // Create anonymous object
        $response = (object)[];
        try {
            // $params = array('return_format' => 'json', 'filterLogic' => '[age] >= 18', 'fields' => array('dob','record_id'));
            $params = array('return_format' => 'json');
            $data = REDCap::getData($params);
            $response->data = $data;
        } catch (Exception $e) {
            $response->error = 'Caught exception: ' . $e->getMessage() . "\n";
        }

        echo json_encode($response);
    }

    // Dummy function for unit tests
    function getValue($val)
    {
        return $val;
    }

    function getEvents($data = '')
    {
        // Create anonymous object
        $response = (object)[];
        try {
            $sql = "SELECT
                        all_event_logs.log_event_id,
                        all_event_logs.project_id,
                        all_event_logs.user,
                        all_event_logs.page,
                        all_event_logs.event,
                        all_event_logs.description
                    FROM (
                        select * from redcap_log_event
                        union all
                        select * from redcap_log_event2
                        union all
                        select * from redcap_log_event3
                        union all
                        select * from redcap_log_event4
                        union all
                        select * from redcap_log_event5
                    ) all_event_logs";
            $result = $this->framework->query($sql);
            $response->data = $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }

        // For AJAX call
        echo json_encode($response);
        // For unit tests
        return $response;
    }

    function getExternalModules($data = '')
    {
        // Create anonymous object
        $response = (object)[];
        try {
            $sql = "SELECT * 
                    FROM redcap_external_modules
                    ORDER BY external_module_id asc";
            $result = $this->framework->query($sql);
            $response->data = $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }

        // For AJAX call
        echo json_encode($response);
        // For unit tests
        return $response;
    }

    function getProjects($data = '')
    {
        // Create anonymous object
        $response = (object)[];
        try {
            $sql = "SELECT 
                        concat('" . APP_PATH_WEBROOT . "ProjectSetup/index.php?pid=', projects.project_id) as url, 
                        projects.project_id,
                        projects.project_name,
                        projects.app_title,
                        if(projects.status=1, 'prod', 'dev') as status,
                        date_format(projects.creation_time, \"%Y-%m-%d\") as creation_time, 
                        date_format(projects.production_time, \"%Y-%m-%d\") as production_time
                    FROM redcap_projects projects
                    ORDER BY project_id asc";
            $result = $this->framework->query($sql);
            $response->data = $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }

        // For AJAX call
        echo json_encode($response);
        // For unit tests
        return $response;
    }

    function getTemplates($data = '')
    {
        // Create anonymous object
        $response = (object)[];
        try {
            $sql = "SELECT
                        project_id,
                        title,
                        description
                    FROM redcap_projects_templates";
            $result = $this->framework->query($sql);
            $response->data = $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            $response->error = $this->parseException($e);
        }

        // For AJAX call
        echo json_encode($response);
        // For unit tests
        return $response;
    }


    function getUsers($data = '')
    { //, $pid) {
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

        // For AJAX call
        echo json_encode($response);
        // For unit tests
        return $response;
    }

    function renderHTML()
    {
        $this->initializeJavascriptModuleObject();
        // TODO: This page does not exist from a control center page
        $this->tt_addToJavascriptModuleObject('ajaxPage', json_encode($this->framework->getUrl("handler.php")));
        $this->includeResources('js/app.js');
        include('html/app.html');
    }

    function includeResources($path)
    {
        echo '<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">';
        echo '<link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">';
        echo '<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>';
        echo '<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>';
        echo '<script src="' . $this->getUrl($path) . '"></script>';
    }

    private function parseException($e)
    {
        return 'Caught exception: ' . $e->getMessage() . "\n";
    }
}
