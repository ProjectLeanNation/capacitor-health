# capacitor-health

Capacitor plugin to query data from Apple Health and Google Health Connect

## Thanks and attribution

Some parts, concepts and ideas are borrowed from [cordova-plugin-health](https://github.com/dariosalvi78/cordova-plugin-health/). Big thanks to [@dariosalvi78](https://github.com/dariosalvi78) for the support.

## Install

```bash
npm install capacitor-health
npx cap sync
```

## Setup

### iOS

* Make sure your app id has the 'HealthKit' entitlement when this plugin is installed (see iOS dev center).
* Also, make sure your app and App Store description comply with the Apple review guidelines.
* There are two keys to be added to the info.plist file: NSHealthShareUsageDescription and NSHealthUpdateUsageDescription. 

### Android

* Android Manifest in application tag
```xml
        <!-- For supported versions through Android 13, create an activity to show the rationale
    of Health Connect permissions once users click the privacy policy link. -->
        <activity
            android:name="com.fit_up.health.capacitor.PermissionsRationaleActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
            </intent-filter>
        </activity>

        <!-- For versions starting Android 14, create an activity alias to show the rationale
         of Health Connect permissions once users click the privacy policy link. -->
        <activity-alias
            android:name="ViewPermissionUsageActivity"
            android:exported="true"
            android:targetActivity="com.fit_up.health.capacitor.PermissionsRationaleActivity"
            android:permission="android.permission.START_VIEW_PERMISSION_USAGE">
            <intent-filter>
                <action android:name="android.intent.action.VIEW_PERMISSION_USAGE" />
                <category android:name="android.intent.category.HEALTH_PERMISSIONS" />
            </intent-filter>
        </activity-alias>
```

* Android Manifest in root tag
```xml
    <queries>
        <package android:name="com.google.android.apps.healthdata" />
    </queries>
    
    <uses-permission android:name="android.permission.health.READ_STEPS" />
    <uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED" />
    <uses-permission android:name="android.permission.health.READ_DISTANCE" />
    <uses-permission android:name="android.permission.health.READ_EXERCISE" />
    <uses-permission android:name="android.permission.health.READ_EXERCISE_ROUTE" />
    <uses-permission android:name="android.permission.health.READ_HEART_RATE" />
    <uses-permission android:name="android.permission.health.READ_BODY_FAT" />
    <uses-permission android:name="android.permission.health.READ_LEAN_BODY_MASS" />
```

Skeletal muscle mass is not supported: neither Apple HealthKit nor Google Health Connect exposes a native data type for it, so this plugin does not sync that metric.

## API

<docgen-index>

* [`isHealthAvailable()`](#ishealthavailable)
* [`checkHealthPermissions(...)`](#checkhealthpermissions)
* [`requestHealthPermissions(...)`](#requesthealthpermissions)
* [`openAppleHealthSettings()`](#openapplehealthsettings)
* [`openHealthConnectSettings()`](#openhealthconnectsettings)
* [`showHealthConnectInPlayStore()`](#showhealthconnectinplaystore)
* [`queryAggregated(...)`](#queryaggregated)
* [`queryWorkouts(...)`](#queryworkouts)
* [`querySleepData(...)`](#querysleepdata)
* [`queryHeight()`](#queryheight)
* [`queryWeight()`](#queryweight)
* [`queryBodyFatPercentage()`](#querybodyfatpercentage)
* [`queryLeanBodyMass()`](#queryleanbodymass)
* [`queryBodyTemperature()`](#querybodytemperature)
* [`queryHeartRate(...)`](#queryheartrate)
* [`startSleepObserver()`](#startsleepobserver)
* [`stopSleepObserver()`](#stopsleepobserver)
* [`addListener('sleepDataUpdated', ...)`](#addlistenersleepdataupdated-)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### isHealthAvailable()

```typescript
isHealthAvailable() => Promise<{ available: boolean; }>
```

Checks if health API is available.
Android: If false is returned, the Google Health Connect app is probably not installed.
See showHealthConnectInPlayStore()

**Returns:** <code>Promise&lt;{ available: boolean; }&gt;</code>

--------------------


### checkHealthPermissions(...)

```typescript
checkHealthPermissions(permissions: PermissionsRequest) => Promise<PermissionResponse>
```

Android only: Returns for each given permission, if it was granted by the underlying health API

| Param             | Type                                                              | Description          |
| ----------------- | ----------------------------------------------------------------- | -------------------- |
| **`permissions`** | <code><a href="#permissionsrequest">PermissionsRequest</a></code> | permissions to query |

**Returns:** <code>Promise&lt;<a href="#permissionresponse">PermissionResponse</a>&gt;</code>

--------------------


### requestHealthPermissions(...)

```typescript
requestHealthPermissions(permissions: PermissionsRequest) => Promise<PermissionResponse>
```

Requests the permissions from the user.

Android: Apps can ask only a few times for permissions, after that the user has to grant them manually in
the Health Connect app. See openHealthConnectSettings()

iOS: If the permissions are already granted or denied, this method will just return without asking the user. In iOS
we can't really detect if a user granted or denied a permission. The return value reflects the assumption that all
permissions were granted.

| Param             | Type                                                              | Description            |
| ----------------- | ----------------------------------------------------------------- | ---------------------- |
| **`permissions`** | <code><a href="#permissionsrequest">PermissionsRequest</a></code> | permissions to request |

**Returns:** <code>Promise&lt;<a href="#permissionresponse">PermissionResponse</a>&gt;</code>

--------------------


### openAppleHealthSettings()

```typescript
openAppleHealthSettings() => Promise<void>
```

Opens the apps settings, which is kind of wrong, because health permissions are configured under:
Settings &gt; Apps &gt; (Apple) Health &gt; Access and Devices &gt; [app-name]
But we can't go there directly.

--------------------


### openHealthConnectSettings()

```typescript
openHealthConnectSettings() => Promise<void>
```

Opens the Google Health Connect app

--------------------


### showHealthConnectInPlayStore()

```typescript
showHealthConnectInPlayStore() => Promise<void>
```

Opens the Google Health Connect app in PlayStore

--------------------


### queryAggregated(...)

```typescript
queryAggregated(request: QueryAggregatedRequest) => Promise<QueryAggregatedResponse>
```

Query aggregated data

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`request`** | <code><a href="#queryaggregatedrequest">QueryAggregatedRequest</a></code> |

**Returns:** <code>Promise&lt;<a href="#queryaggregatedresponse">QueryAggregatedResponse</a>&gt;</code>

--------------------


### queryWorkouts(...)

```typescript
queryWorkouts(request: QueryWorkoutRequest) => Promise<QueryWorkoutResponse>
```

Query exercise / workout sessions from Apple Health or Google Health Connect.
Returns a cross-platform normalized schema (ISO8601 dates, seconds, meters, kcal,
and unified SCREAMING_SNAKE exercise types).

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`request`** | <code><a href="#queryworkoutrequest">QueryWorkoutRequest</a></code> |

**Returns:** <code>Promise&lt;<a href="#queryworkoutresponse">QueryWorkoutResponse</a>&gt;</code>

--------------------


### querySleepData(...)

```typescript
querySleepData(request: QuerySleepRequest) => Promise<QuerySleepResponse>
```

Query sleep data

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`request`** | <code><a href="#querysleeprequest">QuerySleepRequest</a></code> |

**Returns:** <code>Promise&lt;<a href="#querysleepresponse">QuerySleepResponse</a>&gt;</code>

--------------------


### queryHeight()

```typescript
queryHeight() => Promise<HeightData>
```

Query height data

**Returns:** <code>Promise&lt;<a href="#heightdata">HeightData</a>&gt;</code>

--------------------


### queryWeight()

```typescript
queryWeight() => Promise<WeightData>
```

Query weight data

**Returns:** <code>Promise&lt;<a href="#weightdata">WeightData</a>&gt;</code>

--------------------


### queryBodyFatPercentage()

```typescript
queryBodyFatPercentage() => Promise<BodyFatPercentageData>
```

Query latest body fat percentage (0–100)

**Returns:** <code>Promise&lt;<a href="#bodyfatpercentagedata">BodyFatPercentageData</a>&gt;</code>

--------------------


### queryLeanBodyMass()

```typescript
queryLeanBodyMass() => Promise<LeanBodyMassData>
```

Query latest lean body mass in kilograms

**Returns:** <code>Promise&lt;<a href="#leanbodymassdata">LeanBodyMassData</a>&gt;</code>

--------------------


### queryBodyTemperature()

```typescript
queryBodyTemperature() => Promise<BodyTemperatureData>
```

Query body temperature data

**Returns:** <code>Promise&lt;<a href="#bodytemperaturedata">BodyTemperatureData</a>&gt;</code>

**Since:** 0.0.1

--------------------


### queryHeartRate(...)

```typescript
queryHeartRate(request: QueryHeartRateRequest) => Promise<QueryHeartRateResponse>
```

Query heart rate data directly (not tied to a workout)

| Param         | Type                                                                    | Description         |
| ------------- | ----------------------------------------------------------------------- | ------------------- |
| **`request`** | <code><a href="#queryheartraterequest">QueryHeartRateRequest</a></code> | date range to query |

**Returns:** <code>Promise&lt;<a href="#queryheartrateresponse">QueryHeartRateResponse</a>&gt;</code>

--------------------


### startSleepObserver()

```typescript
startSleepObserver() => Promise<void>
```

iOS only: Starts an HKObserverQuery for sleep data with background delivery enabled.
When new sleep data is written (e.g. after waking up), the plugin fires a
'sleepDataUpdated' event with the latest sleep sessions from the past 48 hours.
Call requestHealthPermissions with READ_SLEEP before starting the observer.

--------------------


### stopSleepObserver()

```typescript
stopSleepObserver() => Promise<void>
```

iOS only: Stops the background sleep observer query.

--------------------


### addListener('sleepDataUpdated', ...)

```typescript
addListener(eventName: 'sleepDataUpdated', listenerFunc: (event: SleepUpdateEvent) => void) => Promise<{ remove: () => Promise<void>; }>
```

Listen for plugin events (e.g. 'sleepDataUpdated').

| Param              | Type                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'sleepDataUpdated'</code>                                                   |
| **`listenerFunc`** | <code>(event: <a href="#sleepupdateevent">SleepUpdateEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;{ remove: () =&gt; Promise&lt;void&gt;; }&gt;</code>

--------------------


### Interfaces


#### PermissionResponse

| Prop              | Type                                       |
| ----------------- | ------------------------------------------ |
| **`permissions`** | <code>{ [key: string]: boolean; }[]</code> |


#### PermissionsRequest

| Prop              | Type                            |
| ----------------- | ------------------------------- |
| **`permissions`** | <code>HealthPermission[]</code> |


#### QueryAggregatedResponse

| Prop                 | Type                            |
| -------------------- | ------------------------------- |
| **`aggregatedData`** | <code>AggregatedSample[]</code> |


#### AggregatedSample

| Prop            | Type                |
| --------------- | ------------------- |
| **`startDate`** | <code>string</code> |
| **`endDate`**   | <code>string</code> |
| **`value`**     | <code>number</code> |


#### QueryAggregatedRequest

| Prop            | Type                                                       |
| --------------- | ---------------------------------------------------------- |
| **`startDate`** | <code>string</code>                                        |
| **`endDate`**   | <code>string</code>                                        |
| **`dataType`**  | <code>'steps' \| 'active-calories' \| 'mindfulness'</code> |
| **`bucket`**    | <code>string</code>                                        |


#### QueryWorkoutResponse

| Prop           | Type                   |
| -------------- | ---------------------- |
| **`workouts`** | <code>Workout[]</code> |


#### Workout

Cross-platform exercise / workout session.
Units: duration = seconds, distance = meters, calories = kilocalories.
Dates are ISO8601 strings.

| Prop                 | Type                                                  | Description                                                    |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| **`id`**             | <code>string</code>                                   | Platform record id when available                              |
| **`startDate`**      | <code>string</code>                                   | ISO8601 start                                                  |
| **`endDate`**        | <code>string</code>                                   | ISO8601 end                                                    |
| **`workoutType`**    | <code><a href="#exercisetype">ExerciseType</a></code> | Normalized exercise type (same vocabulary on iOS and Android)  |
| **`title`**          | <code>string</code>                                   | Optional session title (Android / Health Connect when present) |
| **`sourceName`**     | <code>string</code>                                   |                                                                |
| **`sourceBundleId`** | <code>string</code>                                   |                                                                |
| **`duration`**       | <code>number</code>                                   | Duration in seconds                                            |
| **`distance`**       | <code>number</code>                                   | Distance in meters                                             |
| **`steps`**          | <code>number</code>                                   | Step count for the session window                              |
| **`calories`**       | <code>number</code>                                   | Energy burned in kilocalories (0 when unavailable)             |
| **`route`**          | <code>RouteSample[]</code>                            |                                                                |
| **`heartRate`**      | <code>HeartRateSample[]</code>                        |                                                                |


#### RouteSample

| Prop            | Type                | Description       |
| --------------- | ------------------- | ----------------- |
| **`timestamp`** | <code>string</code> | ISO8601 timestamp |
| **`lat`**       | <code>number</code> |                   |
| **`lng`**       | <code>number</code> |                   |
| **`alt`**       | <code>number</code> |                   |


#### HeartRateSample

| Prop            | Type                | Description       |
| --------------- | ------------------- | ----------------- |
| **`timestamp`** | <code>string</code> | ISO8601 timestamp |
| **`bpm`**       | <code>number</code> |                   |


#### QueryWorkoutRequest

| Prop                   | Type                 | Description                                                    |
| ---------------------- | -------------------- | -------------------------------------------------------------- |
| **`startDate`**        | <code>string</code>  | ISO8601 start date                                             |
| **`endDate`**          | <code>string</code>  | ISO8601 end date                                               |
| **`includeHeartRate`** | <code>boolean</code> | Include heart-rate samples within each session (default false) |
| **`includeRoute`**     | <code>boolean</code> | Include GPS route samples when available (default false)       |
| **`includeSteps`**     | <code>boolean</code> | Include step count for the session window (default false)      |


#### QuerySleepResponse

| Prop                | Type                        |
| ------------------- | --------------------------- |
| **`sleepSessions`** | <code>SleepSession[]</code> |


#### SleepSession

| Prop                 | Type                      |
| -------------------- | ------------------------- |
| **`id`**             | <code>string</code>       |
| **`startDate`**      | <code>string</code>       |
| **`endDate`**        | <code>string</code>       |
| **`sourceName`**     | <code>string</code>       |
| **`sourceBundleId`** | <code>string</code>       |
| **`title`**          | <code>string</code>       |
| **`duration`**       | <code>number</code>       |
| **`stages`**         | <code>SleepStage[]</code> |
| **`timeInBed`**      | <code>number</code>       |
| **`sleepTime`**      | <code>number</code>       |
| **`deepSleepTime`**  | <code>number</code>       |
| **`remSleepTime`**   | <code>number</code>       |
| **`lightSleepTime`** | <code>number</code>       |
| **`awakeTime`**      | <code>number</code>       |


#### SleepStage

| Prop            | Type                |
| --------------- | ------------------- |
| **`startDate`** | <code>string</code> |
| **`endDate`**   | <code>string</code> |
| **`stage`**     | <code>string</code> |
| **`duration`**  | <code>number</code> |


#### QuerySleepRequest

| Prop            | Type                |
| --------------- | ------------------- |
| **`startDate`** | <code>string</code> |
| **`endDate`**   | <code>string</code> |


#### HeightData

| Prop            | Type                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **`height`**    | <code>number \| null</code>                                                                        |
| **`timestamp`** | <code>string \| null</code>                                                                        |
| **`metadata`**  | <code>{ id: string; lastModifiedTime: string; clientRecordId: string; dataOrigin: string; }</code> |


#### WeightData

| Prop            | Type                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **`weight`**    | <code>number \| null</code>                                                                        |
| **`timestamp`** | <code>string \| null</code>                                                                        |
| **`metadata`**  | <code>{ id: string; lastModifiedTime: string; clientRecordId: string; dataOrigin: string; }</code> |


#### BodyFatPercentageData

| Prop             | Type                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| **`percentage`** | <code>number \| null</code>                                                                        |
| **`timestamp`**  | <code>string \| null</code>                                                                        |
| **`metadata`**   | <code>{ id: string; lastModifiedTime: string; clientRecordId: string; dataOrigin: string; }</code> |


#### LeanBodyMassData

| Prop            | Type                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **`mass`**      | <code>number \| null</code>                                                                        |
| **`timestamp`** | <code>string \| null</code>                                                                        |
| **`metadata`**  | <code>{ id: string; lastModifiedTime: string; clientRecordId: string; dataOrigin: string; }</code> |


#### BodyTemperatureData

| Prop              | Type                                                                                               | Description                       |
| ----------------- | -------------------------------------------------------------------------------------------------- | --------------------------------- |
| **`temperature`** | <code>number</code>                                                                                | Body temperature value in celsius |
| **`timestamp`**   | <code>string</code>                                                                                | ISO8601 timestamp                 |
| **`metadata`**    | <code>{ id: string; lastModifiedTime: string; clientRecordId: string; dataOrigin: string; }</code> | Metadata about the measurement    |


#### QueryHeartRateResponse

| Prop                   | Type                           |
| ---------------------- | ------------------------------ |
| **`heartRateSamples`** | <code>HeartRateSample[]</code> |


#### QueryHeartRateRequest

| Prop            | Type                |
| --------------- | ------------------- |
| **`startDate`** | <code>string</code> |
| **`endDate`**   | <code>string</code> |


#### SleepUpdateEvent

| Prop                | Type                        |
| ------------------- | --------------------------- |
| **`sleepSessions`** | <code>SleepSession[]</code> |


### Type Aliases


#### HealthPermission

<code>'READ_STEPS' | 'READ_WORKOUTS' | 'READ_ACTIVE_CALORIES' | 'READ_TOTAL_CALORIES' | 'READ_DISTANCE' | 'READ_HEART_RATE' | 'READ_ROUTE' | 'READ_MINDFULNESS' | 'READ_SLEEP' | 'READ_BODY_TEMPERATURE' | 'READ_HEIGHT' | 'READ_WEIGHT' | 'READ_BODY_FAT_PERCENTAGE' | 'READ_LEAN_BODY_MASS'</code>


#### ExerciseType

Normalized exercise type shared by iOS (HealthKit) and Android (Health Connect).
Platform-specific activities are mapped to the closest shared value.

<code>'AMERICAN_FOOTBALL' | 'ARCHERY' | 'AUSTRALIAN_FOOTBALL' | 'BADMINTON' | 'BARRE' | 'BASEBALL' | 'BASKETBALL' | 'BIKING' | 'BIKING_STATIONARY' | 'BOOT_CAMP' | 'BOWLING' | 'BOXING' | 'CALISTHENICS' | 'COOLDOWN' | 'CORE_TRAINING' | 'CRICKET' | 'CROSS_COUNTRY_SKIING' | 'CURLING' | 'DANCING' | 'ELLIPTICAL' | 'EQUESTRIAN' | 'EXERCISE_CLASS' | 'FENCING' | 'FISHING' | 'FITNESS_GAMING' | 'FRISBEE_DISC' | 'GOLF' | 'GUIDED_BREATHING' | 'GYMNASTICS' | 'HANDBALL' | 'HAND_CYCLING' | 'HIGH_INTENSITY_INTERVAL_TRAINING' | 'HIKING' | 'HUNTING' | 'ICE_HOCKEY' | 'ICE_SKATING' | 'JUMP_ROPE' | 'KICKBOXING' | 'LACROSSE' | 'MARTIAL_ARTS' | 'MIXED_CARDIO' | 'OTHER' | 'PADDLING' | 'PARAGLIDING' | 'PICKLEBALL' | 'PILATES' | 'RACQUETBALL' | 'ROCK_CLIMBING' | 'ROLLER_HOCKEY' | 'ROWING' | 'ROWING_MACHINE' | 'RUGBY' | 'RUNNING' | 'RUNNING_TREADMILL' | 'SAILING' | 'SCUBA_DIVING' | 'SKATING' | 'SKIING' | 'SNOWBOARDING' | 'SNOWSHOEING' | 'SOCCER' | 'SOFTBALL' | 'SQUASH' | 'STAIR_CLIMBING' | 'STAIR_CLIMBING_MACHINE' | 'STEP_TRAINING' | 'STRENGTH_TRAINING' | 'STRETCHING' | 'SURFING' | 'SWIMMING' | 'SWIMMING_OPEN_WATER' | 'SWIMMING_POOL' | 'SWIM_BIKE_RUN' | 'TABLE_TENNIS' | 'TAI_CHI' | 'TENNIS' | 'TRACK_AND_FIELD' | 'TRANSITION' | 'VOLLEYBALL' | 'WALKING' | 'WATER_FITNESS' | 'WATER_POLO' | 'WATER_SPORTS' | 'WEIGHTLIFTING' | 'WHEELCHAIR' | 'WRESTLING' | 'YOGA'</code>

</docgen-api>
