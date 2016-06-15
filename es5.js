'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || !1; descriptor.configurable = !0; if ("value" in descriptor) descriptor.writable = !0; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var DatePicker = function () {
        function DatePicker(el, params) {
            _classCallCheck(this, DatePicker);

            this.el = el;
            this.$el = $(document.createElement('div'));

            this.el.after(this.$el);

            this.params = $.extend({
                type: 'date',
                startDate: moment(),
                endDate: moment(),
                locale: 'ru',
                format: 'YYYY.MM.DD',
                delimiter: '-',
                ranges: [],
                firstDayOfWeek: 1 }, params);

            moment.locale(this.params.locale);

            this.viewStartDate = this.params.startDate;
            this.viewEndDate = this.params.endDate;

            this.dateStart = this.params.startDate.clone();
            this.dateEnd = this.params.endDate.clone();

            this.render.call(this);

            this.initEvents();

            this.setValue();

            return this;
        }

        _createClass(DatePicker, [{
            key: 'setActiveDate',
            value: function setActiveDate(event) {
                var type = arguments.length <= 1 || arguments[1] === undefined ? 'start' : arguments[1];

                var el = event.currentTarget,
                    dayNum = parseInt(el.innerHTML, 10),
                    vd = type === 'start' ? this.viewStartDate : this.viewEndDate;

                if (String(dayNum).length === 1) dayNum = '0' + dayNum;

                var date = moment(vd.format('YYYY MM') + ' ' + dayNum);

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
        }, {
            key: 'setStartDate',
            value: function setStartDate(date) {
                this.viewStartDate = moment(date);
                this.dateStart = moment(date);
                this.render();
            }
        }, {
            key: 'setEndDate',
            value: function setEndDate(date) {
                this.viewEndDate = moment(date);
                this.dateEnd = moment(date);
                this.render();
            }
        }, {
            key: 'nextDate',
            value: function nextDate(event) {
                var calendar = arguments.length <= 1 || arguments[1] === undefined ? 'start' : arguments[1];
                var dateType = arguments.length <= 2 || arguments[2] === undefined ? 'day' : arguments[2];

                if (calendar === 'start') {
                    var newDate = new Date(this.viewStartDate.add(1, dateType).format('YYYY MM DD'));
                    this.setStartDate(newDate);
                } else {
                    var _newDate = new Date(this.viewEndDate.add(1, dateType).format('YYYY MM DD'));
                    this.setEndDate(_newDate);
                }
                event.stopPropagation();
            }
        }, {
            key: 'prevDate',
            value: function prevDate(event) {
                var calendar = arguments.length <= 1 || arguments[1] === undefined ? 'start' : arguments[1];
                var dateType = arguments.length <= 2 || arguments[2] === undefined ? 'day' : arguments[2];

                if (calendar === 'start') {
                    var newDate = new Date(this.viewStartDate.subtract(1, dateType).format('YYYY MM DD'));
                    this.setStartDate(newDate);
                } else {
                    var _newDate2 = new Date(this.viewEndDate.subtract(1, dateType).format('YYYY MM DD'));
                    this.setEndDate(_newDate2);
                }
                event.stopPropagation();
            }
        }, {
            key: 'setActiveRange',
            value: function setActiveRange(event) {
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
        }, {
            key: 'initEvents',
            value: function initEvents() {
                var _this = this;

                this.$el.on('click', '.dt__calendar_start .dt__calendar_m_d', function (event) {
                    return _this.setActiveDate(event, 'start');
                }).on('click', '.dt__calendar_end .dt__calendar_m_d', function (event) {
                    return _this.setActiveDate(event, 'end');
                }).on('click', '.dt__start .dt__calendar_head_month .next', function (event) {
                    return _this.nextDate(event, 'start', 'month');
                }).on('click', '.dt__start .dt__calendar_head_month .prev', function (event) {
                    return _this.prevDate(event, 'start', 'month');
                }).on('click', '.dt__end .dt__calendar_head_month .next', function (event) {
                    return _this.nextDate(event, 'end', 'month');
                }).on('click', '.dt__end .dt__calendar_head_month .prev', function (event) {
                    return _this.prevDate(event, 'end', 'month');
                }).on('click', '.dt__start .dt__calendar_head_year .next', function (event) {
                    return _this.nextDate(event, 'start', 'year');
                }).on('click', '.dt__start .dt__calendar_head_year .prev', function (event) {
                    return _this.prevDate(event, 'start', 'year');
                }).on('click', '.dt__end .dt__calendar_head_year .next', function (event) {
                    return _this.nextDate(event, 'end', 'year');
                }).on('click', '.dt__end .dt__calendar_head_year .prev', function (event) {
                    return _this.prevDate(event, 'end', 'year');
                }).on('click', '.dt__rages_item', function (event) {
                    return _this.setActiveRange(event);
                }).on('click', '.dt__wrapper', function (event) {
                    return !1;
                });

                this.el.on('click', function (event) {
                    return event.stopPropagation();
                }).on('focus', function (event) {
                    _this.showCalendar();
                    event.stopPropagation();
                });

                $(document).on('click', function (event) {
                    return _this.hideCalendar();
                });
            }
        }, {
            key: 'showCalendar',
            value: function showCalendar() {
                this.$el.addClass('show');
            }
        }, {
            key: 'hideCalendar',
            value: function hideCalendar() {
                this.$el.removeClass('show');
            }
        }, {
            key: 'renderMonth',
            value: function renderMonth(date) {
                var type = arguments.length <= 1 || arguments[1] === undefined ? 'start' : arguments[1];

                var html = '',
                    daysInMonth = date.daysInMonth(),
                    sameDate = type === 'start' ? this.dateStart : this.dateEnd,
                    dayClass = '';

                for (var i = 0; i < daysInMonth; i++) {
                    var forDate = moment(new Date(date.format('YYYY MM') + ' ' + (i + 1)));

                    if (forDate.isSame(this.dateStart, 'day')) {
                        dayClass = 'active';
                    } else if (forDate.isSame(this.dateEnd, 'day') && this.params.type === 'rangedate') {
                        dayClass = 'active';
                    } else {
                        dayClass = '';
                    }

                    if (this.params.type === 'rangedate' && forDate.isAfter(this.dateStart, 'day') && forDate.isBefore(this.dateEnd, 'day')) {
                        dayClass += 'between';
                    }
                    html += '<div class="dt__calendar_m_d ' + dayClass + '">' + (i + 1) + '</div>';
                };

                return html;
            }
        }, {
            key: 'renderCalendar',
            value: function renderCalendar(date) {
                var type = arguments.length <= 1 || arguments[1] === undefined ? 'start' : arguments[1];

                var html = '',
                    navClass = type,
                    selectDate = type === 'start' ? this.dateStart : this.dateEnd,
                    weekShortDays = moment.weekdaysShort(),
                    firstDayOfWeek = date.clone().startOf('month').weekday();

                if (this.params.firstDayOfWeek === 1) {
                    weekShortDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'cб', 'вс'];
                }

                html += '<div class="dt__calendar dt__' + type + '">';
                html += '<div class="dt__calendar_head">';
                html += '<div class="dt__calendar_head_wday">' + selectDate.format('dddd') + '</div>';
                html += '<div class="dt__calendar_head_month"><span class="prev"><</span>' + selectDate.format('MMMM') + '<span class="next">></span></div>';
                html += '<div class="dt__calendar_head_day">' + selectDate.format('D') + '</div>';
                html += '<div class="dt__calendar_head_year"><span class="prev"><</span>' + selectDate.format('Y') + '<span class="next">></span></div>';
                html += '</div>';
                html += '<div class="dt__calendar_nav">';
                html += '<div class="dt__calendar_nav_title">' + date.format('MMM YYYY') + '</div>';
                html += '</div>';

                html += '<div class="dt__calendar_' + navClass + '"><div class="dt__calendar_m">';
                html += '<div class="dt__calendar_m_w">';
                for (var wi = 0; wi < weekShortDays.length; wi++) {
                    html += '<div class="dt__calendar_m_w_n">' + weekShortDays[wi] + '</div>';
                };
                html += '</div>';

                for (var fi = 0; fi < firstDayOfWeek; fi++) {
                    html += '<div class="dt__calendar_m_d_e"></div>';
                };

                html += this.renderMonth(date, type);

                html += '</div></div>';
                html += '</div>';

                return html;
            }
        }, {
            key: 'renderRanges',
            value: function renderRanges() {
                var html = '',
                    ranges = this.params.ranges;

                html += '<div class="dt__rages">';
                for (var i = 0, l = ranges.length; i < l; i++) {
                    html += '<div class="dt__rages_item" data-range="' + i + '"">' + ranges[i].label + '</div>';
                }
                html += '</div>';
                return html;
            }
        }, {
            key: 'render',
            value: function render() {
                var html = '';

                html += '<div class="dt__wrapper">';

                html += this.renderCalendar(this.viewStartDate, 'start');

                if (this.params.type === 'rangedate') {
                    html += this.renderCalendar(this.viewEndDate, 'end');

                    if (this.params.ranges.length) {
                        html += this.renderRanges();
                    }
                }

                html += '</div>';
                this.$el.html(html);

                this.onAfterRender();
            }
        }, {
            key: 'setValue',
            value: function setValue() {
                if (this.params.type === 'date') {
                    this.el.val(this.dateStart.format(this.params.format));
                } else {
                    this.el.val(this.dateStart.format(this.params.format) + this.params.delimiter + this.dateEnd.format(this.params.format));
                }
            }
        }, {
            key: 'onAfterRender',
            value: function onAfterRender() {
                this.$el.addClass('dt');
                if (this.params.type == 'rangedate') {
                    this.$el.find('.dt__wrapper').addClass('rangedate');
                }
            }
        }]);

        return DatePicker;
    }();

    if (window.jQuery) {
        jQuery.fn.DatePicker = function (params) {
            return new DatePicker(this, params);
        };
    }

    if (typeof define === 'function') {
        define('datetimepicker', function () {
            return DatePicker;
        });
    }
})();