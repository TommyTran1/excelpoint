<div class="pie-graph">
  <canvas id="<?php print $element_id; ?>" class="percent_loader" width="<?php print $width; ?>" height="<?php print $width; ?>"></canvas>
  <h3><?php print $title;?></h3>
  <?php if ($content) :?>
    <?php print $content;?>
  <?php endif; ?>
</div>
<script type="text/javascript">
  jQuery(document).ready(function($){
    if(typeof dexp_shortcodes_piegraph != 'function'){
      var dexp_shortcodes_piegraph = function(idElement,percent,color,radius){
        var canvas = document.getElementById(idElement),
        context = canvas.getContext('2d'),
        x = canvas.width / 2,
        y = canvas.height / 2,
        fullPercent = 2 * Math.PI,
        startAngle = 1.5 * Math.PI,
        endAngle = ((percent / 100) * fullPercent) + startAngle,
        counterClockwise = false;
        context.lineWidth = 5;
        context.strokeStyle = 'rgba(255,255,255,0.5)';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(x, y, radius, startAngle, (fullPercent+startAngle), counterClockwise);
        context.stroke();
        context.fillStyle = "#ffffff";
        context.font = "17px 'raleway'";
        context.textAlign = 'center';
        context.textBaseline = "middle";
        context.fillText(percent+"%", radius+12, radius+12);
        context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        context.stroke();
      }
    }
    var color = '#FFF';
    var $piecanvas = $('#<?php print $element_id;?>');
    var radius=<?php print $width;?>/2;
    dexp_shortcodes_piegraph('<?php print $element_id;?>',<?php print $percent;?>,color,(radius-12));
  });
</script>