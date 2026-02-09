import React, { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import "../css/pages/HomePage.css";
import { useSelector } from "react-redux";
import axios from "axios";
import useAudioPlayer from "../hooks/useAudioPlayer";
import EditProfile from "../components/auth/EditProfile";
import Modal from "../components/common/Modal";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const auth = useSelector((state) => state.auth);


  const songsToDisplay = 
    view === "search" ? searchSongs : 
    view === "favourite" ? (auth.user?.favourites || []) : 
    songs;

  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  } = useAudioPlayer(songsToDisplay);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleEnded,
    handleSeek,   
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
  };

  const handleSelectSong = (index) => {
    playSongAtIndex(index);
  };

  const handlePlayFavourite = (song) => {
    const favourites = auth.user?.favourites|| [];
    if (!favourites.length) return;

    const index = favourites.findIndex((fav) => fav.id === song.id);


    setView("home");



    setTimeout(() => {
      if (index !== -1) {
        playSongAtIndex(index);
      }
    }, 10);
  };

  const loadPlaylist = async (tag) => {
    if (!tag) return; 
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`);
      setSongs(res.data.results || []);
    } catch (error) {
      setSongs([]);
    }
  };

  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
        setSongs(res.data.results || []);
      } catch (error) {
        setSongs([]);
      }
    };
    fetchInitialSongs();
  }, []);

  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        {currentSong && <source src={currentSong.audio} type="audio/mpeg" />}
      </audio>

      <div className="homepage-main-wrapper">
        <div className="homepage-sidebar">
          <SideMenu setView={setView} view={view} onOpenEditProfile={() => setOpenEditProfile(true)} />
        </div>

        <div className="homepage-content">
          <MainArea
            view={view}
            currentIndex={currentIndex}
            onSelectSong={handleSelectSong}
            onSelectFavourite={handlePlayFavourite}
            onSelectTag={loadPlaylist}
            songsToDisplay={songsToDisplay}
            setSearchSongs={setSearchSongs}
          />
        </div>
      </div>

      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />
      {openEditProfile && <Modal onClose={()=>setOpenEditProfile(false)}>
        <EditProfile onClose={()=>setOpenEditProfile(false)} /></Modal>}
    </div>
  );
};

export default Homepage;