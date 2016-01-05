# jQuery-cron

jQuery-cron is a [jQuery] plugin for presenting a basic interface for users to specify simple cron entries.

Simple cron entries are limited to the following:
```
* Every minute : * * * * *
* Every hour   : ? * * * *
* Every day    : ? ? * * *
* Every week   : ? ? * * ?
* Every month  : ? ? ? * *
* Every year   : ? ? ? ? *
```

## Dependencies

* [jQuery]

## Usage

### Initialization

Invoke the cron function on a jQuery selector containing a single input element.

```
$(document).ready(function()
{
    $("#input").cron();

    // or

    $("#input").cron(
    {
        disabled: false,
        value: "",
    });
});
```

The following initialization options are supported:

* disabled
  * If true, all cron controls will be disabled
  * Default value: false

* value
  * If unspecified, the input's value will be used
  * If the input's value is unspecified, a default value of "* * * * *" will be used
  * Default value: ""

### Functions

Functions can be accessed by invoking the cron function on a single input element with the first parameter representing the function name.

* disabled
  * Gets or sets the option to disable all interactive functionality.
  * `$("#input").cron("disabled")`
    * returns false
  * `$("#input").cron("disabled", true)`

* value
  * Gets or sets the current cron value.
  * This will not fire the change event.
  * Note that the cron value is also maintained in the targeted input element.
  * `$("#input").cron("value")`
    * returns "* * * * *"
  * `$("#input").cron("value", "0 * * * *")`

### Change events

Change events are propagated through the targeted input element.

```
$("#input")
    .cron()
    .on("change", function() { });
```

### General Notes

* This is a utility for *simple* crons.
* The cron value will always be maintained in the targeted input element for simple form submission.
* jQuery-cron doesn't mess around with base1 weeks and instead converts them to base0.

## Others

[Original implementation] by Shawn Chin.

This project is licensed under the [MIT license].

[jQuery]: http://jquery.com "jQuery"
[Original implementation]: http://shawnchin.github.com/jquery-cron "Original implementation"
[MIT License]: http://www.opensource.org/licenses/mit-license.php "MIT License"
