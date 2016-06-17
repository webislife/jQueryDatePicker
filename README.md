# jQueryDatePicker
Simple javascript date range picker. Work with moment.js
[See demo](http://webislife.ru/daterangepicker)
### Available params
    {
        type: 'date', // || rangedate
        startDate: moment(), //startDate
        endDate: moment(), //endDate
        locale: 'ru',
        format: 'YYYY.MM.DD', //Display date format
        delimiter: '-', // display visual delimiter for rangedate type picker
        ranges: [], //ranges
        modalMode: false, //display center on screen
        firstDayOfWeek: 1, //for rus weekday fix)
        onShow: () => {},
        onHide: () => {}
    }

### Example init

    $('#singleDateRange').DatePicker({
        startDate: moment()
    });
    
    $('#modalMode').DatePicker({
        startDate: moment(),
        modalMode: true
    });

    $('#rangedate').DatePicker({
        type: 'rangedate',
        startDate: moment().subtract(1, 'week'),
        endDate: moment(),
        ranges: [{
            label: "Вчера",
            startDate: moment().subtract(1, 'day'),
            endDate: moment().subtract(1, 'day')
        }, {
            label: 'Неделя',
            startDate: moment().startOf('week'),
            endDate: moment()
        }, {
            label: '2 недели',
            startDate: moment().startOf('week').subtract(1, 'week'),
            endDate: moment()
        }, {
            label: 'Месяц',
            startDate: moment().startOf('month'),
            endDate: moment()
        }, {
            label: 'Прошлый месяц',
            startDate: moment().startOf('month').subtract(1, 'month'),
            endDate: moment().startOf('month')
        }, {
            label: 'Квартл',
            startDate: moment().startOf('month').subtract(4, 'month'),
            endDate: moment().startOf('month')
        }, {
            label: 'Год',
            startDate: moment().startOf('year'),
            endDate: moment().startOf('moth')
        }]
    });
