const moment = require('moment')
const generateDateRange = (type, fromDate, toDate) => {
    //default is today
    let _fromDate = moment().startOf("day").toDate(),
        _toDate = moment().endOf("day").toDate()
    if (type === "yesterday") {
        _fromDate = moment().subtract(1, "d").startOf("day").toDate()
        _toDate = moment().subtract(1, "d").endOf("day").toDate()
    } else if (type === "current_week") {
        _fromDate = moment().startOf("week").toDate()
        _toDate = moment().endOf("week").toDate()
    } else if (type === "current_month") {
        _fromDate = moment().startOf("month").toDate()
        _toDate = moment().endOf("month").toDate()
    } else if (type === "current_year") {
        _fromDate = moment().startOf("year").toDate()
        _toDate = moment().endOf("year").toDate()
    } else if (type === "custom") {
        _fromDate = moment(fromDate).startOf("day").toDate()
        _toDate = moment(toDate).endOf("day").toDate()
    }
    return {_fromDate, _toDate}
}
module.exports = {
    generateDateRange
}