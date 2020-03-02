from __future__ import print_function
import datetime
import pickle
import os.path
import sys
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']


def main():
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('src/creds/token.pickle'):
        with open('src/creds/token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'src/creds/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('src/creds/token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API
    userPreferences = getBeforeAfterDates()
    events_result = service.events().list(calendarId='primary',
                                          timeMin=userPreferences[1],
                                          timeMax=userPreferences[0],
                                          maxResults=userPreferences[2],
                                          singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])
    new_date = ""
    print('<option selected value="">Events loaded</option>')
    if not events:
        print('No upcoming events found.')
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        new_date = reformat(start)
        print(new_date, event['summary'], "</option>")


def reformat(date_time):
    ''' Formats given date to Mon 1, Year e.g. Jan 1, 2020 '''
    year = date_time[:4]
    month = int(date_time[5:7])
    day = int(date_time[8:10])
    new_time = date_time[11:16]

    dateOption = getMonth(month) + " " + str(day) + ", " + year + " " \
        + new_time + ":00"

    return '<option value="' + dateOption + '">'


def getMonth(m):
    switcher = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Nov',
        11: 'Oct',
        12: 'Dec'
    }
    return switcher.get(m, "Invaild month")


def getBeforeAfterDates():
    now = datetime.datetime.utcnow()
    future = int(sys.argv[1])
    past = int(sys.argv[2]) * -1
    maxRes = int(sys.argv[3])

    fDate = now + datetime.timedelta(days=future)
    fDate = fDate.isoformat('T') + 'Z'
    pDate = now + datetime.timedelta(days=past)
    pDate = pDate.isoformat('T') + 'Z'
    results = []
    results.append(fDate)
    results.append(pDate)
    results.append(maxRes)
    return results


if __name__ == '__main__':
    main()