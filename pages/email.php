<?php
require_once APP_PATH_DOCROOT . 'ProjectGeneral/header.php';

// $projects = array(14);
// REDCap::allowProjects($projects);

// $title = RCView::img(['src' => APP_PATH_IMAGES . 'bell.png']) . ' ' . REDCap::escapeHtml('Control Center Page');
// $element = RCView::h4(['id' => 'app'], $title);
// echo $element;

$module->renderEmailPage();

require_once APP_PATH_DOCROOT . 'ProjectGeneral/footer.php';