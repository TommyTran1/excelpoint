/** @jsx React.DOM */
'use strict';

var _        = require("underscore");
var React       = require('../../lib/react-with-addons');
var PagerItem = require("./PagerItem");


var PagerList = React.createClass({
  render: function() {
    if (this.props.pageNum <= this.props.pageRangeDisplayed) {
      items = _.range(1, this.props.pageNum + 1).map(function(page, index) {
        var key = 'pagerItem' + index;
        var cssClass = '';
        if (this.props.selected === index) {
          cssClass = 'selected';
        }
        return (
          <li key={key} className={cssClass}>
            <PagerItem
              onClick={this.props.onPageSelected.bind(null, index)}
              selected={this.props.selected === index} >
              {page}
            </PagerItem>
          </li>
        )
      }.bind(this));
    } else {
      var leftSide = (this.props.pageRangeDisplayed / 2),
          rightSide = (this.props.pageRangeDisplayed - leftSide);

      if (this.props.selected > this.props.pageNum - this.props.pageRangeDisplayed / 2) {
        rightSide = this.props.pageNum - this.props.selected;
        leftSide = this.props.pageRangeDisplayed - rightSide;
      }
      else if (this.props.selected < this.props.pageRangeDisplayed / 2) {
        leftSide = this.props.selected;
        rightSide = this.props.pageRangeDisplayed - leftSide;
      }

      var items = [],
          index = 1;

      for (index = 1; index < this.props.pageNum + 1; index++) {
        var key = 'pagerItem' + index;
        var cssClass = '';
        if (this.props.selected === index) {
          cssClass = 'selected';
        }
        var pageView = (
          <li key={key} className={cssClass}>
            <PagerItem
              onClick={this.props.onPageSelected.bind(null, index)}
              selected={this.props.selected === index} >
              {index}
            </PagerItem>
           </li>
        );

        if (index <= this.props.marginPagesDisplayed) {
          items.push(pageView);
          continue;
        }
        if (index > this.props.pageNum - this.props.marginPagesDisplayed) {
          items.push(pageView);
          continue;
        }
        if ((index >= this.props.selected - leftSide) && (index <= this.props.selected + rightSide)) {
          items.push(pageView);
          continue;
        }
        if (items[items.length-1] !== this.props.breakLabel) {
          items.push(this.props.breakLabel);
        }
      }
    }

    return (
      <ul className="pages">
        {items}
      </ul>
    );
  }
});

module.exports = PagerList;
