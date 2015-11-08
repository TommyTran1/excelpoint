<div id="node-<?php print $node->nid; ?>" style="margin-bottom: 0" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <div class="content"<?php print $content_attributes; ?>>
    <?php
// We hide the comments and links now so that we can render them later.
    hide($content['comments']);
    hide($content['links']);    
    ?>
    <div class="portfolio-image">
      <?php print render($content['field_portfolio_images'][0]); ?>
      <div class="mediaholder"></div>
      <div class="portfolio-title">
        <a href="<?php print $node_url;?>"><span><?php print $title;?></span></a>
      </div>
    </div>
  </div>
</div> 