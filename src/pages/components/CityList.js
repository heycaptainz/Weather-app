// components/CityList.js
import { useFavorites } from '../store/favoritesContext';

const CityList = ({ cities }) => {
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  const handleFavoriteToggle = (city) => {
    if (favorites.includes(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  };

  return (
    <div>
      {cities.map((city) => (
        <div key={city}>
          <span>{city}</span>
          <button onClick={() => handleFavoriteToggle(city)}>
            {favorites.includes(city) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CityList;
