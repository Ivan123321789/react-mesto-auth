import React from 'react';
import {useState, useEffect} from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupEditProfile from './PopupEditProfile';
import PopupAddPlace from './PopupAddPlace';
import PopupEditAvatar from './PopupEditAvatar';
import avatar from '../images/profile-photo.jpg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import {api} from '../utils/Api';



function App() {

  const [currentUser, setCurrentUser] = useState({name: "Юрий Гагарин", about: "Первый человек в космосе", avatar: avatar});
  const [cards, setCards] = useState([]);

  const [isPopupEditProfileOpen, setIsPopupEditProfileOpen] = useState(false);
  const handleEditProfileClick = () => {
    setIsPopupEditProfileOpen(true);
  }

  const [isPopupAddPlaceOpen, setIsPopupAddPlaceOpen] = useState(false);
  const handleAddPlaceClick = () => {
    setIsPopupAddPlaceOpen(true);
  }

  const [isPopupEditAvatarOpen, setIsPopupEditAvatarOpen] = useState(false);  
  const handleEditAvatarClick = () => {
    setIsPopupEditAvatarOpen(true); 
  }

  const [selectedCard, setSelectedCard] = useState(null);
  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const [isLoading, setIsLoading] = useState(false);

  const isOpen = isPopupEditAvatarOpen || isPopupEditProfileOpen || isPopupAddPlaceOpen || selectedCard
  
  function handleLikeClick(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api.deleteCardApi(card._id)
    .then((res) => {
      setCards((state) => state.filter((c) => c._id !== card._id))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally (() => setIsLoading(false));
  }

  function closeAllPopups() {
    setIsPopupEditAvatarOpen(false);
    setIsPopupEditProfileOpen(false);
    setIsPopupAddPlaceOpen(false);
    setSelectedCard(null); 
  }

  function handleEditProfile(data) {
    setIsLoading(true);
    api.changeProfile(data)
    .then ((newUserInfo) => {
      console.log(newUserInfo);
      setCurrentUser(newUserInfo);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally (() => setIsLoading(false));
  }

  function handleEditAvatar(data) {
    setIsLoading(true);
    api.changeAvatar(data)
    .then ((newUserInfo) => {
      setCurrentUser(newUserInfo);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally (() => setIsLoading(false));
  }

  function handleAddPlace(data) {
    setIsLoading(true);
    api.postCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally (() => setIsLoading(false));
  }
  
  useEffect(() => {
    Promise.all([api.getUser(), api.getCards()])
    .then(([userInfo, cards]) => {
      setCurrentUser(userInfo);
      setCards(cards);    
    })
    .catch((err) => {
      console.log('Ошибка. Запрос не выполнен');
    });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header />
        <Main 
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onLikeClick={handleLikeClick}
          onTrashClick={handleCardDelete}
          cards={cards}
        />
        <Footer />
        <PopupEditProfile
          isLoading={isLoading}
          isOpen={isPopupEditProfileOpen}
          onClose={closeAllPopups}
          onEditProfile={handleEditProfile}
        />
        <PopupAddPlace
          isLoading={isLoading} 
          isOpen={isPopupAddPlaceOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />
        <PopupEditAvatar 
          isLoading={isLoading}
          isOpen={isPopupEditAvatarOpen}
          onClose={closeAllPopups}
          onEditAvatar={handleEditAvatar}
        />                    
        <ImagePopup 
          card={selectedCard}
          onClose={closeAllPopups}
        />
            
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
