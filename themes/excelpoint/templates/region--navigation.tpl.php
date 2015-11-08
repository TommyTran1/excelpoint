<?php
if ($content):
  $search_block = false;
  $blocks = block_get_blocks_by_region('top');
  if ($blocks) {
    foreach ($blocks as $key => $block) {
      if ($key == 'search_form') {
        $search_block = true;
      }
    }
  }
  ?>
  <?php if ($search_block): ?>
    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 pull-right right search-toggle-bar">
      <a href="#" class="search-toggle"><span class="fa fa-search"></span></a>
    </div>
    <?php endif; ?>
  <div class="<?php print $classes; ?>">
  <?php print $content; ?>
  </div>
<?php endif; ?>