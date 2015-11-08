<?php $count = 0; $total = count($items);
  foreach ($items as $delta => $item) {
      $count++; 
      print render($item); 
      if ($count < $total) print ', ';
  }
?>
