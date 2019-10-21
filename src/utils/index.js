import moment from 'moment'

export const getFilteredBookedAppoinments = (items) => {
  return items.filter(data => 
    data.status === 'confirmed' &&
    (new Date(data.start.dateTime).getUTCDay() !== 0 && 
    new Date(data.start.dateTime).getUTCDay() !== 6 )
    && (moment(data.start.dateTime).utc().hours() > 8 
    && moment(data.start.dateTime).utc().hours() < 20))
}