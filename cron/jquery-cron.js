'/*
 * Cron jQuery plugin (version 0.9.0)
 * https://github.com/null-d3v/jquery-cron
 *
 * Copyright null-d3v
 * Released under the MIT license
 */'
(function($)
{
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
    var $monthSelect = $("<select>");
    for (var index = 0; index < months.length; index++)
    {
        $("<option>")
            .attr("value", index + 1)
            .text(months[index])
            .appendTo($monthSelect);
    }

    var intervals =
    {
        "minute": 0,
        "hour": 1,
        "day": 2,
        "week": 3,
        "month": 4,
        "year": 5,
    };
    var $intervalSelect = $("<select>");
    for (var interval in intervals)
    {
        $("<option>")
            .attr("value", intervals[interval])
            .text(interval)
            .appendTo($intervalSelect);
    }

    var interval = intervals.minute;

    var defaultOptions =
    {
        value: "* * * * *",
        enabled: true,
        utc: true,
    };
    var methods =
    {
        initialize: function(options)
        {
            var $this = $(this);
            options = $.extend({}, defaultOptions, options);

            var $cronDiv = $("<div>")
                .append($("<span>")
                    .text("Every"))
                .append($intervalSelect)
                .append($("<span>")
                    .text("on")
                    .addClass("cron-hour cron-week cron-month cron-year"))
                .append($("<span>")
                    .text("the")
                    .addClass("cron-month"))
                .append($weekdaySelect)
                .append($monthSelect)
                .append($monthdaySelect)
                .append($("<span>")
                    .text("day")
                    .addClass("cron-month"))
                .append($("<span>")
                    .text("at")
                    .addClass("cron-day cron-week cron-month cron-year"))
                .append($hourSelect)
                .append($("<span>")
                    .text(":")
                    .addClass("cron-day cron-week cron-month cron-year"))
                .append($minuteSelect)
                .append($("<span>")
                    .text("minutes past the hour")
                    .addClass("cron-hour"));

            setValue(options.value);

            $this.append($cronDiv);
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

    var getOrdinalSuffix = function(number)
    {
        var suffix = "";

        var mod10 = number % 10;
        var mod100 = number % 100;
        if (mod10 == 1 && mod100 != 11)
        {
            suffix = "st";
        }
        if (mod10 == 2 && mod100 != 12)
        {
            suffix = "nd";
        }
        if (mod10 == 3 && mod100 != 13)
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

        switch(interval)
        {
            case interval.minute:
            {
                break;
            }
            case interval.hour:
            {
                cron.minute = $minuteSelect.val();
                break;
            }
            case interval.day:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                break;
            }
            case interval.week:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                cron.weekday = $weekdaySelect.val();
                break;
            }
            case interval.month:
            {
                cron.minute = $minuteSelect.val();
                cron.hour = $hourSelect.val();
                cron.monthday = $monthdaySelect.val();
                break;
            }
            case interval.year:
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

    var setValue = function(cron)
    {
        // TODO
        return intervals.minute;
    };

    var $minuteSelect = $("<select>");
    for (var index = 0; index < 60; index++)
    {
        $("<option>")
            .attr("value", index)
            .text(index)
            .addClass("cron-hour cron-day cron-week cron-month cron-year")
            .appendTo($minuteSelect);
    }

    var $hourSelect = $("<select>");
    for (var index = 0; index < 24; index++)
    {
        $("<option>")
            .attr("value", index)
            .text(index < 10 ? "0" + index : index)
            .addClass("cron-day cron-week cron-month cron-year")
            .appendTo($hourSelect);
    }

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
    var $weekdaySelect = $("<select>");
    for (var index = 0; index < weekdays.length; index++)
    {
        $("<option>")
            .attr("value", index)
            .text(weekdays[index])
            .addClass("cron-week")
            .appendTo($weekdaySelect);
    }

    var $monthdaySelect = $("<select>");
    for (var index = 1; index < 32; index++)
    {
        $("<option>")
            .attr("value", index)
            .text(index + getOrdinalSuffix(index))
            .addClass("cron-month")
            .appendTo($daySelect);
    }

    $.fn.cron = function(parameter)
    {
        if (typeof(methods[parameter]) !== "undefined")
        {
            return methods[parameter].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof(parameter) === "undefined" || typeof(parameter) === "object")
        {
            return methods.init.apply(this, arguments);
        }
        else
        {
            $.error("Unsupported");
        }
    };
})($);