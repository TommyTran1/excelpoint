<?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
<?php endif; ?>

<?php if($options['dexp_portfolio_filter']):?>
  <?php if(isset($categories)):?>
  <div class="portfolio-filters">
		<ul id="<?php print $filter_id;?>" class="dexp-portfolio-filter clearfix" data-option-key="filter">
			<li><a class="active" href="#" data-filter="*"><?php print t('Show All')?></a></li>
			<?php foreach($categories as $key => $c): ?>
				<li>
					<a href="#" data-filter="<?php echo $key; ?>"><?php echo $c; ?></a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
  <?php endif;?>
<?php endif;?>
<div class="custompadding" data-padding="0">
<div id="<?php print $view_id;?>" class="dexp-grid-items row">
  <?php foreach($rows as $row):?>
    <?php print $row; ?>
  <?php endforeach;?>
</div>
</div>