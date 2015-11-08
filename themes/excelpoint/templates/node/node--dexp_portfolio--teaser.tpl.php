<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> dexp-animate clearfix"<?php print $attributes; ?> data-animate="bounceIn">
  <div class="content"<?php print $content_attributes; ?>>
    <?php
// We hide the comments and links now so that we can render them later.
    hide($content['comments']);
    hide($content['links']);    
    ?>
    <div class="portfolio-image">
      <?php print render($content['field_portfolio_images'][0]); ?>
      <div class="mediaholder"></div>
      <div class="portfolio-image-zoom">
        <a href="<?php print $node_url;?>"><span class="fa fa-link"></span></a>
      </div>
    </div>
  </div>
</div> 