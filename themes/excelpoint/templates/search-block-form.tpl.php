<div class="container">
  <div class="col-lg-11 col-md-11 col-sm-11 col-xs-10">
    <?php if (empty($variables['form']['#block']->subject)): ?>
    <h2 class="element-invisible"><?php print t('Search form'); ?></h2>
    <?php endif; ?>
    <?php print $search_form; ?>
    <div class="clear"></div>
  </div>
  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2">
    <a class="search-close" href="#"><span class="glyphicon glyphicon-remove"></span></a>
  </div>
</div> 