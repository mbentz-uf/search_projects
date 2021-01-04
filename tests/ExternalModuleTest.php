<?php 

namespace SP\ExternalModule;
// For now, the path to "redcap_connect.pho" on your system must be hard coded.
require_once __DIR__ . '/../../../redcap_connect.php';

class ExternalModuleTest extends \ExternalModules\ModuleBaseTest {
    function testMethod() {
        $expected = 'hi';
        
        $actual1 = $this->module->getValue($expected);
        // shorter syntax without explicitly specifying "->module" is also supported.
        $actual2 = $this->getValue($expected);

        $this->assertSame($expected, $actual1);
        $this->assertSame($expected, $actual2);
    }
}