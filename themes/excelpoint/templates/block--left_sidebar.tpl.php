<div id="<?php print $block_html_id; ?>" class="<?php print $classes; ?>"<?php print $attributes; ?>>
<?php print render($title_prefix); ?>
<?php if ($block->subject): ?>
  <h3 class='headline'>
    <?php print $block->subject ?>
  </h3>
  <span class="brd-headling"></span>
<?php endif;?>
<?php print render($title_suffix); ?>

<div class='clearfix'>&nbsp;</div>
<div class="content"<?php print $content_attributes; ?>>
  <?php print $content ?>
</div>
</div>