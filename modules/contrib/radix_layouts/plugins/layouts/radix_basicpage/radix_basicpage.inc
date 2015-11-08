<?php
// Plugin definition
$plugin = array(
  'title' => t('Excelpoint Basic page'),
  'icon' => 'radix-basicpage.png',
  'category' => t('Radix'),
  'theme' => 'radix_basicpage',
  'regions' => array(
	'header' => t('Header'),
	'column1' => t('First 8%'),
    'column2' => t('Second 74%'),	
    'column3' => t('Thirth 8% '),    
    'footer' => t('Footer'),    
  ),
);
