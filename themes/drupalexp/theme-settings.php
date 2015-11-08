<?php
require_once dirname(__FILE__) . '/includes/core.php';
require_once dirname(__FILE__) . '/inc/layout_settings.inc';
require_once dirname(__FILE__) . '/inc/preset_settings.inc';
require_once dirname(__FILE__) . '/inc/basic_settings.inc';
/**
 * Implements hook_form_system_theme_settings_alter()
 */
function drupalexp_form_system_theme_settings_alter(&$form,&$form_state,$form_id = NULL) {
	$theme_key = arg(3);
	if(file_exists(drupal_get_path('theme',$theme_key).'/template.php')){
		require_once drupal_get_path('theme',$theme_key).'/template.php';
	}
	$theme = drupalexp_get_theme();
	$form['drupalexp_settings'] = array(
		'#type' => 'vertical_tabs',
	);
	$form['drupal_core_settings'] = array(
		'#type' => 'fieldset',
		'#title' => 'Drupal core',
		'#group' => 'drupalexp_settings',
		'#weight' => 99,
	);
	$form['drupal_core_settings']['theme_settings'] = $form['theme_settings'];
	$form['drupal_core_settings']['logo'] = $form['logo'];
	$form['drupal_core_settings']['favicon'] = $form['favicon'];
	unset($form['theme_settings']);
	unset($form['logo']);
	unset($form['favicon']);
	drupalexp_layout_settings_form_alter($form);
	drupalexp_preset_settings_form_alter($form);
	drupalexp_basic_settings_form_alter($form);
	$form['#submit'][] = 'drupalexp_form_system_theme_settings_submit';
	$form['#submit'][] = 'drupalexp_form_system_theme_settings_submit';
}

function drupalexp_form_system_theme_settings_submit(&$form,&$form_state){
	variable_set('drupalexp_settings_updated',REQUEST_TIME);
}