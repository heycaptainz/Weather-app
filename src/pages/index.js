"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaSpinner,
  FaBookmark,
} from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";

const CityTable = ({ initialCities }) => {
  const [cities, setCities] = useState(initialCities);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkDropdownOpen, setBookmarkDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCities();
  }, [search, page, sortKey, sortOrder]);

  useEffect(() => {
    loadBookmarks();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCurrentWeather(latitude, longitude);
          setLocationAvailable(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationAvailable(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationAvailable(false);
    }
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${search}&sort=${sortKey}&rows=50&start=${
          (page - 1) * 50
        }`
      );
      const data = await res.json();
      setCities(data.records);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
    setLoading(false);
  };

  const fetchCurrentWeather = async (lat, lon) => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.API_KEY}`;

    try {
      const { data } = await axios.get(currentWeatherUrl);
      setCurrentWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortKey(key);
      setSortOrder("ASC");
    }
    setPage(1);
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return <FaSort />;
    return sortOrder === "ASC" ? <FaSortUp /> : <FaSortDown />;
  };

  const toggleBookmark = (city) => {
    const updatedBookmarks = bookmarks.find((b) => b.recordid === city.recordid)
      ? bookmarks.filter((b) => b.recordid !== city.recordid)
      : [...bookmarks, city];

    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  const loadBookmarks = () => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(storedBookmarks);
  };

  const toggleBookmarkDropdown = () => {
    setBookmarkDropdownOpen(!bookmarkDropdownOpen);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="heading">Weather Forecast Website</h1>

      <div className="flex mb-4 border border-gray-300 rounded p-2">
        <input
          type="text"
          placeholder="Search cities..."
          value={search}
          onChange={handleSearchChange}
          className="flex-grow outline-none"
        />
        {loading ? (
          <FaSpinner size={20} className="mr-2 animate-spin text-gray-500" />
        ) : search ? (
          <IoIosCloseCircle
            size={20}
            className="mr-2 text-gray-500 cursor-pointer"
            onClick={() => setSearch("")}
          />
        ) : (
          <FaSearch size={20} className="mr-2 text-gray-500" />
        )}
      </div>

      <div class="relative">
        <div>
          <button
            type="button"
            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={toggleBookmarkDropdown}
          >
            Bookmarked Cities
            <svg
              class="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        {bookmarkDropdownOpen && (
          <div className="absolute bg-white shadow-lg rounded mt-2 p-4 w-64 z-10">
            {bookmarks.length > 0 ? (
              bookmarks.map((city) => (
                <div
                  key={city.recordid}
                  className="p-2 m-2 border border-gray-300 rounded flex justify-between items-center"
                >
                  <Link href={`/weather/${city.fields.coordinates}`}>
                    {city.fields.name}
                  </Link>
                  <IoIosCloseCircle
                    size={20}
                    className="ml-2 text-red-500 cursor-pointer"
                    onClick={() => toggleBookmark(city)}
                  />
                </div>
              ))
            ) : (
              <div>No bookmarks added.</div>
            )}
          </div>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("fields.name")}
              className="cursor-pointer p-2 border-b"
            >
              City {renderSortIcon("fields.name")}
            </th>
            <th
              onClick={() => handleSort("fields.cou_name_en")}
              className="cursor-pointer p-2 border-b"
            >
              Country {renderSortIcon("fields.cou_name_en")}
            </th>
            <th
              onClick={() => handleSort("fields.timezone")}
              className="cursor-pointer p-2 border-b"
            >
              Timezone {renderSortIcon("fields.timezone")}
            </th>
            <th className="p-2 border-b">Weather View</th>
            <th className="p-2 border-b">Bookmark</th>
          </tr>
        </thead>
        <tbody>
          {cities?.map((city) => (
            <tr
              key={city.recordid}
              className="border-b hover:bg-gray-100"
              onClick={() => setSelectedCity(city)}
            >
              <td className="p-2">
                <Link href={`/weather/${city.fields.coordinates}`}>
                  {city.fields.name}
                </Link>
              </td>
              <td className="p-2">{city.fields.cou_name_en}</td>
              <td className="p-2">{city.fields.timezone}</td>
              <td className="p-2">
                <Link href={`/weather/${city.fields.coordinates}`}>View</Link>
              </td>
              <td className="p-2">
                <FaBookmark
                  className={`cursor-pointer ${
                    bookmarks.find((b) => b.recordid === city.recordid)
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    toggleBookmark(city);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="flex justify-center mt-4">
          <FaSpinner className="animate-spin text-gray-500" size={24} />
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(
    `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&rows=50&sort=name`
  );
  const data = await res.json();
  return {
    props: {
      initialCities: data.records,
    },
  };
}

export default CityTable;
