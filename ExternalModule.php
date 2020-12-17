<?php

namespace SP\ExternalModule;

use ExternalModules\AbstractExternalModule;

class ExternalModule extends AbstractExternalModule {

    function redcap_every_page_top($project_id) {
        $this->initializeJavascriptModuleObject();
        $this->tt_addToJavascriptModuleObject('key', 'value');
        $this->tt_addToJavascriptModuleObject('ajaxPage', json_encode($this->framework->getUrl("functionBus.php")));
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

    function sampleFunction($data) {
        $response = 'hello' . $data . $this->tt('ajaxPage');
        echo $response;
    }

    function renderHTML() {
        $this->includeJs('js/sp.js');
        include('html/app.html');
    }

    function includeJs($path) {
        echo '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">';
        echo '<script src="https://unpkg.com/vue@next"></script>';
        echo '<script src="' . $this->getUrl($path) . '"></script>';
    }
}