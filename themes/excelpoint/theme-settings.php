<?php

function excelpoint_form_system_theme_settings_alter(&$form, &$form_state) {
  $form['drupal_blog_settings'] = array(
		'#type' => 'fieldset',
		'#title' => 'Blog settings',
		'#group' => 'drupalexp_settings',
		'#weight' => 100,
	);
  $form['drupal_blog_settings']['blog_style'] = array(
      '#type' => 'select',
      '#title' => t('Blog style'),
      '#options' => array(
          'medium' => t('Medium Image'),
          'large' => t('Large Image'),
          'timeline' => t('Timeline Post'),
      ),
      '#default_value' => theme_get_setting('blog_style', 'excelpoint'),
  );
}
