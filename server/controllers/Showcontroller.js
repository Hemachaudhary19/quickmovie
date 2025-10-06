import axios from "axios";
import Movie from "../configs/models/Movie.js";
import Show from "../configs/models/Show.js";

// API to get now-playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`
    );

    const movies = data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.log("Error fetching now-playing movies:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to add new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    // Check if movie already exists in DB
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details and credits from TMDB
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`)
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres.map(g => g.name), // store genre names
        casts: movieCreditsData.cast.slice(0, 10).map(c => c.name), // top 10 cast names
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime
      };

      // Add movie to database
      movie = await Movie.create(movieDetails);
    }

    // Prepare show documents
    const showsToCreate = [];
    showsInput.forEach(show => {
      const showDate = show.date;
      show.time.forEach(time => {
        // Ensure full ISO string for JS Date
        const dateTimeString = `${showDate}T${time}:00`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show added successfully" });

  } catch (error) {
    console.log("Error adding show:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to get all shows from the database 
export const getShows = async (req,res)=>{
  try{
const shows = await Show.find({showDateTime: {$gte:new Date()}}).populate('movie').sort({showDateTime:1});
//filter unique shows 

const uniqueShows  = new Set (shows.map(show=>show.movie))
res.json({success:true , shows:Array.from(uniqueShows)})
  }catch(error){
  console.log(error);
  res.json({success: false, message:error.message})
  }
}
//API to get a single show from the database 
export const getShow = async (res,req)=>{
  try{
const {movieId} = req.params;
// get all upcoming shows 
const shows = await  Show.find({movie : movieId,showDateTime:{$gte:new Date()}})
const movie = await Movie.findById(movieId);
const dateTime ={};
shows.forEach((show)=>{
  const  date = show.showDateTime.toISOString().split("T")[0];
  if(!dateTime[date]){
    dateTime[date]=[]
  }
  dateTime[date].push({time: show.showDateTime, showId:show._id})
})
res.json({success:true,movie,dateTime})
  }catch(error){
      console.log(error);
  res.json({success: false, message:error.message})
  }
}
