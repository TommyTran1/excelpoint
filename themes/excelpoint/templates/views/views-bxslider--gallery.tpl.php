<div id="<?php print $view_id; ?>" class="dexp-bxslider-gallery">
	<?php for($i = 0; $i < count($rows); $i+=$sliderows):?>
		<div class="slide" id="gallery_item_<?php print $i;?>">
			<?php for($j=$i; $j<$i+$sliderows; $j++):?>
			<?php if($rows[$j]) print $rows[$j];?>
			<?php endfor;?>
		</div>
	<?php endfor;?>
</div>
<div class="gallery_thumbnails hidden-sm hidden-xs"></div>
<script type="text/javascript">
  jQuery(document).ready(function($){
    var $gallery = $('#<?php print $view_id; ?>'),galleryID = $gallery.attr('id');
    var gallert_options = Drupal.settings.dexpbxsliders[galleryID];
    gallert_options.slideWidth = $gallery.width();
    gallert_options.pagerSelector = '.gallery_thumbnails';
    gallert_options.nextText = '<span class="gallery-next"><span>';
    gallert_options.prevText = '<span class="gallery-prev"><span>';
    gallert_options.buildPager = function(slideIndex){
      var image = $('#gallery_item_'+slideIndex).find('img').attr('src');
      return '<div class="galary-thumnail" style="background:url('+image+')"></div>';
    };
    $gallery.bxSlider(gallert_options);
  })
</script>