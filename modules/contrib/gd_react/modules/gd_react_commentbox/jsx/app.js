var React      = require('./lib/react-with-addons');
var CommentBox = require('./component/CommentBox/CommentBox');

(function ($, Drupal, window, document, undefined) {
  
  /**
   * gdCommentBox.
   */
  Drupal.behaviors.gdCommentBox = {
    attach: function(context, settings) {
      $('gd-commentbox', context).not('.js-processed').addClass('js-processed').each(function()
      {
        var e = $(this);

        var id           = e.data('id');
        var pollInterval = e.data('poll-interval') || '2000';
        
        var basePath = Drupal.settings.basePath + 'js/react/';
        var url      = basePath + 'get/' +id+'/comments.json';
        var postUrl  = basePath + 'post/'+id+'/comments.json';
        
        React.render(
          <CommentBox url={url} postUrl={postUrl} pollInterval={pollInterval} />,
          this
        );
      });
    }
  };
  
})(jQuery, Drupal, this, this.document);



