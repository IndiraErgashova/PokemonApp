const $wrapper = document.querySelector('.wrapper')
const $container = document.querySelector('.container')
const $prev = document.querySelector('.prev')
const $next = document.querySelector('.next')
const $currentPage = document.querySelector('.currentPage')
const $allPages = document.querySelector('.allPages')
const $pageInput = document.querySelector('.pageInput')
const $inputButton = document.querySelector('.inputButton')


const base_url = 'https://pokeapi.co/api/v2/'




const LIMIT = 20
let offSetCounter = 0
const allPokemons = 1126
const ALL_PAGES = Math.floor(allPokemons /  LIMIT)
let currentPage = 1
let selectPage = 1

console.log(offSetCounter);



window.addEventListener('load' , () => {
    getData(`${base_url}pokemon` , `limit=${LIMIT}&offset=${offSetCounter}` , cb => {
        cardTemplate(cb.results)
    })
})



function getData(url , query , callBack){
    fetch(`${url}?${query}`)
    .then(res => res.json())
    .then(response => {
        callBack(response)
    })
}

function cardTemplate(base){
    const markup = base.map(item =>
        `
            <div class="card" onclick ="getSingleData('${item.url}')">
                <p>${item.name}</p>
            </div>
        `  
    ).join('')

    $wrapper.innerHTML = markup
}


function getSingleData(url){
    getData(url, '' , cb => {
        $container.innerHTML = `
            <div class="single">
                <div class="singleWrapper">
                    <img src="${cb.sprites.other.dream_world.front_default}" alt ="pokemonImage">

                    <div>
                        <ul>
                            <li>
                                Name:  <span>${cb.name}</span>
                            </li>
                            <li>
                                Number:  <span>${cb.id}</span>
                            </li>
                            <li>
                                Weight:  <span>${cb.weight}</span>
                            </li>
                            <li>
                                Height:  <span>${cb.height}</span>
                            </li>
                            
                        
                        </ul>
                    </div>
                </div>
                <button class="back" onclick="goBack()">Go back</button>
            </div>
        `
    })
}

function goBack(){
    window.location.reload()
}


window.addEventListener('load' , () => {
    $allPages.innerHTML = ALL_PAGES
    $currentPage.innerHTML = currentPage

    $prev.setAttribute('disabled' , true)
})


$next.addEventListener('click' , e => {
    e.preventDefault()


    offSetCounter += LIMIT
    currentPage++

    if(currentPage === ALL_PAGES){
        $next.setAttribute('disabled' , true)
    }else{
        $next.removeAttribute('disbled')
    }

    changePage()

    $prev.removeAttribute('disabled')

    getData(`${base_url}pokemon` , `limit=${LIMIT}&offset=${offSetCounter}` , cb => {
        cardTemplate(cb.results)
    })
})


$prev.addEventListener('click' , e => {
    e.preventDefault()

    offSetCounter -= LIMIT
    currentPage--

    if(currentPage === ALL_PAGES){
        $prev.setAttribute('disabled' , true)
    }

    changePage()

    $next.removeAttribute('disabled')

    getData(`${base_url}pokemon` , `limit=${LIMIT}&offset=${offSetCounter}` , cb => {
        cardTemplate(cb.results)
    })
})



function changePage(){
    $currentPage.innerHTML = currentPage
}



$pageInput.addEventListener('click' , e => {
    selectPage = e.target.value
})

$inputButton.addEventListener('click' , e => {
    e.preventDefault()

    if(selectPage > ALL_PAGES || selectPage < 1 || selectPage === currentPage){
        alert('Введите корректную страницу!')

        $inputButton.value = ''
    }else{

        const selectedOffSet = selectPage * LIMIT - LIMIT

        offSetCounter = selectedOffSet

        currentPage = selectPage

        $currentPage.innerHTML = selectPage


        if(selectPage !== 1){
            $prev.removeAttribute('disabled')
        }else{
            $prev.setAttribute('disabled' , true)
        }

        if(selectPage !== ALL_PAGES){
            $next.removeAttribute('disabled')
        }else{
            $next.setAttribute('disabled' , true)
        }


        $inputButton.value = ''


        getData(`${base_url}pokemon` , `limit=${LIMIT}&offset=${selectedOffSet}` , cb => {
            cardTemplate(cb.results)
        })
    }
})