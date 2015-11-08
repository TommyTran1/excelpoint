<?php

/**
 * Preprocess function to build the dexp views portfolio
 * template_preprocess_dexp_portfolio
 */
function template_preprocess_views_dexp_portfolio(&$vars) {
  //template_preprocess_views_dexp_grid($vars);
  $view = $vars['view'];
  $options = $view->style_plugin->options;
  $vars['options'] = $options;
  $vars['view_id'] = drupal_html_class($view->name.'-'.$view->current_display);//drupal_html_id('page_dexp_portfolio');
  $vars['filter_id'] = drupal_html_id('dexp_portfolio_filter');
  if ($options['dexp_portfolio_filter']) {
    $vocab = $options['dexp_portfolio_filter_vocabulary'];
    $categories = array();
    $taxonomies = taxonomy_get_tree($vocab);
    foreach ($taxonomies as $tax) {
      if ($tax->parents[0] == 0) {
        $key = _dexp_portfolio_safe_class($tax->name);
        $categories[$key] = $tax->name;
      }
    }
    $vars['categories'] = $categories;
    $js = array(
      'dexp_portfolio' => array(
        $vars['filter_id'] => $vars['view_id'],
      )
    );
    drupal_add_js($js,'setting');
    drupal_add_js(drupal_get_path('module', 'dexp_portfolio') . '/js/jquery.shuffle.js');
    drupal_add_js(drupal_get_path('module', 'dexp_portfolio') . '/js/filter.js');
  }
  drupal_add_css(drupal_get_path('module', 'dexp_portfolio') . '/css/portfolio.css');
}