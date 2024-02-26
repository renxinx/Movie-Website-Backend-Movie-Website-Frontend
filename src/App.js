import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Login from './components/Login';
import Logout from './components/Logout';

import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import AddReview from "./components/AddReview";
import Favorites from './components/Favorites';
import FavoriteDataService from './services/favorites';

import "./App.css";
import {gapi} from "gapi-script";
// import { response } from 'express';

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const retrieveFavorites = useCallback(() => {
    FavoriteDataService.getAll(user.googleId)
    .then(response => {
      setFavorites(response.data.favorites);
    })
    .catch(e => {
      console.log(e);
    });
  }, [user]);

  const saveFavorites = useCallback(() => {
    var data = {
      _id: user.googleId,
      favorites: favorites
    }

    FavoriteDataService.updateFavoritesList(data)
    .catch(e => {
      console.log(e);
    })
  }, [favorites, user]);

  useEffect(() => {
    if (user){
      saveFavorites();
    }
  },[user, favorites, saveFavorites]);

  useEffect(() => {
    if (user) {
      retrieveFavorites();
    }
  }, [user, retrieveFavorites]);

  const addFavorite = (movieId) => {
    setFavorites([...favorites, movieId])
  }

  const deleteFavorite = (movieId) => {
    setFavorites(favorites.filter(f => f !== movieId));
  }

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "930396857920-f5d3tuq4jc22ajlh89qs69svbhsbkr0s.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

  window.gapi.load('client:auth2', () => {
    window.gapi.client.init({
        clientId: '930396857920-f5d3tuq4jc22ajlh89qs69svbhsbkr0s.apps.googleusercontent.com',
        plugin_name: "chat"
    })
  })

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        setUser(loginData);
      } else {
        localStorage.setItem("login", null);
      }
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
    <div className="App">
      <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
        <Container className="container-fluid">
        <Navbar.Brand className="brand" href="/">
          <img src='/images/movies-logo.png' alt="movies logo" className="moviesLogo"/>
          MOVIE TIME
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav" >
          <Nav className="ml-auto">
            <Nav.Link as={Link} to={"/movies"}>
              Movies
            </Nav.Link>
            {
              user &&
              <Nav.Link as={Link}  to={"/favorites"}>
                Favorites
              </Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
        { user ? (
                <Logout setUser={setUser} />
              ) : (
                <Login setUser={setUser} />
              )}
        </Container>
      </Navbar>

      <Routes>
        <Route exact path={"/"} element={
          <MoviesList 
            user = {user}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
            favorites={favorites}
          />
        }
          />
        <Route exact path={"/movies"} element={
          <MoviesList 
            user = {user}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
            favorites={favorites}
          />
        }
          />
        <Route exact path={"/favorites"} element={
          <Favorites 
            user={ user } 
            setFavorites = { setFavorites }
            favorites = { favorites }
          />}
        />
        <Route path={"/movies/:id/"} element={
          <Movie user={ user }/>
        }
          />
        <Route path={"/movies/:id/review"} element = {
          <AddReview user = { user } />
        }
          />
      </Routes>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
