<?php

/**
 * Implements hook_form().
 */
function workflow_transition_extra_form($form, &$form_state, $name) {
  $workflow = workflow_load_by_name($name);
  $form_state['workflow'] = $workflow;

  $fields = workflow_transition_extra_get_workable_fields();
  $options = array('-- none --');
  foreach ($fields as $key => $fields) {
    list($type, $bundle) = explode(':', $key);
    foreach ($fields as $field) {
      $instance = field_info_instances($type, $bundle);
      $label = $instance[$field['field_name']]['label'];
      $options[$field['field_name']] = "$label - {$field['field_name']}";
    }
  }

  $states = $workflow->states;
  $form['transitions'] = array(
    '#type'  => 'fieldset',
    '#tree'  => TRUE,
    '#title' => t('Select entityreference field contain user allowed to change state.')
  );

  foreach ($workflow->transitions as $transition) {
    $label = $workflow->states[$transition->sid]->name . ' --> ' . $workflow->states[$transition->target_sid]->name;
    $key = implode(':', array($transition->sid, $transition->target_sid));
    $form['transitions'][$key] = array(
      '#title'         => $label,
      '#type'          => 'select',
      '#options'       => $options,
      '#default_value' => @isset($workflow->options['transitions_extra'][$key]) ? $workflow->options['transitions_extra'][$key] : NULL
    );
  }

  $form['actions'] = array(
    '#type'   => 'actions',
    'actions' => [
      'submit' => ['#type' => 'submit', '#value' => t('Submit')]
    ]
  );

  return $form;
}

/**
 * Implement hook_form_submit().
 *
 * Save transitions extra value to workflow option.
 */
function workflow_transition_extra_form_submit($form, $form_state) {
  if (!empty(array_values($form_state['values']['transitions']))) {
    $form_state['workflow']->options['transitions_extra'] = $form_state['values']['transitions'];
    entity_save('workflow', $form_state['workflow']);
  }
}
