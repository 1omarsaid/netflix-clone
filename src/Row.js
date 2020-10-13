import React, { useState, useEffect} from 'react'
import "./Row.css"
import axios from "./axios"
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer"
import { Button } from "@material-ui/core"

const base_url = "https://image.tmdb.org/t/p/original/";
 
function Row({ title, fetchUrl, isLargeRow }) {

    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("");
    const [showM, setShowModal] = useState(false);
    const [movie, setMovie] = useState([]);
    // const movie = []
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            return request
        }
        fetchData();
    }, [fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay:1
        }
    }

    const Modal = ({ handleClose, show }) => {
        const showHideClassName = show ? "modal display-block" : "modal display-none";
        return (
          <div className={showHideClassName}>
            <div className="modal-main">
                <div className="modal__left">
                    <h1 className="modal__title">{movie.original_title || movie.original_name}</h1>
                    <p className="modal__overview">{movie.overview}</p>
                    <div className="modal__breaker"/>
                    <h3 className="modal__medium">Release Date: {movie.release_date}</h3>
                    <h4 className="modal__small">Rating: {movie.vote_average}/10</h4>
                    <h4 className="modal_small">Adult Content: {movie.adult ? "true" : "false"}</h4>
                    <Button 
                        onClick={handleClose}
                        variant="outlined"
                        className="modal__close">
                        close
                    </Button>
                </div>
                <img 
                    className="modal__picture"
                    src={`${base_url}${movie.poster_path}`} alt={movie.backdrop_path} />
            
              
            </div>
          </div>
        );
      };

    const showModal = () => {
        setShowModal(true)
    };
    
    const hideModal = () => {
        setShowModal(false)
    };

    const handleClick = (movie) => {
        if(isLargeRow){
            if(trailerUrl) {
                setTrailerUrl('');
            }
            else {
                movieTrailer(movie?.name || "")
                .then(url => {
                    const urlParams = new URLSearchParams( new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                }).catch(err => {
                    setMovie(movie)
                    showModal()
                    console.log(err)})
            }
        }else{
            setMovie(movie)
            showModal()
        } 
        
    }
    
    return (
        <div className="row">
            <h2>{title}</h2>
            <Modal show={showM} handleClose={hideModal}>
                <p>Modal</p>
                <p>Data</p>
            </Modal>
            <div className="row__posters">
                {movies.map(movie => {
                    return movie.backdrop_path && (
                    <img 
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.backdrop_path} />)
                })}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
