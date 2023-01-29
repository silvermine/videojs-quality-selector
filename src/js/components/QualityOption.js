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
   return class QualityOption extends MenuItem {

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

         super(player, options);

         this.source = source;
      }

      /**
       * @inheritdoc
       */
      handleClick(event) {
         super.handleClick(event);
         this.player().trigger(events.QUALITY_REQUESTED, this.source);
      }
   };
};
