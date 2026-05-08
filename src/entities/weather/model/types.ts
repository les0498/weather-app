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
};
