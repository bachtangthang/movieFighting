const fetchData = async () => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'da4f2d33',
            s: 'avengers',
        }
    })
    console.log(response.data);
}

fetchData();