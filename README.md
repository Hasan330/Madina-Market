## EntryPoint 
` npm start `

## TODOs:

### User Features:

#### Functionality:
 - Add upper limit for coins to be used
 - Add shift-metadata  (username, credentials, shiftPeriod, Date)
 - Add segments for daily Cash purchases and settlements (support positive and negative)
 - Add segments for total ILS, total JOD and total USD
 - Add segments for Wataniya and Jawwal + Cards

#### Technicalities:
1) Add data persistence (Firebase)
2) Add routing
3) Add UI


### Admin Features: 
##### Authentication !!

#### Initial Process:
1) Add POS value
2) Calculate difference between POS and Actual


#### Final Calculations:
1) Retrieve data for certain period 
2) Return detailed amount for each currency note (200 --> 13, ...)  {NOTE: Calculate JD and USD in average}
3) Return total for each day
4) retrun total for entire period

5) Add UI for entering received money amounts 
   - Calculates total recieved

6) Calculate difference between totalReceived and total for entire period