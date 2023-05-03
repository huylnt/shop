import moment from "moment/moment"

const convertToLocaleDateString = (raw) => {
     const date = new Date(raw)
     const options = { year: 'numeric', month: 'long', day: 'numeric' };
     const dateString = date.toLocaleDateString('en-US', options);
     return dateString
}

const convertToValidDateFormat = (dateString) => {
     const time = '00:00:00'
     const appendedDateStringWithTime = `${dateString}T${time}.000Z`
     return appendedDateStringWithTime
}

const convertToCurrency = (countryCurrencyCode, number) => {
     if (!number) return
     number = number.toLocaleString('it-IT', { style: 'currency', currency: countryCurrencyCode })
     return number
}

const getWeekStartDateAndEndDate = () => {
     var currentDate = moment()

     var weekStart = currentDate.clone().startOf('isoWeek')
     var weekEnd = currentDate.clone().endOf('isoWeek')

     weekStart = (moment(weekStart, 'DD.MM.YYYY H:mm:ss')).toISOString()
     weekEnd = (moment(weekEnd, 'DD.MM.YYYY H:mm:ss')).toISOString()
     
     return {
          startDate: weekStart,
          endDate: weekEnd
     }
}

const getMonthStartDateAndEndDate = () => {
     var currentDate = moment()

     var monthStart = currentDate.clone().startOf('month')
     var monthEnd = currentDate.clone().endOf('month')

     monthStart = (moment(monthStart, 'DD.MM.YYYY H:mm:ss')).toISOString()
     monthEnd = (moment(monthEnd, 'DD.MM.YYYY H:mm:ss')).toISOString()
     
     return {
          startDate: monthStart,
          endDate: monthEnd
     }
}

const getYearStartDateAndEndDate = () => {
     var currentDate = moment()

     var yearStart = currentDate.clone().startOf('year')
     var yearEnd = currentDate.clone().endOf('year')

     yearStart = (moment(yearStart, 'DD.MM.YYYY H:mm:ss')).toISOString()
     yearEnd = (moment(yearEnd, 'DD.MM.YYYY H:mm:ss')).toISOString()
     
     return {
          startDate: yearStart,
          endDate: yearEnd
     }
}


export { convertToCurrency, convertToLocaleDateString, convertToValidDateFormat, getWeekStartDateAndEndDate, getMonthStartDateAndEndDate, getYearStartDateAndEndDate }