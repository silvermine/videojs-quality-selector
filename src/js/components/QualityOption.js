var _ = require('underscore'),
    events = require('../events');

module.exports = function(videojs) {
   var MenuItem = videojs.getComponent('MenuItem');

   /**
    * A MenuItem to represent a video resolution
    *
    * @class QualityOption
    * @extends videojs.MenuItem
    */
   class QualityOption extends MenuItem {

      /**
       * @inheritdoc
       */
      constructor(player, options) {
         var source = options.source;

         if (!_.isObject(source)) {
            throw new Error('was not provided a "source" object, but rather: ' + (typeof source));
         }

         options = _.extend({
            selectable: true,
            label: source.label,
         }, options);

         MenuItem.call(this, player, options);

         this.source = source;
      }

      /**
       * @inheritdoc
       */
      handleClick(event) {
         MenuItem.prototype.handleClick.call(this, event);
         this.player().trigger(events.QUALITY_REQUESTED, this.source);
      }

   };
};
