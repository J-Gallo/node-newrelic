'use strict';

/**
 * CONTEXT
 *
 * This does very little right now except act as a shared state used
 * by all the tracers in effect to keep track of the current transaction
 * and trace segment. The exit call is VERY IMPORTANT, because it is
 * how the proxying methods in the tracer know whether or not a call
 * is part of a transaction / segment.
 *
 * The relevant code in the Tracer can be adapted to use domains instead
 * of Context very easily, which should make it easy to support both
 * 0.8 and earlier versions from most of the same code.
 */
function Context(debug) {
  // used to ensure that entries and exits remain paired
  if (debug) this.stack = [];
}

Context.prototype.enter = function (call) {
  if (this.stack) this.stack.push(call);

  this.call = call;
  this.segment = call.segment;
  this.transaction = call.segment.transaction;
};

Context.prototype.exit = function (call) {
  if (this.stack) {
    var top = this.stack.pop();
    if (top !== call) throw new Error("You must exit every context you enter.");
  }

  delete this.call;
  delete this.segment;
  delete this.transaction;
};

module.exports = Context;