/**Global availables
 *$settings:
 *$slides:
 *$layers:
 *$currentSlide:
 *$currentLayer:
 **/
if($slides == null) $slides = new Array();
if($settings == null) $settings = {};
var defaultSettings = {
  delay: 9000,
  startheight: 400,
  startwidth: 960,
  fullWidth: 'on',
  fullScreen:'off',
  navigationType:'bullet',
  navigationArrows:'verticalcentered',
  navigationHAlign:'center',
  navigationVAlign:'bottom',
  navigationStyle: 'square',
	timer: 'bottom'
};
var defaultSlide = {
  title: '',
  data_masterspeed: 500,
  layers: [],
  removed: 0
};
var defaultLayer = {
  index:10,
  title: '',
  type: 'text',
  text: 'New Text Layer',
  image: '',
  fid:'',
  video: '',
  top: 0,
  left: 0,
  data_speed: 500,
  incomingclasses: 'randomrotate',
  outgoingclasses: '',
  data_start: 1000,
  data_end: 0,
  data_easing: 'easeOutExpo',
  data_endeasing: '',
  removed: 0,
  video_width: 600,
  video_height: 400,
  width: 200,
  height: 100,
  custom_css:''
}
var $firsttime = true;
var $contenttypes = {
  text: 0,
  image: 1,
  video: 2
};
//var $captionclasses = "big_white big_white_right big_black_right big_white_center big_orange big_black big_blackright medium_grey small_text small_text_right small_text_rightblack medium_text medium_textright medium_blacktextright medium_textcenter large_text very_large_text very_big_white very_big_black boxshadow black noshadow btn-default";
(function ($) {
  $(document).ready(function () {
    if ($slides.length == 0) {
      $('#dexp_layerslider_main').hide(0);
    }
    $($slides).each(function (slideIndex) {
      addSlideTab(slideIndex);
      loadSlide(0);
    })
    $('#slideslist').sortable({
      update: function (event, ui) {
        $('#slideslist').find('li').each(function (index) {
          var sindex = $(this).attr('index');
          $slides[sindex].index = index;
        })
      }
    });
    $('#addslide').click(function () {
      addSlide();
      return false;
    })
    $('#addLayer').click(function () {
      addLayer();
      return false;
    })
    $('#save').click(function () {
      saveLayerSlider(false);
    })
    $('#save2').click(function () {
      saveLayerSlider(true);
    })
    $('select[name=text_style]').change(function () {
      $('.layer[id=' + $currentSlide + '-' + $currentLayer + ']').removeClass($captionclasses).addClass($(this).val());
    });
    $('#content-type').find('#layer-text').keyup(function () {
      $slides[$currentSlide].layers[$currentLayer].text = $(this).val();
      $('#' + $currentSlide + '-' + $currentLayer).find('.inner').html($(this).val());
    })
    /**Custom css*/
    $('[name=custom_css]').keyup(function(){
      $slides[$currentSlide].layers[$currentLayer].custom_css = $(this).val();
      $('#' + $currentSlide + '-' + $currentLayer).find('.inner').attr('style',$(this).val());
    });
    /*Global setiings*/
    $settings = $.extend(defaultSettings, $settings);
    $('input.global-settings, select.global-settings').each(function (index) {
      $(this).val($settings[$(this).attr('name')]);
    });
    $('#slidedesign, #preview').width($settings.startwidth).height($settings.startheight);
    $('#enter-preview').click(function () {
      saveSlide();
      saveLayer();
      saveGlobalSettings();
      var datasettings = base64Encode(JSON.stringify($settings));
      var dataslides = base64Encode(JSON.stringify($slides));
      var data = {
        sid: jQuery('input[name=sid]').val(),
        data: dataslides,
        settings: datasettings
      };
      //$('#save').val('Saving...');
      $.ajax({
        url: Drupal.settings.basePath + 'admin/dexp_layerslider/preview',
        type: 'POST',
        data: data,
        //dataType: 'json',
        success: function (data) {
          $('#slidedesign').slideUp(500);
          $('#preview').slideDown(500, function () {
            $('#preview').html(data);
          });
          $('#enter-preview').hide();
          $('#exit-preview').show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          alert(textStatus + ":" + jqXHR.responseText);
        }
      });
      return;
    //
    })
    $('#exit-preview').click(function () {
      $('#slidedesign').slideDown(500);
      $('#preview').slideUp(500, function () {
        $('#preview').find('iframe').attr('src', '');
      });
      $(this).hide();
      $('#enter-preview').show();
    });
    $('input[name=left]').change(function () {
      var left = $(this).val(),
      layer = $('#' + $currentSlide + '-' + $currentLayer);
      if(left=='left') left=0;
      else if(left =='center'){
        left = ($('#slidedesign').width()-layer.width())/2;
      }else if(left=='right'){
        left = $('#slidedesign').width()-layer.width();
      }
      $('#' + $currentSlide + '-' + $currentLayer).css({
        left: left + 'px'
      });
    });
    $('input[name=top]').change(function () {
      $('#' + $currentSlide + '-' + $currentLayer).css({
        top: $(this).val() + 'px'
      });
    });
    $('input[name=width]').change(function () {
      $('#' + $currentSlide + '-' + $currentLayer).css({
        width: $(this).val() + 'px'
      });
    });
    $('input[name=height]').change(function () {
      $('#' + $currentSlide + '-' + $currentLayer).css({
        height: $(this).val() + 'px'
      });
    });
  })
  /*Slide functions*/
  function addSlideTab(slideIndex) {
    var slideTab = $('<li>').attr('index', slideIndex);
    var slideTabTitle = '';
    if ($slides[slideIndex].title == '') {
      slideTabTitle = $('<span>').text('Slide #' + (slideIndex + 1));
    } else {
      slideTabTitle = $('<span>').text($slides[slideIndex].title || 'Slide title');
    }
    slideTabTitle.click(function () {
      if ($(this).hasClass('active')) return;
      saveLayer();
      saveSlide();
      loadSlide(slideIndex);
    })
    var slideTabRemove = $('<span>').text('').addClass('remove-slide fa fa-times-circle');
    slideTabRemove.click(function () {
      removeSlide(slideIndex);
    })
    slideTab.append(slideTabTitle).append(slideTabRemove);
    $('#slideslist').append(slideTab);
  }

  function addSlide() {
    saveLayer();
    saveSlide();
    var newSlideIndex = $slides.length;
    $slides[newSlideIndex] = {};
    $.extend(true, $slides[newSlideIndex], defaultSlide);
    $slides[newSlideIndex].index = newSlideIndex;
    addSlideTab(newSlideIndex);
    loadSlide(newSlideIndex);
    $('#dexp_layerslider_main').show(0);
  }

  function loadSlide(slideIndex) {
    $currentSlide = slideIndex;
    $('ul#slideslist').find('li').removeClass('active');
    $('ul#slideslist').find('li[index=' + slideIndex + ']').addClass('active');

    if ($slides[slideIndex].background_image != '') {
      $('#slidedesign').css({
        backgroundImage: 'url(' + $slides[slideIndex].background_image + ')'
      })
    } else {
      $('#slidedesign').css({
        backgroundImage: 'none'
      })
    }
    jQuery('.slide-option').each(function (index) {
      if (typeof $slides[slideIndex][jQuery(this).attr('name')] != "undefined") {
        jQuery(this).val($slides[slideIndex][jQuery(this).attr('name')]);
      } else {
        jQuery(this).val('');
      }
    });
    /**/
    loadLayers(slideIndex);
  }

  function saveSlide() {
    if ($slides.length == 0) return;
    jQuery('.slide-option').each(function (index) {
      $slides[$currentSlide][jQuery(this).attr('name')] = $(this).val();
    });
    $slides[$currentSlide].layers.sort(DexpCompare);        
  }

  function removeSlide(slideIndex) {
    $('ul#slideslist').find('li[index=' + slideIndex + ']').remove();
    $slides[slideIndex]['removed'] = 1;
    loadSlide(0);
  }

  /*Layer functions*/
  function loadLayers(slideIndex) {
    $('#slidedesign').find('div').remove();
    $currentSlide = slideIndex;
    /*Remove all layer tabs*/
    $('#layerslist').find('li').remove();
    /*Load new layer tabs*/
    if (typeof $slides[$currentSlide].layers == 'undefined') {
      $slides[$currentSlide].layers = new Array();
    }
    $($slides[$currentSlide].layers).each(function (layerIndex) {
      if($slides[$currentSlide].layers[layerIndex].removed != 1){
        addLayerTab(layerIndex);
      }
    })
    /*Reset layer option value*/
    $('.layer-option').val('');
    if (typeof $slides[$currentSlide].layers[0] != 'undefined') {
      loadLayer(0);
    }
  }

  function addLayerTab(layerIndex) {
    var layertype = $slides[$currentSlide].layers[layerIndex].type;
    var layerTab = $('<li>').attr('index', layerIndex).addClass(layertype);
		$slides[$currentSlide].layers[layerIndex].title = $slides[$currentSlide].layers[layerIndex].title||'Layer #' + (layerIndex + 1);
		//var layerTitle = $slides[$currentSlide].layers[layerIndex].title'Layer #' + (layerIndex + 1)
    var layerTabTitle = $('<span>').text($slides[$currentSlide].layers[layerIndex].title.substring(0,15));
    var layerTabRemove = $('<span>').text('').addClass('remove-layer fa fa-times-circle');
    var layerTabDuplicate = $('<span>').attr('title', 'Duplicate this layer').text('').addClass('fa fa-copy');
    var layerTabMove = $('<span>').text('').addClass('move fa fa-arrows-v');
    layerTabTitle.click(function () {
      saveLayer();
      loadLayer(layerIndex);
    })
    layerTabDuplicate.click(function () {
      saveLayer();
      duplicateLayer(layerIndex);
    })
    layerTabRemove.click(function () {
      removeLayer(layerIndex);
    })
    layerTab.append(layerTabTitle);
    layerTab.append(layerTabRemove);
    layerTab.append(layerTabDuplicate);
    layerTab.append(layerTabMove);
    $('ul#layerslist').append(layerTab);
    var newLayerDesign = $('<div>').addClass('layer tp-caption').attr('id', $currentSlide + '-' + layerIndex);
    newLayerDesign.addClass('caption');
    if (typeof $slides[$currentSlide].layers[layerIndex].text_style == 'undefined') {
      $slides[$currentSlide].layers[layerIndex].text_style = 'text';
    }
    if ($slides[$currentSlide].layers[layerIndex].type == 'text') {
      newLayerDesign.addClass($slides[$currentSlide].layers[layerIndex].text_style);
    }
    var content = '';
    switch ($slides[$currentSlide].layers[layerIndex].type) {
      case 'image':
        content = '<img src="' + $slides[$currentSlide].layers[layerIndex].image + '"/>';
        var img = new Image();
        img.onload = function() {
          newLayerDesign.width($slides[$currentSlide].layers[layerIndex].width || this.width);
          newLayerDesign.height($slides[$currentSlide].layers[layerIndex].height || this.height);
        }
        img.src = $slides[$currentSlide].layers[layerIndex].image;
        break;
      case 'video':
        content = '<img width="' + $slides[$currentSlide].layers[layerIndex].width + '" height="' + $slides[$currentSlide].layers[layerIndex].height + '" src="' + Drupal.settings.basePath + 'sites/all/modules/dexp_layerslider/images/video.jpg"/>';
        break;
      case 'text':
        content = $slides[$currentSlide].layers[layerIndex].text;
    }
    var inner = $('<div>').addClass('inner');
    if($slides[$currentSlide].layers[layerIndex].custom_css){
      inner.attr('style',$slides[$currentSlide].layers[layerIndex].custom_css);
    }
    inner.html(content);
    newLayerDesign.append(inner);
    var zIndex = 99 - $slides[$currentSlide].layers[layerIndex].index;
    newLayerDesign.mousedown(function () {
      saveLayer();
      loadLayer(layerIndex);
    }).draggable({
      //containment: "parent",
      drag: function (event, ui) {
        $('input[name=left]').val(ui.position.left);
        $('input[name=top]').val(ui.position.top);
        setLayerPosition(layerIndex, ui.position.top, ui.position.left);
      },
      grid: [5, 5]
    }).resizable({
      aspectRatio: $slides[$currentSlide].layers[layerIndex].type=='image',
      containment: "parent",
      resize: function (event, ui) {
        $('input[name=width]').val(ui.size.width);
        $('input[name=height]').val(ui.size.height);
      }
    });
    $('#slidedesign').append(newLayerDesign);
    var left = $slides[$currentSlide].layers[layerIndex].left;
    var right = null;
    if(left=='left') left = 0;
    if(left=='right') left = $('#slidedesign').width()-newLayerDesign.width();
    if(left=='center') left = ($('#slidedesign').width()-newLayerDesign.width())/2;
    newLayerDesign.css({
      top: $slides[$currentSlide].layers[layerIndex].top + 'px',
      left: left + 'px',
      zIndex: zIndex
    });
    $('#layeroptions').show(0);
    try{
      $('#layerslist').sortable('destroy');
    }catch(e){}
		$('#layerslist').sortable({
				handle: '.move',
				update: function (event, ui) {
						$('#layerslist').find('li').each(function (index) {
								var lindex = $(this).attr('index');
								$slides[$currentSlide].layers[lindex].index = index;
								//$(this).find('.remove-layer').text(index);
								$('#'+$currentSlide+'-'+lindex).css({zIndex:(99-index)});
								saveLayer();
						});
						$slides[$currentSlide].layers.sort(DexpCompare);
						//saveLayer();
						saveSlide();
						loadSlide($currentSlide);
				}
		});
  }

  function addLayer() {
    /*Save current layer*/
    saveLayer();
    /*Init new layer*/
    var newLayerIndex = $slides[$currentSlide].layers.length;
    $slides[$currentSlide].layers[newLayerIndex] = {};
    $.extend(true, $slides[$currentSlide].layers[newLayerIndex], defaultLayer);
    addLayerTab(newLayerIndex);
    loadLayer(newLayerIndex);
  }

  function duplicateLayer(layerIndex) {
    /*Save current layer*/
    saveLayer();
    /*Init new layer*/
    var newLayerIndex = $slides[$currentSlide].layers.length;
    $slides[$currentSlide].layers[newLayerIndex] = {};
    $.extend(true, $slides[$currentSlide].layers[newLayerIndex], $slides[$currentSlide].layers[layerIndex]);
    addLayerTab(newLayerIndex);
    loadLayer(newLayerIndex);
  }

  function loadLayer(layerIndex) {
    $currentLayer = layerIndex;
    $('.layer').removeClass('selected');
    $('#' + $currentSlide + '-' + layerIndex).addClass('selected');
    $('ul#layerslist').find('li').removeClass('active');
    $('ul#layerslist').find('li[index=' + layerIndex + ']').addClass('active');
    /*Bind layer data*/
    $('.layer-option').each(function (index) {
      if (typeof $slides[$currentSlide]['layers'][layerIndex][$(this).attr('name')] != 'undefined') {
        $(this).val($slides[$currentSlide]['layers'][layerIndex][$(this).attr('name')]);
      } else {
        $(this).val('');
      }
    });
		$("#content-type").tabs({
      selected: $contenttypes[$slides[$currentSlide].layers[layerIndex].type],
      active: $contenttypes[$slides[$currentSlide].layers[layerIndex].type],
      select: function (event, ui) {
        var type = $(ui.tab).parent().data('type');
        var panel = $(ui.panel);
        $slides[$currentSlide].layers[$currentLayer].type = type;
        $('ul#layerslist li.active').removeClass('video image text').addClass(type);
        if (type == 'image') {
          $('#' + $currentSlide + '-' + $currentLayer).removeClass($captionclasses);
          var op = $('#' + $currentSlide + '-' + $currentLayer).resizable( "option");
          $('#' + $currentSlide + '-' + $currentLayer).resizable( "destroy");
          op.aspectRatio = true;
          $('#' + $currentSlide + '-' + $currentLayer).resizable(op);
          panel.find('input').trigger('onchange');
        } else if (type == 'text') {
          panel.find('textarea[id=layer-text]').trigger('keyup');
          var op2 = $('#' + $currentSlide + '-' + $currentLayer).resizable( "option");
          $('#' + $currentSlide + '-' + $currentLayer).resizable( "destroy");
          op2.aspectRatio = false;
          $('#' + $currentSlide + '-' + $currentLayer).resizable(op2);
        } else if (type == 'video') {
          var op3 = $('#' + $currentSlide + '-' + $currentLayer).resizable( "option");
          $('#' + $currentSlide + '-' + $currentLayer).resizable( "destroy");
          op3.aspectRatio = false;
          $('#' + $currentSlide + '-' + $currentLayer).resizable(op3);
          $('#' + $currentSlide + '-' + $currentLayer).removeClass($captionclasses);
          var videothumbnail = $('<img>').attr({
            src: Drupal.settings.basePath + 'sites/all/modules/dexp_layerslider/images/video.jpg',
            width: $('input[name=video_width]').val(),
            height: $('input[name=video_height]').val()
          })
          $('#' + $currentSlide + '-' + $currentLayer).find('.inner').html(videothumbnail);
        }
      },
      activate: function(event, ui){
        var type = $(ui.newTab[0]).data('type');
        
        var panel = $(ui.newPanel[0]);
        $slides[$currentSlide].layers[$currentLayer].type = type;
        $('ul#layerslist li.active').removeClass('video image text').addClass(type);
        if (type == 'image') {
          $('#' + $currentSlide + '-' + $currentLayer).removeClass($captionclasses);
          var op = $('#' + $currentSlide + '-' + $currentLayer).resizable( "option");
          $('#' + $currentSlide + '-' + $currentLayer).resizable( "destroy");
          op.aspectRatio = true;
          $('#' + $currentSlide + '-' + $currentLayer).resizable(op);
          panel.find('input').trigger('onchange');
        } else if (type == 'text') {
          panel.find('textarea[id=layer-text]').trigger('keyup');
          var op2 = $('#' + $currentSlide + '-' + $currentLayer).resizable( "option");
          $('#' + $currentSlide + '-' + $currentLayer).resizable( "destroy");
          op2.aspectRatio = false;
          $('#' + $currentSlide + '-' + $currentLayer).resizable(op2);
        } else if (type == 'video') {
          var op3 = $('#' + $currentSlide + '-' + $currentLayer).resizable( "option");
          $('#' + $currentSlide + '-' + $currentLayer).resizable( "destroy");
          op3.aspectRatio = false;
          $('#' + $currentSlide + '-' + $currentLayer).resizable(op3);
          $('#' + $currentSlide + '-' + $currentLayer).removeClass($captionclasses);
          var videothumbnail = $('<img>').attr({
            src: Drupal.settings.basePath + 'sites/all/modules/dexp_layerslider/images/video.jpg',
            width: $('input[name=video_width]').val(),
            height: $('input[name=video_height]').val()
          })
          $('#' + $currentSlide + '-' + $currentLayer).find('.inner').html(videothumbnail);
        }
      }
    });
  }

  function setLayerPosition($layerIndex, top, left) {
    $slides[$currentSlide].layers[$layerIndex].top = top;
    $slides[$currentSlide].layers[$layerIndex].left = left;
  }

  function saveLayer() {
    if ($slides.length == 0) {
      return;
    }
    if ($slides[$currentSlide].layers.length == 0) {
      return;
    }
    $('.layer-option').each(function (index) {
      $slides[$currentSlide].layers[$currentLayer][$(this).attr('name')] = $(this).val();
    })
  }

  function removeLayer(layerIndex) {
    $('#' + $currentSlide + '-' + layerIndex).remove();
    $slides[$currentSlide].layers[layerIndex]['removed'] = 1;
    $('ul#layerslist').find('li[index=' + layerIndex + ']').remove();
    if (layerIndex == $currentLayer) {
			if($('ul#layerslist li').length > 0){
				var firstIndex = parseInt($('ul#layerslist').find('li:first').attr('index'));
				loadLayer(firstIndex);
			}
    }
  }

  function saveGlobalSettings() {
    $('input.global-settings, select.global-settings').each(function (index) {
      $settings[$(this).attr('name')] = $(this).val();
    })
  }

  function saveLayerSlider(ajax) {
    saveSlide();
    saveLayer();
    saveGlobalSettings();
    $slides.sort(DexpCompare);
    var $slides2 = [];
    var $sindex = 0;
    $.each($slides, function (index, slide) {
      if(slide.removed == 0){
        var layers = [];
				slide.layers.sort(DexpCompare);
        $.each(slide.layers,function(index, layer){
          if(layer.removed == 0){
            layers[layers.length] = layer;
          }
        });
        slide.layers = layers;
        $slides2[$slides2.length] = slide;
      }
    })
    var datasettings = base64Encode(JSON.stringify($settings));
    var dataslides = base64Encode(JSON.stringify($slides2));
    var data = {
      sid: jQuery('input[name=sid]').val(),
      data: dataslides,
      settings: datasettings
    };
    $('#save').val('Saving...');
    $.ajax({
      url: Drupal.settings.basePath + '?q=admin/dexp_layerslider/save',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (data) {
        $('#save').val('Save');
        if(!ajax){
          window.location = destination;
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ":" + jqXHR.responseText);
      }
    });
  }
})(jQuery);