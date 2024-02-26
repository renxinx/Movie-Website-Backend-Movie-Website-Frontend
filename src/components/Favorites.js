import { useState, useEffect, useCallback } from 'react';
import "./favorites.css";
import FavoriteDataService from "../services/favorites.js";
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DnDCard } from './DnDCard';
import Container from 'react-bootstrap/Container';

const Favorites = ({
  user,
  setFavorites,
  favorites,
//   reorderFavorite,
//   getFavorite,
//   FavoritesList
}) => {
  const [cards, setCards] = useState([])

  const getFavorite = useCallback(() => {
    if (user) {
      FavoriteDataService.getFavoriteMovies(user.googleId)
        .then(repsonse => {
          setCards(repsonse.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [user]);

  const reorderFavorite = useCallback(() => {
    let rank = [];
    for (var i = 0; i < cards.length; i++) {
      rank[i] = cards[i]._id;
    };
    setFavorites(rank);
  }, [cards, setFavorites]);

  useEffect(() => {
    getFavorite();
  }, [getFavorite]);

  useEffect(() => {
    reorderFavorite();
  }, [reorderFavorite]);

  const FavoritesList = () => {
      const moveCard = useCallback((id, index) => {
        setCards((cards) => update(cards, {
            $splice: [
              [id, 1],
              [index, 0, cards[id]],
            ],
          }),
        );
      }, [])
    return (
      <div>
        {cards.map((card, index) => (
          <DnDCard
            id={card._id}
            index={index}
            title={card.title}
            poster={card.poster}
            moveCard={moveCard}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='App'>
      <Container className="favoritesContainer">
      <div className="favoritesPanel">
            {
            favorites.length < 1 ?
              "You haven't saved any favorites so far"
                :
              "Drag your favorites to rank them"
          }
      </div>
      <DndProvider backend={HTML5Backend}>
        <FavoritesList />
      </DndProvider>
      </Container>
    </div>
  )

}   

export default Favorites;