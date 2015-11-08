<?php
  $backgrounds = array('bg1','bg2','bg3','bg4','bg5','bg6','bg7','bg8','bg9','bg10','bg11','bg12','bg13','bg14');
?>
<span class="quicksettings_toggle"></span>
<div class="dexp_settings">
  <h3>Layout Style</h3>
  <select class="dexp_layout form-select" name="setting_layout">
    <option value="wide">Wide</option>
    <option value="boxed">Boxed</option>
  </select>
  <h3>Header</h3>
  <select class="dexp_header form-select" name="setting_header">
    <option value="">Header 1</option>
    <option value="light">Header 2</option>
    <option value="color">Header 3</option>
  </select>
  <h3>Direction</h3>
  <select class="dexp_direction form-select" name="setting_direction">
    <option value="ltr">LTR</option>
    <option value="rtl">RTL</option>
  </select>
  <h3>Predefined Colors</h3>
  <ul class="presets">
    <?php foreach ($presets as $k => $preset): ?>
      <li><?php print l('<span style="background-color:' . $preset->link_color . '"></span>', 'drupalexp/preset/' . ($k + 1), array('html' => true)); ?></li>
    <?php endforeach; ?>
  </ul>
  <h3>Background</h3>
  <ul class="dexp_background">
    <?php foreach ($backgrounds as $background): ?>
      <li><span class="<?php print $background;?>"></span></li>
    <?php endforeach; ?>
  </ul>
  <div class="clearfix"></div>
</div>
<script type="text/javascript">
  jQuery(document).ready(function($){
    $('.quicksettings_toggle').click(function(){
      $('#block-dexp-quicksettings-dexp-quicksettings').toggleClass('open');
    })
    $('select.dexp_layout').change(function(){
      $('body').removeClass('boxed wide').addClass($(this).val());
      $(window).trigger('resize');
    });
    $('select.dexp_direction').change(function(){
      $('body').removeClass('ltr rtl').addClass($(this).val());
    });
    $('select.dexp_header').change(function(){
      $('#section-top-bar').removeClass('color light').addClass($(this).val());
    });
    $('ul.dexp_background span').click(function(){
      if($('select.dexp_layout').val()=='wide'){
        alert('Please select boxed layout');
        return;
      }
      $('body').removeClass('bg1 bg2 bg3 bg4 bg5 bg6 bg7 bg8 bg9 bg10 bg11 bg12 bg13 bg14').addClass($(this).attr('class'));
    })
  })
</script>