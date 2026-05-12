export type OpenWeatherResponse = {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

export type WeatherSummary = {
  locationName: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
  hourlyTemps: HourlyTemperature[];

  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
};

export type ForecastResponse = {
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
};

export type HourlyTemperature = {
  time: string;
  temp: number;

  icon: string;
  description: string;
};

export type GeocodingResponse = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}[];
