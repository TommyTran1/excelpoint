/** @jsx React.DOM */
'use strict';

var React       = require('../../lib/react-with-addons');
var PagerList = require("./PagerList");


var PagerBox = React.createClass({
  propTypes: {
    pageNum: React.PropTypes.number.isRequired,
    pageRangeDisplayed: React.PropTypes.number.isRequired,
    marginPagesDisplayed: React.PropTypes.number.isRequired,
    previousLabel: React.PropTypes.renderable,
    nextLabel: React.PropTypes.renderable,
    breakLabel: React.PropTypes.renderable,
    clickCallback: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      pageNum: 10,
      pageRangeDisplayed: 2,
      marginPagesDisplayed: 1,
      previousLabel: "Previous",
      nextLabel: "Next",
      selected: 1,
      breakLabel: "..."
    };
  },
  handlePageSelected: function(index) {
   if (typeof(this.props.clickCallback) !== "undefined" && 
       typeof(this.props.clickCallback) === "function") {
        this.props.clickCallback({selected: index});
   }
  },
  handlePreviousPage: function(e) {
    if (this.props.selected > 1) {
      this.handlePageSelected(this.props.selected - 1);
    }
    e.preventDefault();
  },
  handleNextPage: function(e) {
    if (this.props.selected < this.props.pageNum) {
      this.handlePageSelected(this.props.selected + 1);
    }
    e.preventDefault();
  },
  render: function() {
    return (
      <ul className="pagination">
        <li className="previous">
          <button onClick={this.handlePreviousPage}>{this.props.previousLabel}</button>
        </li>

        <PagerList
          onPageSelected={this.handlePageSelected}
          selected={this.props.selected}
          pageNum={this.props.pageNum}
          pageRangeDisplayed={this.props.pageRangeDisplayed}
          marginPagesDisplayed={this.props.marginPagesDisplayed}
          breakLabel = {this.props.breakLabel} />

        <li className="next">
          <button onClick={this.handleNextPage}>{this.props.nextLabel}</button>
        </li>
      </ul>
    );
  }
});

module.exports = PagerBox;
