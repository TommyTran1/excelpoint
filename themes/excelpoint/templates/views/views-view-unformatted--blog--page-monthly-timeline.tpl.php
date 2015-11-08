<div id ="tline-content">
  <div class="tline-topdate"><?php print $title;?></div>
  <?php
  $count = 1;
  foreach ($rows as $id => $row):?>
    <article class="post tline-box <?php if ($count % 2 == 0) print 'rgtline';?>">
      <span class="<?php if ($count % 2 == 1) print 'tline-row-l'; else print 'tline-row-r';?>"></span>
      <?php print views_embed_view('blog', 'block_timeline', intval(strip_tags($row))); ?>
    </article>
  <?php $count++;endforeach;?>
</div>

