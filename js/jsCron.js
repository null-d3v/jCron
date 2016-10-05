/*
 * Cron javascript library (version 1.0.0)
 * https://github.com/Sheep-y/jsCron
 *
 * Copyright 2010-2013 Shawn Chin, 2016 null-d3v / sheepy
 * Released under the MIT license
 */
(function( out ){
    const jsCron = function(element, options) {
       this.initialize(element, options);
    };

    const intervals =
        {
            "none": "none",
            "minute": "cron-minute",
            "hour": "cron-hour",
            "day": "cron-day",
            "week": "cron-week",
            "month": "cron-month",
            "year": "cron-year",
        };
    // Must be already escaped as HTML
    const weekdays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

    // TODO Maximum days per month for year interval.
    // Must be already escaped as HTML
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    const defaultOptions =
        {
            disabled: false,
            value: "",
            style: "display: inline",
            className: "",
            position: "after",
        };

    jsCron.prototype =
    {
        input : null,
        rootElement : null,
        intervalSelect : null,
        minuteSelect : null,
        hourSelect : null,
        weekdaySelect : null,
        monthdaySelect : null,
        monthSelect : null,

        currentInterval : intervals.minute,
        currentOptions : null,

        initialize (element, options)
        {
            if (this.input !== null)
                return console.error("Element has already been initialized.");

            const input = this.input = element;

            if (!input instanceof Element || !input.tagName === "INPUT")
                return console.error("Element must be a single input.");

            options = this.currentOptions = Object.assign({ }, defaultOptions, options);

            let intervalSelect = "<select class='cron-control'>";
            for (let interval in intervals)
            {
                if (intervals[interval] !== intervals.none)
                {
                    intervalSelect += "<option value='" + intervals[interval] + "'>" + interval;
                }
            }
            intervalSelect += "</select>";

            const minuteSelect = buildSelect( 'cron-control cron-hour cron-day cron-week cron-month cron-year', 0, 60, twoDigits );

            const hourSelect = buildSelect( 'cron-control cron-day cron-week cron-month cron-year', 0, 24, twoDigits );

            const weekdaySelect = buildSelect( 'cron-control cron-week', 0, 7, i => weekdays[i] );

            const monthdaySelect = buildSelect( 'cron-control cron-month cron-year', 1, 32, getOrdinalSuffix );

            const monthSelect = buildSelect( 'cron-control cron-year', 0, 12, i => months[i] );

            const root = this.rootElement = document.createRange().createContextualFragment(
                    `<div style="${options.style}">Every `
                    + intervalSelect
                    + " <span class='cron-week cron-month cron-year'> on </span>"
                    + " <span class='cron-month'> the </span>"
                    + weekdaySelect
                    + monthSelect
                    + monthdaySelect
                    + "<span class='cron-month'> day </span>"
                    + "<span class='cron-hour cron-day cron-week cron-month cron-year'> at </span>"
                    + hourSelect
                    + "<span class='cron-day cron-week cron-month cron-year'> : </span>"
                    + minuteSelect
                    + "<span class='cron-hour'> minutes past the hour </span>"
                + "</div>" ).firstChild;
            root.className = options.className;
            root.classList.add( 'cron' );

            root.addEventListener("change", ( event ) =>
                {
                    input.value = this.value;
                    input.dispatchEvent( new Event( 'change' ) );
                });
            [ this.intervalSelect, this.weekdaySelect, this.monthSelect, this.monthdaySelect, this.hourSelect, this.minuteSelect ] = this.controls;

            this.intervalSelect.addEventListener("change", e => this._setInterval(this.intervalSelect.value) );

            input.style.display = "none";
            if ( options.position === "before" )
                input.parentNode.insertBefore( root, input );
            else if ( options.position === "after" )
                input.parentNode.insertBefore( root, input.nextSibling );
            else if ( options.position === "replace" ) {
                input.parentNode.insertBefore( root, input );
                input.remove();
                root.appendChild( input );
            }

            this.disabled = options.disabled;
            this.value = options.value || input.value || "* * * * *";
        },

        _setInterval : function(newInterval)
        {
            for (var interval in intervals)
            {
                if (intervals[interval] !== intervals.none)
                {
                    [].forEach.call( this.rootElement.getElementsByClassName(intervals[interval]), e => e.style.display = "none" );
                }
            }
            [].forEach.call( this.rootElement.getElementsByClassName(newInterval), e => e.style.display = "" );
            this.intervalSelect.value = newInterval;
            this.currentInterval = newInterval;
        },

        get controls () {
           return this.rootElement.querySelectorAll( "select.cron-control" );
        },

        get value ()
        {
            var cron =
            {
                minute: "*",
                hour: "*",
                monthday: "*",
                month: "*",
                weekday: "*",
            };

            switch (this.currentInterval)
            {
                case intervals.minute:
                    break;

                case intervals.year:
                    cron.month = this.monthSelect.value;
                    // fall through
                case intervals.month:
                    cron.monthday = this.monthdaySelect.value;
                    // fall through
                case intervals.day:
                    cron.hour = this.hourSelect.value;
                    // fall through
                case intervals.hour:
                    cron.minute = this.minuteSelect.value;
                    break;

                case intervals.week:
                    cron.minute = this.minuteSelect.value;
                    cron.hour = this.hourSelect.value;
                    cron.weekday = this.weekdaySelect.value;
                    break;
            }

            return [cron.minute, cron.hour, cron.monthday, cron.month, cron.weekday].join(" ");
        },

        set value (newValue)
        {
            this.currentInterval = intervals.none;

            var cron = validateCron(newValue);

            this._setInterval(intervals.year);

            if (cron.month === "*")
                this._setInterval(intervals.month);
            else
                this.monthSelect.value = cron.month;

            if (cron.monthday === "*")
                this._setInterval(intervals.day);
            else
                this.monthdaySelect.value = cron.monthday;
               
            if (cron.hour === "*")
                this._setInterval(intervals.hour);
            else
                this.hourSelect.value = cron.hour;

             if (cron.minute === "*")
                this._setInterval(intervals.minute);
            else
                this.minuteSelect.value = cron.minute;

            if (cron.weekday !== "*")
            {
                this._setInterval(intervals.week);
                this.weekdaySelect.value = cron.weekday;
            }

            this.input.value = newValue;
        },

        get disabled ()
        {
            return this.currentOptions.disabled;
        },

        set disabled (disabled)
        {
            this.input.disabled = this.currentOptions.disabled = disabled;
            [].forEach.call( this.controls, e => e.disabled = disabled );
        },
    };

    function twoDigits ( i ) {
       return `0${i}`.substr( -2 );
    }

    function getOrdinalSuffix ( number )
    {
        const s = ["th", "st", "nd", "rd"], v = number % 100;
        return number + ( s[(v-20)%10] || s[v] || s[0] );
    }

    function validateInteger ( integer, minimum, maximum )
    {
        if ( integer === '*' ) return true;
        const parsed = parseInt(integer);
        return parsed === parsed && 
                 String(parsed) == integer &&
                 parsed >= minimum &&
                 parsed <= maximum;
    }

    function validateCron (cronString)
    {
        var cronComponents = cronString.split(" ");
        if (cronComponents.length !== 5)
            return console.error("Invalid cron format.");

        var cron =
        {
            minute: cronComponents[0],
            hour: cronComponents[1],
            monthday: cronComponents[2],
            month: cronComponents[3],
            weekday: cronComponents[4],
        };

        if ( ! validateInteger(cron.minute, 0, 59) )
            return console.error("Invalid minute format: " + cron.minute);

        if ( ! validateInteger(cron.hour, 0, 23) )
            return console.error("Invalid hour format: " + cron.hour);

        if ( ! validateInteger(cron.monthday, 1, 31) )
            return console.error("Invalid monthday format: " + cron.monthday);

        if ( ! validateInteger(cron.month, 0, 11) )
            return console.error("Invalid month format: " + cron.month);

        if ( ! validateInteger(cron.weekday, 0, 7) )
            return console.error("Invalid weekday format: " + cron.weekday);

        // While valid, it's just simpler this way.
        if ( cron.weekday === "7" )
            cron.weekday = "0";

        return cron;
    }

    function buildSelect ( className, from, to, textFunction ) {
        let result = `<select class='${className}'>`;
        for ( let i = from; i < to; i++ )
            result += `<option value=${i}>` + textFunction(i);
        return result + "</select>";
    }

    out.jsCron = jsCron;
})( window );