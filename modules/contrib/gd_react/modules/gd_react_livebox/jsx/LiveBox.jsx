(function($)
{
  $(function()
  {

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    var debug = true;
    var dbg = function(m)
    {
      if(!debug) return;
      console.log(m);
    };

    
    var LiveBox = React.createClass({
      getInitialState: function() {
        return {data: []};
      },
      getElements: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      componentDidMount: function() {
        this.getElements();
        setInterval(this.getElements, this.props.pollInterval);
      },
      render: function() {
        return (
          <div className="live-wrapper">
            <h1>{this.props.title}</h1>
            <LiveList data={this.state.data} />
          </div>
        );
      }
    });
    
    
    var LiveList = React.createClass({
      render: function() {
        var items = this.props.data.map(function (item, i) {
          return (
            <LiveItem key={item.id} url={item.url} title={item.title}>
              {item.body}
            </LiveItem>
          );
        });
        
        return (
          <div className="live-list">
            <ReactCSSTransitionGroup transitionName="live-transition">
              {items}
            </ReactCSSTransitionGroup>
          </div> 
        );
      }
    });
    
    var LiveItem = React.createClass({
      render: function() {
        var body = this.props.children;

        return (
          <div className="live-item">
            
            <h2><a href={this.props.url}>{this.props.title}</a></h2>
            
            <span dangerouslySetInnerHTML={{__html: body}} />
          </div>
        );
      }
    });
    
    $('gd-livebox').each(function()
    {
      var e = $(this);
/*
      var entityType     = e.data('entity-type')     || 'node',
          entityBundle   = e.data('entity-bundle')   || 'article',
          limit          = e.data('entity-limit')    || '50',
          orderField     = e.data('order-field')     || 'created',
          orderDirection = e.data('order-direction') || 'DESC';

      dbg('entityType     : ' + entityType);
      dbg('entityBundle   : ' + entityBundle);
      dbg('limit          : ' + limit);
      dbg('orderField     : ' + orderField);
      dbg('orderDirection : ' + orderDirection);
*/
      
      var id             = e.data('id'),
          pollInterval   = e.data('poll-interval')   || '2000',
          title          = e.data('title')           || 'Livebox';

      dbg('id           : ' + id);
      dbg('pollInterval : ' + pollInterval);
      dbg('title        : ' + title);

      if(!id)
      {
        dbg('You must set a component id');
        return;
      }

      var basePath = Drupal.settings.basePath;
      var url = basePath + 'js/react/get/'+id+'/entities.json';

      React.render(
        <LiveBox title={title} url={url} pollInterval={pollInterval} />,
        e[0]
      );
    });




  });
})(jQuery);
