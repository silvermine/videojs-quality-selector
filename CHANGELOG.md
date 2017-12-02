# Silvermine VideoJS Quality/Resolution Selector Change Log

In general, this project adheres to [Semantic Versioning](http://semver.org/). If for some
reason we do something that's not strictly semantic, it will be clearly called out below.

## 1.1.0

**NOTE:** Strictly speaking, this version breaks API backwards-compatibility, and thus
should have been a 2.0.0 release. However, the break in API was just the changing of an
event name, and the event was not a documented event intended for external users to use
(although they could have easily done so). Also, even if someone was using the event,
depending on the specific reason they were using it, they may not need to make a change at
all.

If you were relying on the `QUALITY_SELECTED` event, it's possible that you will now need
to release on the `QUALITY_REQUESTED` event instead, depending on why you were listening
to the event. See a682125 for details.

   * Support quality selector buttons anywhere in the player's component hierarchy (a682125 Fixes #13)

## 1.0.3

   * Stopped modifying format of passed-in source list (See 7da6fd3)

## 1.0.2

   * Added localization (cc7f670 fixes #7)

## 1.0.1

   * Fixed bug with binding to `QUALITY_SELECTED` way too many times (9dd9ca1 Fixes #5)

## 1.0.0

   * Added documentation and released the initial release of the plugin.

## 0.9.0

   * Working version of the plugin, as yet undocumented.
