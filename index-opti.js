const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PAGE_NUMBER = 12
// BASE_URL、INDEX_URL 這兩個常數組合在一起就是完整的 Index API URL：https://movie-list.alphacamp.io/api/v1/movies。
// 我們將它拆成兩段，以便之後串 Show API 或圖片檔案時，能重覆使用 BASE_URL，而 POSTER_URL 將被用來處理圖片檔案。
const searchForm = document.querySelector('#search-form')
const serchInput = document.querySelector('#search-input')
const pagenator = document.querySelector('.pagination')
const dataPanel = document.querySelector('#data-panel')
const movieListCardChange = document.querySelector('.list-card-movies')
const submitChange = document.querySelector('#search-submit-button')
const randerFrontPage = document.querySelector('#front-page')
const pageView = document.querySelector('#page-view-number')
const movies = []
let movieSerch = []
let pageNum = 1
let dataSet = 'card'
let movieSerchRecord = movies



function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
      rawHTML += `<div class="mb-2 list-transform">
        <div class="mb-2 ">
          <div class="d-flex justify-content-between">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="d-flex">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-model" data-id="${item.id}" id="More-button">More</button>
              <button class="btn btn-info btn-add-favorite ms-2" data-id='${item.id}'>+</button>
            </div>
          </div>
        </div>
      </div> 
      `
    });
  dataPanel.innerHTML = rawHTML
  }
 


function renderMovieCard(data){
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-model" data-id="${item.id}" id="More-button">More</button>
              <button class="btn btn-info btn-add-favorite" data-id='${item.id}'>+</button>
            </div>
          </div>
        </div>
      </div>  
      `

  })
  dataPanel.innerHTML = rawHTML
}



function rederPagenator(amount) {
  const cardAmount = Math.ceil(amount / MOVIES_PAGE_NUMBER)
  let render = ''
  for (let page = 0; page < cardAmount; page++) {
    render += `<li class="page-item"><a class="page-link" href="#" data-page='${page + 1}'>${page + 1}</a></li>`
  }
  pagenator.innerHTML = render
}
// function rederPagenatorList(amount){
//   const listAmount = Math.ceil(amount / MOVIES_PAGE_NUMBER)
//   let render = ''
//   for (let page = 0; page < listAmount; page++) {
//     render += `<li class="page-item"><a class="page-link" href="#" data-Listpage='${page + 1}'>${page + 1}</a></li>`
//     console.log('cardAmount')
//   }
//   pagenator.innerHTML = render
// }

function MoviePage(pageNumber) {
  // page 1 = 0~11
  // page 2 = 12~23 
  // page 3 = 24~35
  // ...  以此類推
  data = movieSerch.length ? movieSerch : movies
  const movieIndexStart = (pageNumber - 1) * MOVIES_PAGE_NUMBER
  return data.slice(movieIndexStart, movieIndexStart + MOVIES_PAGE_NUMBER)
}




function showPage (page){
  pageView.innerHTML = `<span class="page-view-color">第${page}頁</span>`
}

function madalChange(id) {
  const modalTittle = document.querySelector('.modal-title')
  const image = document.querySelector('#modal-image')
  const tittle = document.querySelector('#movie-modal-tittle')
  const text = document.querySelector('#movie-modal-despription')
  axios
    .get(`${INDEX_URL + id}`)
    .then((response) => {
      console.log(response)
      const lastResult = response.data.results
      image.src = `${POSTER_URL + lastResult.image}`
      modalTittle.innerHTML = lastResult.title
      tittle.innerHTML = `Date : ${lastResult.release_date}`
      text.innerHTML = lastResult.description

    })
    .catch((err) => console.log(err))
}


function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  // localStorage.removeItem('favoriteMovies')
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}



// 以上為涵式--------------------------------------------------------------------------




searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const value = serchInput.value.trim().toLowerCase()
  // 方法二 用 filter 把電影給篩選出來
  movieSerch = movies.filter(number => number.title.toLowerCase().includes(value))
  //測試用
  if (!movieSerch.length){
    rederPagenator(movieSerchRecord.length)
    movieSerch = movieSerchRecord
    return alert('請輸入關鍵字')
  }
 
    
  if (dataSet === 'card') {
    showPage(1)
    rederPagenator(movieSerch.length)
    renderMovieCard(MoviePage(1))
    movieSerchRecord = movieSerch
  } else if (dataSet === 'list') {
    showPage(1)
    rederPagenator(movieSerch.length)
    renderMovieList(MoviePage(1))
    movieSerchRecord = movieSerch
  }
  pageNum = 1
  //  以上一定要 轉換成 1 因為 只要按到 頁數 就會 改變變數的值 如果查到頁數 很少的電影 又暗了 list 或 card  movie rander  就會不見
})


dataPanel.addEventListener('click', function (event) {
  const target = event.target
  if (target.matches('.btn-show-movie')) {
    console.log(target.dataset.id)
    madalChange(target.dataset.id)
  } else if (target.matches('.btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
  }
})


pagenator.addEventListener('click', function pageClick(event) {
  console.log(dataSet)
  const target = event.target
  pageNum = target.dataset.page
  
  
  console.log(target)
  if(target.tagName !== 'UL'){
     target.classList.add('page-color')
    // 很好奇 為何案 頁數按鈕 classList.add('page-color') 過一下才反應出來顏色 
  if (dataSet ==='list') {
    renderMovieList(MoviePage(target.dataset.page))
    showPage(pageNum)
  } else if (dataSet === 'card') {
    renderMovieCard(MoviePage(target.dataset.page))
    showPage(pageNum)
  }
  }
})


movieListCardChange.addEventListener('click', function (event) {
  const target = event.target
  const serch = movieSerch
  let data = serch.length ? serch : movies
  if (target.matches('.list-movies')) {
    dataSet = target.dataset.name
    renderMovieList(MoviePage(pageNum))
    rederPagenator(data.length)
    // submitChange.dataset.name = dataSet
  }
  if (target.matches('.card-movies')) {
    dataSet = target.dataset.name
    renderMovieCard(MoviePage(pageNum))
    rederPagenator(data.length)
    // submitChange.dataset.name = dataSet
  }
})


randerFrontPage.addEventListener('click', function () {
  movieSerch = []
  rederPagenator(movies.length, dataSet)
  renderMovieCard(MoviePage(1))
  showPage(1)
})








axios
  .get(`https://movie-list.alphacamp.io/api/v1/movies/`)
  .then((response) => {
    movies.push(...response.data.results)
    rederPagenator(movies.length, dataSet)
    showPage(pageNum)
    renderMovieCard(MoviePage(1))
  })
  .catch((err) => console.log(err))


  

  //  第一 >>>>  ( 更好的話，把 renderCardItem  和 RenderListItem 直接抽離成兩支專門的函式 )

    // 以上作的更動 是 一個函式 做一件事 盡量不要混在一起做 函示取的名字 盡量跟內容要做的方向一致

    // 所以我把 renderMovieList() 拆分為 renderMovieList() 和     renderMovieCard()



  //  第二 >>>> ( 當前頁數並未紀錄 => 若有儲存可協助你在切換畫面時仍停留當前頁面 )

    // 以上作的更動 是 我在最上面 設置一個當前頁面的變數 let pageNum = 1 
    // 然後在
    // pagenator.addEventListener 監聽器上 設置 pageNum = target.dataset. page 把當前頁數 放在pageNum變數上 之後 movieListCardChange.addEventListener 在轉換時 就部會一直跑到第一頁



  //  第三 >>>> ( 紀錄 card 或 list 的狀態，存放在 HTML 的 data-set 當中 )
       
    // 我在 切換 list card 圖形 的 html裡 設置了一個 data-name 'list' and 'card' 方便做 type 轉換



  // 第四 >>>> ( 多於變數 mark：在 function rederPagenator(amount, Name) 你把傳進來的 Name 存入 mark 在使用，其實都使用原本傳進來的參數就好 ) 
     
    // function rederPagenator(amount, Name) 以改動 不必要的  mark 變數



  // 第五 >>>> ( 目前與許多多餘的變數或流程控制 )

    // 以上作的更動 我是在最上面 設置一個當前頁面型態的變數 dataSet = 'card'
    // 然後在 切換 movieListCardChange 時 dataSet變數 會自動更改 'card' or 'list'
