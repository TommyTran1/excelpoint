(function ($, Drupal, window, document, module) {

var DrupalMixin = {
  Drupal : {
    /**
     * Usage :
     *   var settings = this.Drupal.settings(); // Return all the Drupal.settings.
     *   var module_settings = this.Drupal.settings('my_module'); // Get settings of my module
     *   var module_settings_key = this.Drupal.settings('my_module', 'visible'); // Get settings visible of my_module.
     *   this.Drupal.settings('my_module', 'visible', FALSE); // Set settings visible of my_module to FALSE.
     *   this.Drupal.settings('my_module', null, {visible : TRUE}); // Set settings of my_module.
     */
    settings : function(module, key, value) {
      if (module && key && typeof value !== 'undefined') {
        Drupal.settings[module][key] = value;
        return;
      }
      else if (module && !key && typeof value !== 'undefined') {
        Drupal.settings[module] = value;
        return;
      }
      else if (module && key) {
        var module_settings = Drupal.settings[module] || [];
        return module_settings[key] || null;
      }
      else if(module) {
        return Drupal.settings[module] || null;
      }
      return Drupal.settings || null;
    },
    
    /**
     * Usage :
     *   var behaviors = this.Drupal.behaviors(); // return all behaviors.
     *   var my_behavior = this.Drupal.behaviors('my_behavior'); // return my_behavior.
     *   this.Drupal.behaviors('my_behavior', true); // execute attach() of my_behavior.
     *   this.Drupal.behaviors('my_behavior', false); // execute detach() of my_behavior.
     *   this.Drupal.behaviors(null, true); // execute attach() of all behaviors.
     *   this.Drupal.behaviors(null, false); // execute detach() of all behaviors.
     */
    behaviors: function(behavior, attach, context, trigger) {
      if (behavior && attach === true) {
        if (Drupal.behaviors[behavior] && typeof Drupal.behaviors[behavior]['attach'] === 'function') {
          context = context || document;
          // Execute the behavior.
          return Drupal.behaviors[behavior].attach(context, this.settings());
        }
      } 
      else if (!behavior && attach === true) {
        context = context || document;
        // Execute all behavior.
        return Drupal.attachBehaviors(context, this.settings());
      }
      else if (behavior && attach === false) {
        if (Drupal.behaviors[behavior] && typeof Drupal.behaviors[behavior]['detach'] === 'function') {
          context = context || document;
          trigger = trigger || 'unload';
          // Execute the behavior.
          return Drupal.behaviors[behavior].detach(context, this.settings(), trigger);
        }
      } 
      else if (!behavior && attach === false) {
        context = context || document;
        trigger = trigger || 'unload';
        // Execute all behavior.
        return Drupal.detachBehaviors(context, this.settings(), trigger);
      } 
      else if (behavior) {
        // Return the behavior.
        return Drupal.behaviors[behavior] || null;
      }
      // Return all behaviors.
      return drupal.behaviors;
    },
    // And give access to general functions.
    checkPlain: Drupal.checkPlain,
    formatString: Drupal.formatString,
    t: Drupal.t,
    formatPlural: Drupal.formatPlural,
    theme: Drupal.theme,
    encodePath: Drupal.encodePath,
    getSelection: Drupal.getSelection
  },
};


module.exports = DrupalMixin;

})(jQuery, Drupal, this, this.document, module);
// We pass module var via the closure, its work like that with browserify (test: 02/2015)
