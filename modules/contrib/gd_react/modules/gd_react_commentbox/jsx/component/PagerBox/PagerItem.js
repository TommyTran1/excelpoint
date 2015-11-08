/** @jsx React.DOM */
'use strict';

var React       = require('../../lib/react-with-addons');


var PagerItem = React.createClass({
  render: function() {
    return (
      <button {...this.props} href="">{this.props.children}</button>
    );
  }
});

module.exports = PagerItem;
