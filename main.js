const API_KEY = `32edf3a924aa466aa0c04340e74dcec2`

const getLatestNews = () => {
    const url = new URL(`https://popvibe.netlify.app/top-headlines?country=us&apiKey=${API_KEY}`);
    console.log(url);
    const response = fetch(url);
};

getLatestNews();