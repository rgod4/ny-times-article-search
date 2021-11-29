// Defining a baseURL and key to as part of the request URL

const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = 'omWzfc2BGpS20PfbCTWB6eaVUOGbF1qd';
let url;

// Grab references to all the DOM elements you'll need to manipulate

const searchField = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const form = document.querySelector('form');

const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');

const section = document.querySelector('section');
const nav = document.querySelector('nav');

// define the initial page number and status of the navigation being displayed
let pageNumber = 0;

function submitSearch(e) {
    pageNumber = 0;
    fetchResults(e);
}

function fetchResults(e) {
    e.preventDefault();
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchField.value + '&fq=document_type:("article")';
    if (startDate.value !== '')
        url += '&start=' + startDate.value;
    if (endDate.value !== '')
        url += '&end=' + endDate.value;
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        displayResults(json);
    }).catch(function (e) {
        console.log(e);
    });
}

function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    let articles = json.response.docs;

    if (articles.length == 0) {
        const para = document.createElement('p');
        para.textContent = 'No results found.'
        section.appendChild(para);
    }
    if (articles.length === 10)
        nav.style.display = 'block';
    else
        nav.style.display = 'none';

    for (let i = 0; i < articles.length; i++) {
        const article = document.createElement('article');
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        const img = document.createElement('img');
        const abstract = document.createElement('p');
        const keywords = document.createElement('p');

        let content = articles[i];

        link.textContent = content.headline.main;
        link.href = content.web_url;
        if (content.multimedia.length > 0) {
            img.src = "https://www.nytimes.com/" + content.multimedia[0].url;
            img.alt = link.textContent;
        }
        keywords.textContent = "Keyword:";
        const br = document.createElement("br");
        keywords.appendChild(br);
        abstract.textContent = content.snippet;
        for (let j = 0; j < content.keywords.length; j++) {
            const span = document.createElement("span");
            span.textContent = content.keywords[j].value;
            keywords.appendChild(span);
        }
        heading.appendChild(link);
        article.appendChild(heading);
        article.appendChild(img);
        article.appendChild(abstract);
        article.appendChild(keywords);
        section.appendChild(article);
    }
}

function nextPage(e) {
    pageNumber++;
    fetchResults(e);
}
function prevPage(e) {
    if (pageNumber > 0) {
        pageNumber--;
        fetchResults(e);
    }
}

form.addEventListener("submit", submitSearch);
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", prevPage)


