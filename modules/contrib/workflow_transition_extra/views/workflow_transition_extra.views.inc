<?php

/**
 * Implements hook_views_data_alter().
 */
function workflow_transition_extra_views_data_alter(&$data) {
  $data['node']['user_can_change_workflow']['title'] = 'Workflow: user can change workflow state';
  $data['node']['user_can_change_workflow']['help'] = 'Filter user can change workflow state.';
  $data['node']['user_can_change_workflow']['filter']['handler'] = 'workflow_transition_handler_filter_user_can_change_workflow';
}

/**
 * Implements hook_view_query_alter().
 * 
 * Since user of approver role do not have any connection with our views data,
 * we can't use any provided filters. This code will check user for `approver` role
 * and drop OR condition.
 */
function workflow_transition_extra_views_query_alter(&$view, &$query) {
  global $user;
  if ($view->name === 'pending' && in_array('approver', $user->roles)) {
    foreach ($query->where as $index => $where) {
      if ($where['type'] === 'OR') {
        unset($query->where[$index]);
      }
    }
  }
}