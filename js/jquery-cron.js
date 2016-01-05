/*
 * Cron jQuery plugin (version 0.9.0)
 * https://github.com/null-d3v/jquery-cron
 *
 * Copyright null-d3v
 * Released under the MIT license
 */
(function($)
{
    var getOrdinalSuffix = function(number)
    {
        var suffix = "";

        var mod10 = number % 10;
        var mod100 = number % 100;
        if (mod10 === 1 && mod100 !== 11)
        {
            suffix = "st";
        }
        else if (mod10 === 2 && mod100 !== 12)
        {
            suffix = "nd";
        }
        else if (mod10 === 3 && mod100 !== 13)
        {
            suffix = "rd";
        }
        else
        {
            suffix = "th";
        }

        return suffix;
    };

    var getValue = function()
    {
        var cron =
        {
            minute: "*",
            hour: "*",
            monthday: "*",
            month: "*",
            weekday: "*",
        };

        switch (currentInterval)
        {
            case intervals.minute:
            {
                break;
            }
            case intervals.hour:
            {
                cron.minute = $minuteSelect.val();
                break;
            }
            case intervals.day:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                break;
            }
            case intervals.week:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                cron.weekday = $weekdaySelect.val();
                break;
            }
            case intervals.month:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                cron.monthday = $monthdaySelect.val();
                break;
            }
            case intervals.year:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                cron.monthday = $monthdaySelect.val();
                cron.month = $monthSelect.val();
                break;
            }
        }

        return [cron.minute, cron.hour, cron.monthday, cron.month, cron.weekday].join(" ");
    };

    var setInterval = function(newInterval)
    {
        for (var interval in intervals)
        {
            if (intervals[interval] !== intervals.none)
            {
                $cronSpan.find("> ." + intervals[interval]).hide();
            }
        }
        $cronSpan.find("> ." + newInterval).show();
        $intervalSelect.val(newInterval);
        currentInterval = newInterval;
    };

    var setValue = function(newValue)
    {
        currentInterval = intervals.none;

        var cron = validateCron(newValue);

        if (cron.minute === "*")
        {
            setInterval(intervals.minute);
        }
        else
        {
            if (cron.hour === "*")
            {
                setInterval(intervals.hour);
                $minuteSelect.val(cron.minute);
            }
            else
            {
                if (cron.weekday === "*")
                {
                    if (cron.monthday === "*")
                    {
                        setInterval(intervals.day);
                        $minuteSelect.val(cron.minute);
                        $hourSelect.val(cron.hour);
                    }
                    else if (cron.month === "*")
                    {
                        setInterval(intervals.month);
                        $minuteSelect.val(cron.minute);
                        $hourSelect.val(cron.hour);
                        $monthdaySelect.val(cron.monthday);
                    }
                    else
                    {
                        setInterval(intervals.year);
                        $minuteSelect.val(cron.minute);
                        $hourSelect.val(cron.hour);
                        $monthdaySelect.val(cron.monthday);
                        $monthSelect.val(cron.month);
                    }
                }
                else
                {
                    setInterval(intervals.weekday);
                    $minuteSelect.val(cron.minute);
                    $hourSelect.val(cron.hour);
                    $weekdaySelect.val(cron.weekday);
                }
            }
        }

        $input.val(newValue);
    };

    var validateCron = function(cronString)
    {
        var cronComponents = cronString.split(" ");
        if (cronComponents.length !== 5)
        {
            $.error("Invalid cron format.");
        }

        var cron =
        {
            minute: cronComponents[0],
            hour: cronComponents[1],
            monthday: cronComponents[2],
            month: cronComponents[3],
            weekday: cronComponents[4],
        };

        if (cron.minute !== "*" &&
            !validateInteger(cron.minute, 0, 59))
        {
            $.error("Invalid minute format.");
        }

        if (cron.hour !== "*" &&
            !validateInteger(cron.hour, 0, 23))
        {
            $.error("Invalid hour format.");
        }

        if (cron.monthday !== "*" &&
            !validateInteger(cron.monthday, 1, 31))
        {
            $.error("Invalid monthday format.");
        }

        if (cron.month !== "*" &&
            !validateInteger(cron.month, 0, 11))
        {
            $.error("Invalid month format.");
        }

        if (cron.weekday !== "*" &&
            !validateInteger(cron.weekday, 0, 7))
        {
            $.error("Invalid weekday format.");
        }

        // While supported, it's just simpler this way.
        if (cron.weekday === "7")
        {
            cron.weekday = "0";
        }

        // TODO Weird and unsupported formats

        return cron;
    };

    var validateInteger = function(integer, minimum, maximum)
    {
        var parsedInteger = parseInt(integer);
        var valid =
            !isNaN(parsedInteger) &&
            Number.isInteger(parsedInteger) &&
            parsedInteger >= minimum &&
            parsedInteger <= maximum;
        return valid;
    };

    var intervals =
    {
        "none": "none",
        "minute": "cron-minute",
        "hour": "cron-hour",
        "day": "cron-day",
        "week": "cron-week",
        "month": "cron-month",
        "year": "cron-year",
    };
    var weekdays =
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    // TODO Maximum days per month for year interval.
    var months =
    [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var $input = null;
    var $cronSpan = null;
    var $intervalSelect = null;
    var $minuteSelect = null;
    var $hourSelect = null;
    var $weekdaySelect = null;
    var $monthdaySelect = null;
    var $monthSelect = null;
    var $cronCrontrols = null;

    var currentInterval = intervals.minute;
    var currentOptions = null;

    var defaultOptions =
    {
        disabled: false,
        value: "",
    };
    var functions =
    {
        initialize: function(options)
        {
            $input = $(this);

            if ($input.length !== 1 || !$input.is("input"))
            {
                $.error("Element must be a single input.");
            }

            currentOptions = $.extend({ }, defaultOptions, options);

            $intervalSelect = $("<select>")
                .addClass("cron-control")
                .on("change", function()
                {
                    setInterval($intervalSelect.val());
                });
            for (var interval in intervals)
            {
                if (intervals[interval] !== intervals.none)
                {
                    $("<option>")
                        .attr("value", intervals[interval])
                        .text(interval)
                        .appendTo($intervalSelect);
                }
            }

            $minuteSelect = $("<select>")
                .addClass("cron-control cron-hour cron-day cron-week cron-month cron-year");
            for (var index = 0; index < 60; index++)
            {
                var test = $("<option>")
                    .attr("value", index)
                    .text(index < 10 ? "0" + index : index)
                    .appendTo($minuteSelect);
            }

            $hourSelect = $("<select>")
                .addClass("cron-control cron-day cron-week cron-month cron-year");
            for (var index = 0; index < 24; index++)
            {
                $("<option>")
                    .attr("value", index)
                    .text(index < 10 ? "0" + index : index)
                    .appendTo($hourSelect);
            }

            $weekdaySelect = $("<select>")
                .addClass("cron-control cron-week");
            for (var index = 0; index < weekdays.length; index++)
            {
                $("<option>")
                    .attr("value", index)
                    .text(weekdays[index])
                    .appendTo($weekdaySelect);
            }

            $monthdaySelect = $("<select>")
                .addClass("cron-control cron-month cron-year");
            for (var index = 1; index < 32; index++)
            {
                $("<option>")
                    .attr("value", index)
                    .text(index + getOrdinalSuffix(index))
                    .appendTo($monthdaySelect);
            }

            $monthSelect = $("<select>")
                .addClass("cron-control cron-year");
            for (var index = 0; index < months.length; index++)
            {
                $("<option>")
                    .attr("value", index + 1)
                    .text(months[index])
                    .appendTo($monthSelect);
            }

            $cronSpan = $("<span>")
                .addClass("cron")
                .append($("<span>")
                    .text("Every "))
                .append($intervalSelect)
                .append($("<span>")
                    .text(" on ")
                    .addClass("cron-week cron-month cron-year"))
                .append($("<span>")
                    .text(" the ")
                    .addClass("cron-month"))
                .append($weekdaySelect)
                .append($monthSelect)
                .append($monthdaySelect)
                .append($("<span>")
                    .text(" day ")
                    .addClass("cron-month"))
                .append($("<span>")
                    .text(" at ")
                    .addClass("cron-hour cron-day cron-week cron-month cron-year"))
                .append($hourSelect)
                .append($("<span>")
                    .text(" : ")
                    .addClass("cron-day cron-week cron-month cron-year"))
                .append($minuteSelect)
                .append($("<span>")
                    .text(" minutes past the hour")
                    .addClass("cron-hour"));

            $cronControls = $cronSpan
                .find("> select.cron-control")
                .on("change", function()
                {
                    $input
                        .val(getValue())
                        .trigger("change");
                });

            $input
                .hide()
                .after($cronSpan);

            functions.disabled(currentOptions.disabled);
            functions.value(currentOptions.value || $input.val() || "* * * * *");
        },
        disabled: function(disabled)
        {
            if (typeof(disabled) !== "undefined")
            {
                currentOptions.disabled = disabled;
                $input.prop("disabled", currentOptions.disabled);
                $cronControls.prop("disabled", currentOptions.disabled);
            }
            else
            {
                return currentOptions.disabled;
            }
        },
        value: function(cron)
        {
            if (typeof(cron) !== "undefined")
            {
                setValue(cron);
            }
            else
            {
                return getValue();
            }
        },
    };

    $.fn.cron = function(parameter)
    {
        if (typeof(functions[parameter]) !== "undefined" &&
            functions[parameter] !== functions.initialize)
        {
            return functions[parameter].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof(parameter) === "undefined" || typeof(parameter) === "object")
        {
            return functions.initialize.apply(this, arguments);
        }
        else
        {
            $.error("Unsupported cron function.");
        }
    };
})($);