export const API_KEY = '4ddf49e73410d99796b5b864968477b4';
export const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  media_type: string;
  name: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  original_name: string;
  first_air_date: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
}

export interface IGetMoviesResult {
  dates: {
    maximun: string;
    minimun: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

/******   Movie Page    ******/
export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function PopularMovie() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function TopRatedMovie() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function UpcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

/******   Tv Page    ******/
export function getTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function LatestTv() {
  return fetch(
    `${BASE_PATH}/tv//on_the_air?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function AiringTodayTv() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function PopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

/******   Similar    ******/
export function similarMovies() {
  return fetch(
    `${BASE_PATH}/movie/{movie_id}/similar?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
