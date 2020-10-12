import React, { useState, useEffect} from 'react'
import "./Row.css"
import axios from "./axios"
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer"

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
            <section className="modal-main">
              {movie.original_title}
              <button onClick={handleClose}>close</button>
            </section>
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
                    return movie.backdrop_path && (<img 
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
