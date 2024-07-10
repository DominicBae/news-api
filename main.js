const API_KEY = `32edf3a924aa466aa0c04340e74dcec2`
let news = []

const getLatestNews = async () => {
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log("dddd", news);
};

getLatestNews();