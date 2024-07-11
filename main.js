const API_KEY = `32edf3a924aa466aa0c04340e74dcec2`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));

const getLatestNews = async () => {
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log("News List:", newsList);
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    console.log("category", category);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log("ddd", data);
    newsList = data.articles;
    render();
};

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

const getNewsByKeyword = async () => {
    const keyword = document.getElementById("search-input").value;
    console.log("keyword", keyword);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log("keyword", data);
    newsList = data.articles
    render();
};

const handleResize = () => {
    if (window.innerWidth <= 768) {
        search.style.display = 'none';
    } else {
        search.style.display = 'flex';
    }
};

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

const render = () => {
    const newsHTML = newsList.map(news => {
        const truncatedDescription = truncateText(news.description || '내용없음', 200);
        const imageUrl = news.urlToImage || './path/to/default-image.png'; // 기본 이미지를 사용할 경로로 수정하세요
        return `<div class="row news pt-3 pb-3">
            <div class="col-lg-4">
                <img class="news-img-size"
                    src="${imageUrl}"
                    alt="news image">
            </div>
            <div class="col-lg-8 mt-2">
                <h2>${news.title}</h2>
                <p>
                    ${truncatedDescription}
                </p>
                <div>
                   ${news.source.name || 'no source'} * ${new Date(news.publishedAt).toLocaleString()}
                </div>
            </div>
        </div>`;
    }).join("");

    document.getElementById('news-board').innerHTML = newsHTML;
};

getLatestNews();
