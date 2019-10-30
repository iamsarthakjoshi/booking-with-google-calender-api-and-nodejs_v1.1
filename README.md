## Appointment Scheduling Nodes.js Backend
Appointment Scheduling with Google Calender API and Node JS

#### Demo:
> https://drive.google.com/open?id=1uOs53fzj0K4JadflYu-HjRHHpGLevwiK

#### Install Dependencies:
> npm install

#### Start server:
> npm start

#### Change Google Calender API Credentials in __.env__ file
> .env

#### Port Used, change in __.env__ file
> port used currently: 8081

### Requirements:

- All appointments are __40 minutes__ long and have __fixed times__, starting from 9–9:40 am
- Ensure there is always a __5 minutes break__ in between each appointment
- Appointments can only be booked during __weekdays__ from __9 am to 6 pm__
- Bookings can only be made at least __24 hours in advance__
- Appointments cannot be booked in the past
- For simplicity, use __UTC time__ for all bookings and days and __ISO 8601__ format for timeslots 


### Endpoints:

#### GET bookable days
Requires a year and month. Note that months __must not be zero-indexed__.

> __GET__  /days?year=yyyy&month=mm

Returns an array of all days in the specified month, each of which has the field _hasTimeSlots_, which is _false_ if there are no time slots available, based on the requirements listed above.

```
{
  "success": true,
  "days": [
    { "day": 1,  "hasTimeSlots": false },
    ...
    { "day": 31, "hasTimeSlots": true }
  ]
}
```

#### GET available time slots

Requires a year, month, and day.

> __GET__  /timeslots?year=yyyy&month=mm&day=dd

Returns a list of all 40-minute time slots available for that day as an array of objects that contain a _startTime_ and _endTime_ in __ISO 8601__ format.

```
{
  "success": true,
  "timeSlots": [
    {
      "startTime": "2019-09-04T09:00:00.000Z",
        "endTime": "2019-09-04T09:40:00.000Z"
    },
    {
      "startTime": "2019-09-04T09:45:00.000Z",
        "endTime": "2019-09-04T10:25:00.000Z"
    },
    ...
  ]
}
```

#### POST book an appointment

Requires a year, month, day, hour, and minute.

> __POST__  /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm

Returns a boolean field _success_. If the booking was successful, also return _startTime_ and _endTime_.

If not successful, return a _message_, a string for the error message.

```
// Success
{
    "success": true,
  "startTime": "2019-09-04T10:30:00.000Z",
    "endTime": "2019-09-04T11:10:00.000Z"
}

// Fail
{
    "success": false,
    "message": "Invalid time slot"
}
```

#### Error messages for this POST request are:

- _Invalid time slot_: The time slot provided was not one of the time slots returned in the GET available time slots request
- _Cannot book with less than 24 hours in advance_
- _Cannot book outside bookable timeframe_: The time slot provided was not on a weekday between 9 am and 5 pm
- _Cannot book time in the past_

Error messages for ALL endpoints should be in this format:

```
{
    "success": false,
    "message": "Invalid time slot"
}
```

Where _message_ contains the corresponding error message, such as _Request is missing parameter: year_
