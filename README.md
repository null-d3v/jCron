# jsCron

jsCron is a javascript library for presenting a basic interface for users to specify simple cron entries.

It is forked from jCron/jquery-cron and does not need jQuery.

Simple cron entries are limited to the following:
```
Every minute : * * * * *
Every hour   : ? * * * *
Every day    : ? ? * * *
Every week   : ? ? * * ?
Every month  : ? ? ? * *
Every year   : ? ? ? ? *
```

## Usage

### Initialization

Invoke the cron function on a jQuery selector containing a single input element.

```
new jsCron( inputElement );

// or

var cronObj = new jsCron( inputElement, {
    disabled: false,
    value: "",
});
```

The following initialization options are supported:

* `disabled`
  * If `true`, all cron controls will be disabled.
  * Default value: `false`

* `value`
  * If unspecified, the input's value will be used.
  * If unspecified and the input's value is unspecified, `"* * * * *"` will be used.
  * Default value: `""`

* `className`
  * Class name of the container of cron inputs.
  * Default value: `""`

* `style`
  * The cron inputs are placed in a &lt;div&gt; container.  To make it work like an input, its has a default inline style.
  * Default value: `"display: inline"`

* `position`
  * Put the cron inputs "before", "after", or "replace" the original input.
  * In case of replace, the input will be removed and appended inside the cron container.
  * Default value: `"after"`

### Status

States can be accessed directly from the returned object.

* `disabled`
  * Gets or sets the option to disable all interactive functionality.
  * `cronObj.disabled`
    * returns `false`
  * `cronObj.disabled = true`

* `value`
  * Gets or sets the current cron value.
  * This will not fire the change event.
  * Note that the cron value is also maintained in the targeted input element.
  * `cronObj.value`
    * returns `"* * * * *"`
  * `cronObj.value = "0 * * * *"`

### Change events

Change events are propagated through the targeted input element.

```
new jsCron( inputElement );
inputElement.addEventListener( 'change', ( event ) => {
  /* Triggered when any cron selection changes */ 
});
```

### General Notes

* This is a utility for *simple* crons.
* The cron value will always be maintained in the targeted input element for simple form submission.
* jCron doesn't mess around with base1 weekday values and instead converts them to base0.

## Investigate and Implement TODO

* Unit test.
* Internationalisation.
* Advanced mode for manual entry.
* Multi-select.

## Others

[Original implementation] by Shawn Chin.

This project is licensed under the [MIT license].

[jQuery]: http://jquery.com "jQuery"
[Original implementation]: http://shawnchin.github.com/jquery-cron "Original implementation"
[MIT License]: http://www.opensource.org/licenses/mit-license.php "MIT License"