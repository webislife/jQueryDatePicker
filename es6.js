(function() {
    'use strict';

    class DatePicker {
        constructor(el, params) {
            //default params
            this.params = $.extend({
                type: 'date', // || rangedate
                startDate: moment(), //startDate
                endDate: moment(), //endDate
                locale: 'ru',
                format: 'YYYY.MM.DD', //Display date format
                delimiter: '-', // display visual delimiter for rangedate type picker
                ranges: [], //ranges
                modalMode: false, //display center on screen
                minDate: null, //min available moment date
                maxDate: null, //max available moment date
                firstDayOfWeek: moment.localeData().firstDayOfWeek(), //first number day of the week
                onShow: () => {},
                onHide: () => {}
            }, params);

            //Save elements link and create calendar div
            this.el = el;
            this.$el = $(document.createElement('div'));

            if(!this.params.modalMode) {
                //Append calendar after input elemnt
                this.el.after(this.$el);
            } else {
                $(document.body).append(this.$el);
            }

            //Set locale
            moment.locale(this.params.locale);

            //Current view date in calendar
            this.viewStartDate = this.params.startDate;
            this.viewEndDate = this.params.endDate;

            //Selected date - view on top
            this.dateStart = this.params.startDate.clone();
            this.dateEnd = this.params.endDate.clone();

            this.render.call(this);
            
            //Init all event listeners
            this.initEvents();
            
            //Set default input value
            this.setValue();

            return this;
        }
        /**
         * Set active date after click on day in calendar
         * @param {Object} event jquery event
         * @param {String} type  end or start date type
         */
        setActiveDate(event, type = 'start') {
            var el = event.currentTarget,
                dayNum = parseInt(el.innerHTML, 10),
                minDate = this.params.minDate,
                maxDate = this.params.maxDate,
                viewDate = type === 'start' ? this.viewStartDate : this.viewEndDate;

            if (String(dayNum).length === 1) dayNum = '0' + dayNum;

            var date = moment(viewDate.format('YYYY-MM') + '-' + dayNum);
            
            //Check max and min dates
            if(minDate !== null && typeof minDate === 'object' && date.isBefore(minDate)) return;
            if(maxDate !== null && typeof maxDate === 'object' && date.isAfter(maxDate)) return;
            
            if (type === 'start') {
                if (date.isAfter(this.dateEnd, 'day') && this.params.type === 'rangedate') {
                    this.dateEnd = date;
                } else {
                    this.dateStart = date;
                }
            } else {
                if (date.isBefore(this.dateStart, 'day') && this.params.type === 'rangedate') {
                    this.dateStart = date;
                } else {
                    this.dateEnd = date;
                }
            }
            event.stopPropagation();
            this.render();
            this.setValue();
        }
        /**
         * Set start date
         * @param {Date} date Javascript date object or string date
         */
        setStartDate(date) {
            this.viewStartDate = moment(date);
            this.dateStart = moment(date);
            this.render();
        }
        /**
         * Set end date
         * @param {Date} date Javascript date object or string date
         */
        setEndDate(date) {
            this.viewEndDate = moment(date);
            this.dateEnd = moment(date);
            this.render();
        }
        /**
         * Set next or prev date by params
         * @param  {Object} event    jQuery event
         * @param  {String} calendar end or start type 
         * @param  {String} dateType day or week or month or year
         * @return {void}          
         */
        changeEventDate(event, calendar = 'start', dateType = 'day', action = 'add') {
            var minDate = this.params.minDate,
                maxDate = this.params.maxDate,
                newDate = this.viewStartDate[action](1, dateType);

            //Check max and min dates
            if(minDate !== null && typeof minDate === 'object' && moment(newDate).isBefore(minDate) || 
                maxDate !== null && typeof maxDate === 'object' && moment(newDate).isAfter(maxDate)) {
                this.viewStartDate = moment(newDate);
                this.render();
            } else {
                calendar === 'start' ? this.setStartDate(newDate) : this.setEndDate(newDate);
            }

            event.stopPropagation();
        }
        /**
         * Set active range date
         * @param {Object} event jQuery event
         */
        setActiveRange(event) {
            var range = parseInt(event.currentTarget.getAttribute('data-range'), 10),
                rangeParam = this.params.ranges[range];
            if (rangeParam) {
                this.dateStart = rangeParam.startDate;
                this.viewStartDate = rangeParam.startDate;
                this.dateEnd = rangeParam.endDate;
                this.viewEndDate = rangeParam.endDate;
                this.render();
            }
        }
        /**
         * Init all events
         */
        initEvents() {
            //Calendar
            this.$el
                .on('click', '.dt__calendar_start .dt__calendar_m_d', event => this.setActiveDate(event, 'start'))
                .on('click', '.dt__calendar_end .dt__calendar_m_d', event => this.setActiveDate(event, 'end'))
                .on('click', '.dt__start .dt__calendar_head_month .next', event => this.changeEventDate(event, 'start', 'month', 'add'))
                .on('click', '.dt__start .dt__calendar_head_month .prev', event => this.changeEventDate(event, 'start', 'month', 'subtract'))
                .on('click', '.dt__end .dt__calendar_head_month .next', event => this.changeEventDate(event, 'end', 'month', 'add'))
                .on('click', '.dt__end .dt__calendar_head_month .prev', event => this.changeEventDate(event, 'end', 'month', 'subtract'))
                .on('click', '.dt__start .dt__calendar_head_year .next', event => this.changeEventDate(event, 'start', 'year', 'add'))
                .on('click', '.dt__start .dt__calendar_head_year .prev', event => this.changeEventDate(event, 'start', 'year', 'subtract'))
                .on('click', '.dt__end .dt__calendar_head_year .next', event => this.changeEventDate(event, 'end', 'year', 'add'))
                .on('click', '.dt__end .dt__calendar_head_year .prev', event => this.changeEventDate(event, 'end', 'year', 'subtract'))
                .on('click', '.dt__ranges_item', event => this.setActiveRange(event))
                .on('click', '.dt-modal_close', event => this.hideCalendar())
                .on('click', '.dt__wrapper', event => false);

            //Input 
            this.el
                .on('click', event => event.stopPropagation())
                .on('focus', event => {
                    this.showCalendar();
                    event.stopPropagation();
                });

            $(document).on('click', event => this.hideCalendar());
            $(window).on('keydown', event => this.keyDown(event));
        }
        /**
         * KeyDown event handler
         * @param  {event} jQuery event
         * @return {void} 
         */
        keyDown(event) {
            //Hide on press ESC
            if(event.keyCode === 27) {
                this.hideCalendar();
            }
        }

        showCalendar() {
            this.params.onShow();
            this.$el.addClass('show');
        }

        hideCalendar() {
            this.params.onHide();
            this.$el.removeClass('show');
        }
        /**
         * Render month
         * @param  {momentdate} date
         * @param  {type} type start || end 
         * @return {string}  html month template
         */
        renderMonth(date, type = 'start') {
            var html = '',
                daysInMonth = date.daysInMonth(),
                sameDate = type === 'start' ? this.dateStart : this.dateEnd,
                minDate = this.params.minDate,
                maxDate = this.params.maxDate,
                dayClass = '';

            for (var i = 0; i < daysInMonth; i++) {
                let dayNum = i + 1,
                    forDate = moment(date.format('YYYY-MM') + '-' + (dayNum < 10 ? '0' + dayNum : dayNum) );

                if (forDate.isSame(this.dateStart, 'day')) {
                    dayClass = 'active ';
                } else if (forDate.isSame(this.dateEnd, 'day') && this.params.type === 'rangedate') {
                    dayClass = 'active ';
                } else {
                    dayClass = '';
                }

                //Add class for between dates
                if (this.params.type === 'rangedate' && forDate.isAfter(this.dateStart, 'day') && forDate.isBefore(this.dateEnd, 'day')) {
                    dayClass += 'between ';
                }
                //Add class for disabled dates

                //Check max and min dates
                if(typeof minDate === 'object' && forDate.isBefore(minDate)) dayClass += 'disabled';
                if(typeof maxDate === 'object' && forDate.isAfter(maxDate)) dayClass += 'disabled';

                html += '<div class="dt__calendar_m_d ' + dayClass + '">' + dayNum + '</div>';
            };

            return html;
        }

        /**
         * Render full calendar with header and content
         * @param  {date} date momentdate 
         * @param  {String} start || end
         * @return {Sting} html template string
         */
        renderCalendar(date, type = 'start') {
            var html = '',
                navClass = type,
                selectDate = type === 'start' ? this.dateStart : this.dateEnd,
                weekShortDays = moment.weekdaysShort(),
                firstDayOfWeek = date.clone().startOf('month').weekday();

            // update day names order to firstDayOfWeek
            if (this.params.firstDayOfWeek != 0) {
                let i = this.params.firstDayOfWeek;
                while (i > 0) {
                    weekShortDays.push(weekShortDays.shift());
                    i--
                }
            }           

            html += '<div class="dt__calendar dt__' + type + '">';
            html += '<div class="dt__calendar_head">';
            html += '<div class="dt__calendar_head_wday">' + selectDate.format('dddd') + '</div>';
            html += '<div class="dt__calendar_head_month"><i class="prev"><</i><span>' + selectDate.format('MMMM') + '</span><i class="next">></i></div>';
            html += '<div class="dt__calendar_head_day">' + selectDate.format('D') + '</div>';
            html += '<div class="dt__calendar_head_year"><i class="prev"><</i><span>' + selectDate.format('Y') + '</span><i class="next">></i></div>';
            html += '</div>';
            html += '<div class="dt__calendar_nav">';
            html += '<div class="dt__calendar_nav_title">' + date.format('MMM YYYY') + '</div>';
            html += '</div>';

            html += '<div class="dt__calendar_' + navClass + '"><div class="dt__calendar_m">';
            html += '<div class="dt__calendar_m_w">';

            for (let wi = 0; wi < weekShortDays.length; wi++) {
                html += '<div class="dt__calendar_m_w_n">' + weekShortDays[wi] + '</div>';
            };
            html += '</div>';

            for (let fi = 0; fi < firstDayOfWeek; fi++) {
                html += '<div class="dt__calendar_m_d_e"></div>';
            };

            html += this.renderMonth(date, type);

            html += '</div></div>';

            if(this.params.modalMode) html += '<div class="dt-modal_close">&#215;</div>';
            
            html += '</div>';

            return html;
        }
        /**
         * Render selector date ranges
         * @return {html} template rangesitem
         */
        renderRanges() {
            var html = '',
                ranges = this.params.ranges;

            html += '<div class="dt__ranges">';
            for (let i = 0, l = ranges.length; i < l; i++) {
                html += '<div class="dt__ranges_item" data-range="' + i + '"">' + ranges[i].label + '</div>';
            }
            html += '</div>';
            return html;
        }
        /**
         * Render calendar
         * @return {String} html template
         */
        render() {
            var html = '';

            if (this.params.modalMode) html += '<div class="dt-modal_wrapper">';

            html += '<div class="dt__wrapper">';

            html += this.renderCalendar(this.viewStartDate, 'start');

            if (this.params.type === 'rangedate') {
                html += this.renderCalendar(this.viewEndDate, 'end');

                if (this.params.ranges.length) {
                    html += this.renderRanges();
                }
            }

            if (this.params.modalMode) html += '</div>';

            html += '</div>';

            this.$el.html(html);

            //afer render
            this.onAfterRender();
        }
        /**
         * Set input value
         */
        setValue() {
            if (this.params.type === 'date') {
                this.el.val(this.dateStart.format(this.params.format));
            //range with delimiter
            } else {
                this.el.val(this.dateStart.format(this.params.format) + this.params.delimiter + this.dateEnd.format(this.params.format));
            }
        }
        /**
         * After render logic
         */
        onAfterRender() {
            this.$el.addClass('dt');

            if (this.params.type == 'rangedate') {
                this.$el.find('.dt__wrapper').addClass('rangedate');
            }

            if (this.params.modalMode) {
                this.$el.addClass('dt-modal');
            }
        }
        /**
         * Destroy calendar
         */
        destroy() {
            this.$el
                .detach()
                .off()
                .remove();
        }
    }

    //Register for jQuery Plugin
    if (window.jQuery) {
        //Small warpper for jQuery plugin support
        jQuery.fn.DatePicker = function(params) {
            //this === inited plugin element
            return new DatePicker(this, params);
        };
    }

    //Register for requirejs
    if (typeof define === 'function') {
        define('datetimepicker', () => DatePicker);
    }
})();