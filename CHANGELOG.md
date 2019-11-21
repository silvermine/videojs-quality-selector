# Silvermine VideoJS Quality/Resolution Selector Change Log

In general, this project adheres to [Semantic Versioning](http://semver.org/). If for some
reason we do something that's not strictly semantic, it will be clearly called out below.

## 1.2.3

   * Downgraded the `class.extend` dependency to 0.9.1. Version 0.9.2 introduces a call to
     `new Function(someString)`, which [violates the Content Security Policy that blocks
     `eval` and `eval`-like function
     calls.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#Unsafe_eval_expressions)
     (f9ca724 Fixes #36)
   * Fixed a bug where the quality selection menu did not render when sources were set
     sometime after the player was initially created and became ready (a3753dd Fixes #47).
   * Support 'selected' as a value for the `selected` attribute on `source` tags (8702f4f
     Fixes #39)

## 1.2.2

   * Fixed a bug introduced in `1.2.0` where the quality selector menu did not show the
     selected source as selected when it first rendered

## 1.2.1

   * Fixed a bug introduced in 31a305d where the path to the built JS file in the `dist`
     folder changed unintentionally
   * Fixed a bug that prevented the quality selector menu from fading out smoothly in
     Video.js 7.
   * Included Video.js 7 in peer dependency range (21900e8 Fixes #26)

## 1.2.0

   * Migrated NPM package to use `@silvermine` scope

## 1.1.2

   * Fixed a bug where selecting a quality menu item while a video was playing did not resume
   playback after the source changed. Affected Safari and players whose `preload` attribute
   was `none` (8feeafb Fixes #16).

## 1.1.1

   * Reference underscore as a dependency since we depend on it (931d8a4 See #12)

## 1.1.0

**NOTE:** Strictly speaking, this version breaks API backwards-compatibility, and thus
should have been a 2.0.0 release. However, the break in API was just the changing of an
event name, and the event was not a documented event intended for external users to use
(although they could have easily done so). Also, even if someone was using the event,
depending on the specific reason they were using it, they may not need to make a change at
all.

If you were relying on the `QUALITY_SELECTED` event, it's possible that you will now need
to rely on the `QUALITY_REQUESTED` event instead, depending on why you were listening to
the event. See a682125 for details.

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
