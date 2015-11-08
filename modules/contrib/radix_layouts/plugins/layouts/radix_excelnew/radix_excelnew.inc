<?php
// Plugin definition
$plugin = array(
  'title' => t('Excelpoint News'),
  'icon' => 'radix-excelpoint.png',
  'category' => t('Radix'),
  'theme' => 'radix_excelnew',
  'regions' => array(
	'column1' => t('First 25%'),
    'column2' => t('Second 75%'),
	'header' => t('Header'),
    'column3' => t('First Column'),
    'column4' => t('Second Column'),
    'footer' => t('Footer'),    
  ),
);
