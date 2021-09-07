const fetchData = async (searhString) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'da4f2d33',
            s: searhString,
        }
    });

    if(response.data.Error){
        return[];
    }

    return response.data.Search;    
}
const root = document.querySelector('.autocomplete');//everything happen with autocomplete
root.innerHTML = `
    <label><b>Search movies</b></label>
    <input class = "input"/>
    <div class = "dropdown">
        <div class = "dropdown-menu">
            <div class = "dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultWrapper = document.querySelector('.results');


const onInput = async (event) => {
    const movies = await fetchData(event.target.value);
    console.log(movies);

    if(!movies.length){//if no movies, dont show dropdown menu
        dropdown.classList.remove('is-active');
        return;
    }

    resultWrapper.innerHTML = ``;//clear the previous search
    dropdown.classList.add('is-active');
    for(let movie of movies){
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A'? '':movie.Poster    


        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src = "${imgSrc}"/>
            ${movie.Title}
        `;

        option.addEventListener('click', ()=>{//handle movie selection
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        })
        resultWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {//close dropdown when click outside the dropdown menu
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
})

const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'da4f2d33',
            i: movie.imdbID,
        }
    });
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}


const movieTemplate = (movieDetail) =>{
    return `
        <article class = "media">
            <figure class = "media-left">
                <p class = "image">
                    <img src = "${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class = "media-content">
                <div class = "content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}<p>
                </div>
            </div>
        </article>
    `;
}