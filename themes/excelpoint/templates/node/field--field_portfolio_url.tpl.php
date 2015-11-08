<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php if (!$label_hidden): ?>
    <div class="field-label"<?php print $title_attributes; ?>><?php print $label ?>:&nbsp;</div>
  <?php endif; ?>
  <div class="field-items"<?php print $content_attributes; ?>>
    <?php foreach ($items as $delta => $item): ?>
    <a href="<?php print render($item); ?>" class="dexp-shortcodes-button btn line-color btn-link"><?php print t('Launch Project');?> <i class="fa fa-arrow-right"></i></a>
    <?php endforeach; ?>
  </div>
</div>