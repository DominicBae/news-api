const API_KEY = `32edf3a924aa466aa0c04340e74dcec2`;
let news = [];

const getLatestNews = async () => {
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log("dddd", news);
};

getLatestNews();

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-btn');
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const search = document.querySelector('.search');

hamburger.addEventListener('click', () => {
    sidebar.style.width = '250px';
});

closeBtn.addEventListener('click', () => {
    sidebar.style.width = '0';
});

searchIcon.addEventListener('click', () => {
    if (searchBar.classList.contains('show')) {
        searchBar.classList.remove('show');
    } else {
        searchBar.classList.add('show');
    }
});

const handleResize = () => {
    if (window.innerWidth <= 768) {
        search.style.display = 'none';
    } else {
        search.style.display = 'flex';
    }
};

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);
