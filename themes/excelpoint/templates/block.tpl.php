<div id="<?php print $block_html_id; ?>" class="<?php print $classes; ?>"<?php print $attributes; ?>>
<?php print render($title_prefix); ?>
<?php if ($block->subject): ?>
  
  <?php $has_sub_title = false; if (strpos($block->subject, '~')):?>
   <?php
        $has_sub_title = true;
        $title_array = explode('~', $block->subject);
        $main_title = $title_array[0];
        $sub_title = $title_array[1]; ?>
   <?php endif;?>
  <?php if(strpos($classes, "main-headline")):?>
    <?php if (!$has_sub_title):?> 
    <h3<?php print $title_attributes; ?>><?php print $block->subject ?></h3>
    <?php else:?>
      <h3<?php print $title_attributes; ?>><?php print $main_title ?></h3>
      <p class="sub-block-title"><?php print $sub_title;?></p>
   <?php endif;?>   
  <?php elseif (strpos($classes, "border-bottom-headline")):?>
    <?php if (!$has_sub_title):?>   
      <h3 class="headline"><?php print $block->subject ?></h3>
      <span class="brd-headling"></span>
      <div class="clearfix"></div>
    <?php else:?>
      <h3 class="headline"><?php print $main_title ?></h3>
      <span class="brd-headling"></span>
      <p class='sub-block-title'><?php print $sub_title;?></p>
    <?php endif;?>   
    <?php if ($has_sub_title) print $sub_title;?>
   <?php else: ?> 
      <?php if (!$has_sub_title):?>
        <h3<?php print $title_attributes; ?>><?php print $block->subject ?></h3>
      <?php else:?>
        <h3<?php print $title_attributes; ?>><?php print $main_title ?></h3>
        <p class="sub-block-title"><?php print $sub_title;?></p>
      <?php endif;?>     
   <?php endif;?>
      
<?php endif;?>
<?php print render($title_suffix); ?>
<div<?php print $content_attributes; ?>>
<?php print $content ?>

</div>
</div>