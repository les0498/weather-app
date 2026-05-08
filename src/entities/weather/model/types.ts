export type OpenWeatherResponse = {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
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
};

export type ForecastResponse = {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
  }[];
};

export type HourlyTemperature = {
  time: string;
  temp: number;
};

export type GeocodingResponse = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}[];
