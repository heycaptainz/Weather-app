// store/favoritesContext.js
import { createContext, useState, useContext } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (city) => {
    setFavorites((prevFavorites) => [...prevFavorites, city]);
  };

  const removeFavorite = (city) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav !== city)
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
