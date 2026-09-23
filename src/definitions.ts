export interface HealthPlugin {
  /**
   * Checks if health API is available.
   * Android: If false is returned, the Google Health Connect app is probably not installed.
   * See showHealthConnectInPlayStore()
   *
   */
  isHealthAvailable(): Promise<{ available: boolean }>;

  /**
   * Android only: Returns for each given permission, if it was granted by the underlying health API
   * @param permissions permissions to query
   */
  checkHealthPermissions(permissions: PermissionsRequest): Promise<PermissionResponse>;

  /**
   * Requests the permissions from the user.
   *
   * Android: Apps can ask only a few times for permissions, after that the user has to grant them manually in
   * the Health Connect app. See openHealthConnectSettings()
   *
   * iOS: If the permissions are already granted or denied, this method will just return without asking the user. In iOS
   * we can't really detect if a user granted or denied a permission. The return value reflects the assumption that all
   * permissions were granted.
   *
   * @param permissions permissions to request
   */
  requestHealthPermissions(permissions: PermissionsRequest): Promise<PermissionResponse>;

  /**
   * Opens the apps settings, which is kind of wrong, because health permissions are configured under:
   * Settings > Apps > (Apple) Health > Access and Devices > [app-name]
   * But we can't go there directly.
   */
  openAppleHealthSettings(): Promise<void>;

  /**
   * Opens the Google Health Connect app
   */
  openHealthConnectSettings(): Promise<void>;

  /**
   * Opens the Google Health Connect app in PlayStore
   */
  showHealthConnectInPlayStore(): Promise<void>;

  /**
   * Query aggregated data
   * @param request
   */
  queryAggregated(request: QueryAggregatedRequest): Promise<QueryAggregatedResponse>;

  /**
   * Query exercise / workout sessions from Apple Health or Google Health Connect.
   * Returns a cross-platform normalized schema (ISO8601 dates, seconds, meters, kcal,
   * and unified SCREAMING_SNAKE exercise types).
   * @param request
   */
  queryWorkouts(request: QueryWorkoutRequest): Promise<QueryWorkoutResponse>;

  /**
   * Query sleep data
   * @param request
   */
  querySleepData(request: QuerySleepRequest): Promise<QuerySleepResponse>;

  /**
   * Query height data
   */
  queryHeight(): Promise<HeightData>;

  /**
   * Query latest weight (most recent sample)
   */
  queryWeight(): Promise<WeightData>;

  /**
   * Query weight samples in a date range (ISO8601 start/end).
   */
  queryWeights(request: QueryBodySampleRequest): Promise<QueryWeightsResponse>;

  /**
   * Query latest body fat percentage (0–100)
   */
  queryBodyFatPercentage(): Promise<BodyFatPercentageData>;

  /**
   * Query body fat percentage samples in a date range (ISO8601 start/end).
   * Values are 0–100.
   */
  queryBodyFatPercentages(
    request: QueryBodySampleRequest,
  ): Promise<QueryBodyFatPercentagesResponse>;

  /**
   * Query latest lean body mass in kilograms
   */
  queryLeanBodyMass(): Promise<LeanBodyMassData>;

  /**
   * Query lean body mass samples in a date range (ISO8601 start/end).
   * Values are kilograms.
   */
  queryLeanBodyMasses(
    request: QueryBodySampleRequest,
  ): Promise<QueryLeanBodyMassesResponse>;

  /**
   * Query body temperature data
   * @returns Body temperature data
   * @since 0.0.1
   */
  queryBodyTemperature(): Promise<BodyTemperatureData>;

  /**
   * Query heart rate data directly (not tied to a workout)
   * @param request date range to query
   */
  queryHeartRate(request: QueryHeartRateRequest): Promise<QueryHeartRateResponse>;

  /**
   * iOS only: Starts an HKObserverQuery for sleep data with background delivery enabled.
   * When new sleep data is written (e.g. after waking up), the plugin fires a
   * 'sleepDataUpdated' event with the latest sleep sessions from the past 48 hours.
   * Call requestHealthPermissions with READ_SLEEP before starting the observer.
   */
  startSleepObserver(): Promise<void>;

  /**
   * iOS only: Stops the background sleep observer query.
   */
  stopSleepObserver(): Promise<void>;

  /**
   * Listen for plugin events (e.g. 'sleepDataUpdated').
   */
  addListener(
    eventName: 'sleepDataUpdated',
    listenerFunc: (event: SleepUpdateEvent) => void,
  ): Promise<{ remove: () => Promise<void> }>;
}

export declare type HealthPermission =
  | 'READ_STEPS'
  | 'READ_HEALTH_DATA_HISTORY'
  | 'READ_WORKOUTS'
  | 'READ_ACTIVE_CALORIES'
  | 'READ_TOTAL_CALORIES'
  | 'READ_DISTANCE'
  | 'READ_HEART_RATE'
  | 'READ_ROUTE'
  | 'READ_MINDFULNESS'
  | 'READ_SLEEP'
  | 'READ_BODY_TEMPERATURE'
  | 'READ_HEIGHT'
  | 'READ_WEIGHT'
  | 'READ_BODY_FAT_PERCENTAGE'
  | 'READ_LEAN_BODY_MASS'
  | 'READ_EXERCISE_MINUTES';

export interface PermissionsRequest {
  permissions: HealthPermission[];
}

export interface PermissionResponse {
  permissions: { [key: string]: boolean }[];
}

export interface QueryWorkoutRequest {
  /** ISO8601 start date */
  startDate: string;
  /** ISO8601 end date */
  endDate: string;
  /** Include heart-rate samples within each session (default false) */
  includeHeartRate?: boolean;
  /** Include GPS route samples when available (default false) */
  includeRoute?: boolean;
  /** Include step count for the session window (default false) */
  includeSteps?: boolean;
}

export interface HeartRateSample {
  /** ISO8601 timestamp */
  timestamp: string;
  bpm: number;
}

export interface RouteSample {
  /** ISO8601 timestamp */
  timestamp: string;
  lat: number;
  lng: number;
  alt?: number;
}

export interface QueryWorkoutResponse {
  workouts: Workout[];
}

/**
 * Normalized exercise type shared by iOS (HealthKit) and Android (Health Connect).
 * Platform-specific activities are mapped to the closest shared value.
 */
export type ExerciseType =
  | 'AMERICAN_FOOTBALL'
  | 'ARCHERY'
  | 'AUSTRALIAN_FOOTBALL'
  | 'BADMINTON'
  | 'BARRE'
  | 'BASEBALL'
  | 'BASKETBALL'
  | 'BIKING'
  | 'BIKING_STATIONARY'
  | 'BOOT_CAMP'
  | 'BOWLING'
  | 'BOXING'
  | 'CALISTHENICS'
  | 'COOLDOWN'
  | 'CORE_TRAINING'
  | 'CRICKET'
  | 'CROSS_COUNTRY_SKIING'
  | 'CURLING'
  | 'DANCING'
  | 'ELLIPTICAL'
  | 'EQUESTRIAN'
  | 'EXERCISE_CLASS'
  | 'FENCING'
  | 'FISHING'
  | 'FITNESS_GAMING'
  | 'FRISBEE_DISC'
  | 'GOLF'
  | 'GUIDED_BREATHING'
  | 'GYMNASTICS'
  | 'HANDBALL'
  | 'HAND_CYCLING'
  | 'HIGH_INTENSITY_INTERVAL_TRAINING'
  | 'HIKING'
  | 'HUNTING'
  | 'ICE_HOCKEY'
  | 'ICE_SKATING'
  | 'JUMP_ROPE'
  | 'KICKBOXING'
  | 'LACROSSE'
  | 'MARTIAL_ARTS'
  | 'MIXED_CARDIO'
  | 'OTHER'
  | 'PADDLING'
  | 'PARAGLIDING'
  | 'PICKLEBALL'
  | 'PILATES'
  | 'RACQUETBALL'
  | 'ROCK_CLIMBING'
  | 'ROLLER_HOCKEY'
  | 'ROWING'
  | 'ROWING_MACHINE'
  | 'RUGBY'
  | 'RUNNING'
  | 'RUNNING_TREADMILL'
  | 'SAILING'
  | 'SCUBA_DIVING'
  | 'SKATING'
  | 'SKIING'
  | 'SNOWBOARDING'
  | 'SNOWSHOEING'
  | 'SOCCER'
  | 'SOFTBALL'
  | 'SQUASH'
  | 'STAIR_CLIMBING'
  | 'STAIR_CLIMBING_MACHINE'
  | 'STEP_TRAINING'
  | 'STRENGTH_TRAINING'
  | 'STRETCHING'
  | 'SURFING'
  | 'SWIMMING'
  | 'SWIMMING_OPEN_WATER'
  | 'SWIMMING_POOL'
  | 'SWIM_BIKE_RUN'
  | 'TABLE_TENNIS'
  | 'TAI_CHI'
  | 'TENNIS'
  | 'TRACK_AND_FIELD'
  | 'TRANSITION'
  | 'VOLLEYBALL'
  | 'WALKING'
  | 'WATER_FITNESS'
  | 'WATER_POLO'
  | 'WATER_SPORTS'
  | 'WEIGHTLIFTING'
  | 'WHEELCHAIR'
  | 'WRESTLING'
  | 'YOGA';

/**
 * Cross-platform exercise / workout session.
 * Units: duration = seconds, distance = meters, calories = kilocalories.
 * Dates are ISO8601 strings.
 */
export interface Workout {
  /** Platform record id when available */
  id?: string;
  /** ISO8601 start */
  startDate: string;
  /** ISO8601 end */
  endDate: string;
  /** Normalized exercise type (same vocabulary on iOS and Android) */
  workoutType: ExerciseType;
  /** Optional session title (Android / Health Connect when present) */
  title?: string;
  sourceName: string;
  sourceBundleId: string;
  /** Duration in seconds */
  duration: number;
  /** Distance in meters */
  distance?: number;
  /** Step count for the session window */
  steps?: number;
  /** Energy burned in kilocalories (0 when unavailable) */
  calories: number;
  route?: RouteSample[];
  heartRate?: HeartRateSample[];
}

export interface QueryAggregatedRequest {
  startDate: string;
  endDate: string;
  /**
   * Aggregated metric to query.
   * - `exercise-minutes`: minutes of exercise activity.
   *   iOS uses Apple Exercise Time (Activity ring). Android uses total
   *   Health Connect exercise-session duration converted to minutes.
   *   These are the closest cross-platform equivalents, not identical definitions.
   */
  dataType: 'steps' | 'active-calories' | 'mindfulness' | 'exercise-minutes';
  bucket: string; // "hour" | "day" | "week" (iOS); "hour" | "day" (Android)
}

export interface QueryAggregatedResponse {
  aggregatedData: AggregatedSample[];
}

export interface AggregatedSample {
  startDate: string;
  endDate: string;
  value: number;
}

export interface QuerySleepRequest {
  startDate: string;
  endDate: string;
}

export interface SleepStage {
  startDate: string;
  endDate: string;
  stage: string;
  duration: number;
}

export interface SleepSession {
  id: string;
  startDate: string;
  endDate: string;
  sourceName: string;
  sourceBundleId: string;
  title: string;
  duration: number;
  stages?: SleepStage[];
  timeInBed?: number;
  sleepTime?: number;
  deepSleepTime?: number;
  remSleepTime?: number;
  lightSleepTime?: number;
  awakeTime?: number;
}

export interface QuerySleepResponse {
  sleepSessions: SleepSession[];
}

export interface HeightData {
  height: number | null; // Height in meters
  timestamp: string | null;
  metadata?: {
    id: string;
    lastModifiedTime: string;
    clientRecordId: string;
    dataOrigin: string;
  };
}

export interface WeightData {
  weight: number | null; // Weight in kilograms
  timestamp: string | null;
  metadata?: {
    id: string;
    lastModifiedTime: string;
    clientRecordId: string;
    dataOrigin: string;
  };
}

export interface QueryBodySampleRequest {
  /** ISO8601 start date */
  startDate: string;
  /** ISO8601 end date */
  endDate: string;
}

export interface QueryWeightsResponse {
  samples: WeightData[];
}

export interface BodyFatPercentageData {
  percentage: number | null; // Body fat percentage (0–100)
  timestamp: string | null;
  metadata?: {
    id: string;
    lastModifiedTime: string;
    clientRecordId: string;
    dataOrigin: string;
  };
}

export interface QueryBodyFatPercentagesResponse {
  samples: BodyFatPercentageData[];
}

export interface LeanBodyMassData {
  mass: number | null; // Lean body mass in kilograms
  timestamp: string | null;
  metadata?: {
    id: string;
    lastModifiedTime: string;
    clientRecordId: string;
    dataOrigin: string;
  };
}

export interface QueryLeanBodyMassesResponse {
  samples: LeanBodyMassData[];
}

export interface QueryHeartRateRequest {
  startDate: string;
  endDate: string;
}

export interface QueryHeartRateResponse {
  heartRateSamples: HeartRateSample[];
}

export interface SleepUpdateEvent {
  sleepSessions: SleepSession[];
}

export interface BodyTemperatureData {
  /**
   * Body temperature value in celsius
   */
  temperature: number;
  /**
   * ISO8601 timestamp
   */
  timestamp: string;
  /**
   * Metadata about the measurement
   */
  metadata: {
    id: string;
    lastModifiedTime: string;
    clientRecordId: string;
    dataOrigin: string;
  };
}
