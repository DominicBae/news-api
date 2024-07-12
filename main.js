let category = "";
let keyword = "";
const API_KEY = "10941bbbe8284718a639d2bfb6df1fcc";
let newsList = [];
let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
let totalPageC;

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
const getLatestNews = async () => {
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${pageSize}&page=${page}${category}${keyword}`); 

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length == 0) {
        throw new Error("No result for this search.");
      }
      newsList = data.articles;
      totalResult = data.totalResults;
      render();
      paginationRender();
      console.log("cate", newsList);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
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
      urlToImage = "'./images/imgnotavailable.png'";
    }

    let nameSource = news.source.name;
    if (!nameSource) {
      nameSource = "출처 없음";
    }

    let author = news.author;
    if (!author) {
      author = "기자 정보 없음";
    }

    return `
      <div class="row article">
        <div class="col-lg-4 article-img">
          <img class="img-content" src=${urlToImage} alt="news image">
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
  if (inputArea.value === "") {
    alert("검색할 내용을 입력해주세요.");
    return;
  }
  keyword = `&q=${inputArea.value}`;
  inputArea.value = "";
  getLatestNews();
}

function paginationRender() {
  const totalPage = Math.ceil(totalResult / pageSize);
  totalPageC = totalPage;
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  if (lastPage % 5 !== 0) {
    firstPage = lastPage - 5;
    if (firstPage <= 0) {
      firstPage = 1;
    }
  }

  let paginationHTML = "";

  if (totalPage > groupSize && pageGroup !== 1) {
    paginationHTML += `
      <li class="page-item ${pageGroup === 1 ? 'disabled' : ''}"><a class="page-link" onclick="moveNextPage('f')"><<</a></li>
      <li class="page-item ${page === 1 ? 'disabled' : ''}"><a class="page-link" onclick="moveNextPage('-')"><</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  if (totalPage > groupSize && firstPage !== totalPage - groupSize + 1) {
    paginationHTML += `
      <li class="page-item ${page === totalPage ? 'disabled' : ''}"><a class="page-link" onclick="moveNextPage('+')">></a></li>
      <li class="page-item ${(totalPage - groupSize + 1) <= page && totalPage >= page ? 'disabled' : ''}"><a class="page-link" onclick="moveNextPage('l')">>></a></li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
}

function moveToPage(pageNum) {
  page = pageNum;
  getLatestNews();
}

function moveNextPage(next) {
  if (next === '-') {
    page--;
  } else if (next === '+') {
    page++;
  } else if (next === 'f') {
    page = 1;
  } else if (next === 'l') {
    page = totalPageC - groupSize + 1;
  }
  getLatestNews();
}

getLatestNews();
paginationRender();
