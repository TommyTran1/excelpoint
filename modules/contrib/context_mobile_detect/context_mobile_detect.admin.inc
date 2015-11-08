<?php

function context_mobile_detect_settings() {
  $form['cmd_mobile_detect_library_path'] = array(
    '#type' => 'textfield',
    '#title' => t('Library Path'),
    '#description' => t('Context Mobile Detect runs on a very early steps thats why it\'s necessary to specify path to Mobile Detect library. By default it\'s @path.', array('@path' => MOBILE_DETECT_LIBRARY_PATH)),
    '#default_value' => variable_get('cmd_mobile_detect_library_path', MOBILE_DETECT_LIBRARY_PATH),
  );

  return system_settings_form($form);
}