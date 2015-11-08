<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
<div class="content"<?php print $content_attributes; ?>>
<?php
// We hide the comments and links now so that we can render them later.
hide($content['comments']);
hide($content['links']);
//print render($content);
?>
  <div class="row">
    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
      <div class="client-image">
        <?php print render($content['field_image']);?>
      </div>
    </div>
    <div class="col-lg-10 col-md-10 col-sm-9 col-xs-12">
      <div class="description"><i class="fa fa-angle-left hidden-xs"></i><?php print render($content['body']);?></div>
      <div class="client-author">
        <span class="client-name"><?php print render($content['field_client'][0]);?></span>, <strong><?php print render($content['field_job_title'][0]);?></strong>
      </div>
    </div>
  </div>
</div>
</div> 