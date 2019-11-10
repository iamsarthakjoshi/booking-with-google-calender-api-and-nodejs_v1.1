## Appointment Scheduling Nodes.js Backend
Appointment Scheduling with Google Calender API and Node JS

#### Change Configurations in __.env.sample__ file (Important step!!!)
First off, please configure Google Calender API credentials, Port no. inside .env.sample file
then change the name of .env.sample file to .env using below command (for linux and unix), or vice-versa.
> mv .env.sample .env

#### For example:
> Before Config

```
PORT = <PUT YOUR PORT NO>

GOOGLE_CLIENT_ID = <PUT YOUR GOOGLE CLIENT ID>
GOOGLE_CLIENT_SECRET = <PUT YOUR GOOGLE CLIENT SECRET>
GOOGLE_REDIRECT_END_POINT = <PUT YOUR GOOGLE REDIRECT ENDPOINT>
GOOGLE_REDIRECT_URI = <PUT YOUR GOOGLE OAUTH REDIRECT URI>
GOOGLE_CALENDAR_ID = <PUT YOUR GOOGLE CALENDAR ID>
```

> After Config

```
PORT = 8081

GOOGLE_CLIENT_ID = 200692833635-6diasdfasdfc15fhuphe8jnq76ldcjttq32.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = RssSmuC2lHqcjGId1FB8FYJs
GOOGLE_REDIRECT_END_POINT = /oauth/callback
GOOGLE_REDIRECT_URI = https://quickstart-1569289058700.appspot.com
GOOGLE_CALENDAR_ID = 15suli79te2e0qfd53sdddd8q4g@group.calendar.google.com
```

__Please leave other configuration as it is!__

#### For you own GCP, OAuth and Calendar API (OAuth Approach)

For __Authorized redirect URIs__, we use combination of __GOOGLE_REDIRECT_URI + GOOGLE_REDIRECT_END_POINT__ (from the .env file), that would be, for example,

``` 	https://quickstart-1569289058700.appspot.com/oauth/callback ```

If you have your own redirect point on your GCP, please update __GOOGLE_REDIRECT_END_POINT__ with your own redirect end-point for example,

``` https://youGooleGCPAppEngine.url.com/youOwnRedirect/EndPoint ```

For __GOOGLE_CALENDAR_ID__, just use your own Google Calendar's ID.
 
So, in .env file, the final configuration should look something similar like below,

```
PORT = 8081

GOOGLE_CLIENT_ID = 200692833635-6diasdfasdfc15fhuphe8jnq76ldcjttq32.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = RssSmuC2lHqcjGId1FB8FYJs
GOOGLE_REDIRECT_END_POINT = /youOwnRedirect/EndPoint
GOOGLE_REDIRECT_URI = https://youGooleGCPAppEngine.url.com
GOOGLE_CALENDAR_ID = 15suli79te2e0qfd53sdddd8q4g@group.calendar.google.com
GOOGLE_CALENDAR_SCOPE = https://www.googleapis.com/auth/calendar
GOOGLE_TOKEN_ACCESS_TYPE = offline

START_OF_DAY = 00:01:00
END_OF_DAY = 23:59:00

START_TIME = 09:00:00
END_TIME = 18:00:00

APPOINTMENT_DURATION = 40
APPOINTMENT_INTERVAL = 5

TIME_FORMAT = HH:mm:ss

NODE_PATH = ./src
NODE_ENV: production
```

#### Points to be noted (Other Important Instructions)
- As per the requirement, I have tested the app features in UTC timezone.
- __Please do not forget to put your Google Calender's timezone to UTC.__
- Every time you start the app, the time zone is set to UTC.
   For example, as you can see below, start script from package.json file 
``` "start": "TZ=utc node -r dotenv/config dist/server.js" ```
- DO NOT forget to make your Google Calender publicly accessable if you want to use other gmail-id to access the calender. You can easily change this under your Calender Setting Options.
- You have to allow every access to google oauth consent to make booking and fetching timeslots.

#### Install Dependencies: (I prefer Yarn personally)
> yarn install

#### Start server in Production mode:
> yarn start

#### Start server in Development mode with nodemon:
> yarn dev

#### Make app production ready:
> yarn build && yarn serve

#### Google Cloud Platform end-point URLs
##### __Days__ 
> https://quickstart-1569289058700.appspot.com/days?year=YYYY&month=MM

``` eg: https://quickstart-1569289058700.appspot.com/days?year=2019&month=11 ```

##### __Timeslots__ 
> https://quickstart-1569289058700.appspot.com/timeslots?year=YYYY&month=MM&day=DD

``` eg: https://quickstart-1569289058700.appspot.com/timeslots?year=2019&month=11&day=29 ```

##### __Booking__ 
> https://quickstart-1569289058700.appspot.com/book?year=YYYY&month=MM&day=DD&hour=HH&minute=MM

``` eg: https://quickstart-1569289058700.appspot.com/book?year=2019&month=11&day=29&hour=14&minute=15 ```

#### About the logger
- Only error and warn level of logs are logged in file called logs.log, however, all level of logs can be traced at console.


#### Thank you! :)


### Given Requirements:

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
