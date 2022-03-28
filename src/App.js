/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { format } from 'timeago.js';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {

  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4
  });

  const getPins = async () => {

    try {
      const response = await axios.get('/pins');
      setPins(response.data);
    } catch (error) {
      console.log(error);
    }

  }

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: lng });
  }

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;

    setNewPlace({
      lat, long
    });
  }


  useEffect(() => {
    getPins();
    myStorage.getItem("user") && setCurrentUser(myStorage.getItem("user"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const response = await axios.post('/pins', newPin);
      setPins([...pins, response.data]);
      setNewPlace(null);
      setTitle(null);
      setDesc(null);
      setRating(0);
    } catch (error) {
      console.log(error);
    }

  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
      // transitionDuration='500'
      >
        {pins &&
          pins.map(pin => (
            <>
              <Marker
                latitude={pin.lat}
                longitude={pin.long}
                offsetLeft={-viewport.zoom * 3.5}
                offsetTop={-viewport.zoom * 7}
              >
                <RoomIcon style={{ fontStyle: viewport.zoom * 7, color: pin.username === currentUser ? 'tomato' : 'slateblue', cursor: 'pointer' }} onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)} />
              </Marker>
              {
                pin._id === currentPlaceId && (
                  <Popup
                    latitude={pin.lat}
                    longitude={pin.long}
                    closeButton={true}
                    closeOnClick={false}
                    dynamicPosition={true}
                    onClose={() => { setCurrentPlaceId(null) }}
                    anchor="top"
                  >

                    <div className="card">
                      <label className="label">Place</label>
                      <h4 className="place">{pin.title}</h4>
                      <label className="label">Review</label>
                      <p className='desc'>{pin.desc}</p>
                      <label className="label">Rating</label>
                      <div className="stars">
                        {
                          Array(pin.rating).fill(<StarIcon className='star' />)
                        }

                      </div>
                      <label className="label">Information</label>
                      <span className="username">Created by <b>{pin.username === currentUser ? 'you' : pin.username}</b></span>
                      <span className="date">{format(pin.createdAt)}</span>
                    </div>
                  </Popup>
                )
              }
            </>

          ))
        }
        {
          newPlace && (
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => { setNewPlace(null) }}
              anchor="top"
            >
              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input placeholder="Enter a title" type="text" name="title" id="title" onChange={e => setTitle(e.target.value)} />
                <label htmlFor="review">Review</label>
                <textarea placeholder="Say us something about this place..." id="review" name="review" onChange={e => setDesc(e.target.value)} />
                <label htmlFor="">Rating</label>
                <select name="" id="" onChange={e => setRating(e.target.value)} >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit" >Add Pin</button>
              </form>
            </Popup>
          )
        }
        {
          currentUser ? (
            <button className="button logout" onClick={handleLogout}>Logout</button>
          ) : (
            <div className="buttons">
              <button className="button login" onClick={(e => setShowLogin(true))}>Login</button>
              <button className="button register" onClick={(e => setShowRegister(true))}>Register</button>
            </div>
          )
        }
        {showRegister && <Register show={setShowRegister} />}
        {showLogin && <Login show={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
      </ReactMapGL>
    </div>
  );
}

// <RoomIcon style={{fontSize:4*7, color:"slateblue"}}/>
export default App;