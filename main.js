let category = "";
let keyword = "";
const API_KEY = "32edf3a924aa466aa0c04340e74dcec2";
let newsList = [];
let totalResult = 0;
let page = 1;
const pageSize = 10;
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`); 

// UI 작동
let navBarIcon = document.querySelector(".nav-bar-icon");
let navBar = document.querySelector(".nav-bar");
let xMark = document.querySelector(".x-mark");
let searchContainer = document.querySelector(".search-container");
let articleContainer = document.querySelector("#news-board");
let menuButton = document.querySelectorAll(".nav-bar button");
let inputArea = document.querySelector(".input-area");
let searchButton = document.querySelector(".search-button");

searchButton.addEventListener("click", setKeywords);

// 검색창 비우기
inputArea.addEventListener("focus", function () { inputArea.value = "" })

// Enter 키를 감지하여 검색 함수 호출
inputArea.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    setKeywords();
  }
});

function searchIconActivate() {
  searchContainer.classList.toggle("active");
}

function navBarActivate() {
  navBar.classList.toggle('active');
  navBar.style.animation = "SlideIn 0.3s ease-in-out";
}

function navBarDeActivate() {
  navBar.style.animation = "SlideOut 0.3s ease-in-out";
  navBar.addEventListener("animationend", handleAnimationEnd);
}

function handleAnimationEnd() {
  navBar.classList.toggle('active');
  navBar.removeEventListener("animationend", handleAnimationEnd)
}

// API 조작
const getNews = async() => {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
}

const getLatestNews = async () => {
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&pageSize=${pageSize}&page=${page}${category}${keyword}&apiKey=${API_KEY}`); 
  getNews();
};


function render() {
  const resultHTML = newsList?.map(news => {
    let title = news.title;
    if (title && title.length > 40) {
      title = title.substring(0, 40) + " ...";
    }

    let description = news.description;
    if (description && description.length > 200) {
      description = description.substring(0, 200) + " ...";
    } else if (!description) {
      description = "내용 없음";
    }

    let urlToImage = news.urlToImage;
    if (!urlToImage) {
      urlToImage = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"; // 기본 이미지 URL
    }

    let nameSource = news.source.name;
    if (!nameSource) {
      nameSource = "출처 없음";
    }

    let author = news.author;
    if (!author) {
      author = "작성자 미기재";
    }

    return `
      <div class="row article">
        <div class="col-lg-4 article-img">
          <img class="img-content" src=${urlToImage} alt="news image" onerror="this.src='https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';">
        </div>
        <div class="col-lg-8 article-main">
          <div class="title-content">
            <h2 class="article-title">${title}</h2>
            <p class="article-content">${description}</p>
          </div>
          <div class="article-info">
            ${nameSource} | ${author} | ${moment(news.publishedAt).fromNow()}
          </div>
        </div>
      </div>`;
  }).join('');

  articleContainer.innerHTML = resultHTML;
}

const errorRender = (message) => {
  const errorHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>`;
  articleContainer.innerHTML = errorHTML;
}

function setCategory(cat) {
  category = `&category=${cat}`;
  getLatestNews();
}

async function setKeywords() {
  keyword = `&q=${inputArea.value}`;
  inputArea.value = "";
  getLatestNews();
}

getLatestNews();
