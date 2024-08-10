import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiRain,
  WiDayRain,
  WiNightAltRain,
} from "react-icons/wi";
import { IoMdArrowRoundBack } from "react-icons/io";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function Weather({ currentData, forecastData }) {
  const [data, setData] = useState(currentData);
  const [forecast, setForecast] = useState(forecastData);
  const [currentTime, setCurrentTime] = useState("");

  // console.log(forecast);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // const getTimeOfDay = (date) => {
  //   const hours = new Date(date * 1000).getHours();
  //   if (hours >= 5 && hours < 12) {
  //     return "morning";
  //   } else if (hours >= 12 && hours < 17) {
  //     return "afternoon";
  //   } else if (hours >= 17 && hours < 20) {
  //     return "evening";
  //   } else {
  //     return "night";
  //   }
  // };

  const getAggregatedForecast = () => {
    const dailyForecast = {};

    forecast?.list?.forEach((item) => {
      const date = moment(item.dt * 1000).format("YYYY-MM-DD");
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temps: [],
          weather: item.weather[0],
        };
      }
      dailyForecast[date].temps.push(item.main.temp);
    });

    return Object.keys(dailyForecast).map((date) => {
      const { temps, weather } = dailyForecast[date];
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      return {
        date,
        avgTemp: avgTemp.toFixed(),
        weather,
      };
    });
  };

  const aggregatedForecast = getAggregatedForecast();

  const renderWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
        return <WiDaySunny size={100} />;
      case "01n":
        return <WiNightClear size={100} />;
      case "02d":
      case "03d":
      case "04d":
        return <WiDayCloudy size={100} />;
      case "02n":
      case "03n":
      case "04n":
        return <WiNightAltCloudy size={100} />;
      case "09d":
      case "10d":
        return <WiDayRain size={100} />;
      case "09n":
      case "10n":
        return <WiNightAltRain size={100} />;
      case "11d":
      case "11n":
        return <WiRain size={100} />;
      default:
        return null;
    }
  };

  const getIconColor = (weatherMain) => {
    if (weatherMain === "Rain") {
      return "#00f"; // Blue for rain
    } else if (weatherMain === "Clouds") {
      return "#888"; // Gray for clouds
    } else if (weatherMain === "Clear") {
      return "#ff0"; // Yellow for clear sky
    } else if (weatherMain === "Sun") {
      return "#f90"; // Orange for sun
    }
    return "#000"; // Default black
  };

  const getBackgroundImage = (weatherMain, height = 350, width = 400) => {
    if (weatherMain === "Rain") {
      return (
        <Image
          src="/Rain.jpg"
          width={width}
          height={height}
          alt="Weather-Image"
          priority={true}
        />
      );
    } else if (weatherMain === "Clouds") {
      return (
        <Image
          src="/Cloud.jpeg"
          width={width}
          height={height}
          alt="Weather-Image"
          priority={true}
        />
      );
    } else if (weatherMain === "Clear") {
      return (
        <Image
          src="/Clear.png"
          width={width}
          height={height}
          alt="Weather-Image"
          priority={true}
        />
      );
    } else if (weatherMain === "Sun") {
      return (
        <Image
          src="/Sunny.png"
          width={width}
          height={height}
          alt="Weather-Image"
          priority={true}
        />
      );
    }
    return (
      <Image
        src="/Default-img.jpg"
        width={width}
        height={height}
        alt="Weather-Image"
        priority={true}
      />
    );
  };

  return (
    <div className="app min-h-screen flex items-center justify-center">
      <div className="container bg-white shadow-md rounded-lg p-6">
        {/* Current Weather */}
        <Link href="/">
          <IoMdArrowRoundBack size={20} className="mr-2 text-gray-500" />
        </Link>
        <div className="top text-center mb-4">
          <div className="location text-xl font-semibold">
            <p>
              {data.name}, {data.sys?.country}
            </p>
          </div>
          <div className="time text-lg font-medium">
            <p>{currentTime}</p>
          </div>
          <div className="temp text-5xl font-bold">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description text-lg">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
          <div className="weather-icon-container">
            {data.weather ? (
              <div
                style={{ color: getIconColor(data.weather[0].main) }}
                className="text-center"
              >
                <div>{getBackgroundImage(data.weather[0].main, 200, 1280)}</div>
                {renderWeatherIcon(data.weather[0].icon)}
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Section */}
        {data.name !== undefined && (
          <div className="bottom grid grid-cols-3 gap-4 text-center">
            <div className="feels">
              {data.main ? (
                <p className="bold text-2xl font-bold">
                  {data.main.feels_like.toFixed()}°C
                </p>
              ) : null}
              <p className="text-sm">Feels Like</p>
            </div>

            <div className="humidity">
              {data.main ? (
                <p className="bold text-2xl font-bold">{data.main.humidity}%</p>
              ) : null}
              <p className="text-sm">Humidity</p>
            </div>

            <div className="wind">
              {data.wind ? (
                <p className="bold text-2xl font-bold">
                  {data.wind.speed.toFixed()} MPH
                </p>
              ) : null}
              <p className="text-sm">Wind Speed</p>
            </div>

            <div className="feels">
              {data.main ? (
                <p className="bold text-2xl font-bold">
                  {data.main.temp_min.toFixed()}°C
                </p>
              ) : null}
              <p className="text-sm">Temperature-Min</p>
            </div>

            <div className="feels">
              {data.main ? (
                <p className="bold text-2xl font-bold">
                  {data.main.temp_max.toFixed()}°C
                </p>
              ) : null}
              <p className="text-sm">Temperature-Max</p>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        <div className="forecast mt-6">
          <h2 className="text-2xl font-bold text-center">
            More Five-Days Forecast Weather.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {aggregatedForecast.map((item) => (
              <div
                key={item.date}
                className="forecast-item bg-white shadow-md rounded-lg p-4 text-center"
              >
                <div>{getBackgroundImage(item.weather.main)}</div>
                <p className="text-lg font-semibold">
                  {moment(item.date).format("ddd, MMM D")}
                </p>
                {item.weather && (
                  <div style={{ color: getIconColor(item.weather.main) }}>
                    {renderWeatherIcon(item.weather.icon)}
                  </div>
                )}
                <p className="text-xl font-bold">{item.avgTemp}°C</p>
                <p className="text-sm">{item.weather.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const coods = context.params.coods[0].split(",");
  const location =
    coods.length > 0 ? `lat=${coods[0]}&lon=${coods[1]}` : "lat=35&lon=139"; // Default location if not provided
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?${location}&units=metric&appid=${process.env.API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${location}&units=metric&appid=${process.env.API_KEY}`;
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl),
    ]);

    return {
      props: {
        currentData: currentResponse.data,
        forecastData: forecastResponse.data,
      },
    };
  } catch (error) {
    return {
      props: {
        currentData: null,
        forecastData: null,
      },
    };
  }
}
