const body = document.querySelector('body');
const form = document.querySelector('form');
const weatherDiv = document.querySelector('.weather-info');
const toggleCFButton = document.querySelector('#toggleCF');

/**
 * 
 * @param {String} location 
 * @returns {Object}
 */
async function getLocationWeather(location){
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=RBCBP8CB6FXM8NM4NRYEPQ6ZG`);
        if(!response.ok){
            if(response.status === 400){
                return {
                    code: response.status,
                    error: 'The given location is unknown'
                };
            }else if(response.status === 401){
                return {
                    code: response.status,
                    error: 'The operation is not authorized'
                };
            }else if(response.status === 404){
                return {
                    code: response.status,
                    error: 'Cannot locate the weather service'
                };
            }else if(response.status === 429){
                return {
                    code: response.status,
                    error: 'Too many requests, try again later'
                };
            }else if(response.status === 500){
                return {
                    code: response.status,
                    error: 'Internal server error'
                };
            }else{
                return {
                    code: response.status,
                    error: 'An error occurred'
                };
            }
        }
        return await response.json();
    }catch(error){
        return {
            code: `(${error.message})`,
            error: ' Check your connection and try again'
        }
    }
}

function toggleCF(){
    const temps = document.querySelectorAll('.temp');
    let to = toggleCFButton.textContent;
    console.log('To:',to);
    for(let temp of temps){
        if(temp.textContent.includes(to)){
            continue;
        }else{
            let temperature = parseFloat(temp.textContent.split(' ')[0]);
            if(to === 'ºF'){
                temperature = (temperature*(9/5)) + 32;
                temp.textContent = `${temperature.toFixed(1)} ºF`;
            }else{
                temperature = (temperature - 32)*(5/9);
                temp.textContent = `${temperature.toFixed(1)} ºC`;
            }
        }
    }
}

function constructWeather(forecast){
    weatherDiv.innerHTML = '';
    if(forecast.code){
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `Error ${forecast.code}: ${forecast.error}`;
        weatherDiv.appendChild(errorDiv);
        return
    }
    const todayDiv = document.createElement('div');
    const title = document.createElement('p');
    title.textContent = "Today's weather";
    todayDiv.appendChild(title);
    const todayDescription = document.createElement('p');
    todayDescription.textContent = forecast.description;
    todayDiv.appendChild(todayDescription);
    const todayTemp = document.createElement('p');
    todayTemp.className = 'temp';
    todayTemp.textContent = `${forecast.currentConditions.temp} ºF`;
    todayDiv.appendChild(todayTemp);
    const todayFeelsLike = document.createElement('p');
    todayFeelsLike.className = 'temp';
    todayFeelsLike.textContent = `${forecast.currentConditions.feelslike} ºF`;
    todayDiv.appendChild(todayFeelsLike);
    const todayHumidity = document.createElement('p');
    todayHumidity.textContent = `${forecast.currentConditions.humidity}%`;
    todayDiv.appendChild(todayHumidity);

    weatherDiv.appendChild(todayDiv);
    
    for(let i=1; i<6; i++){
        const div = document.createElement('div');
        const date = document.createElement('p');
        date.textContent = `${forecast.days[i].datetime}`;
        div.appendChild(date);
        const description = document.createElement('p');
        description.textContent = forecast.days[i].description;
        div.appendChild(description);
        const temp = document.createElement('p');
        temp.className = 'temp';
        temp.textContent = `${forecast.days[i].temp} ºF`;
        div.appendChild(temp);
        const feelsLike = document.createElement('p');
        feelsLike.className = 'temp';
        feelsLike.textContent = `${forecast.days[i].feelslike} ºF`;
        div.appendChild(feelsLike);
        const humidity = document.createElement('p');
        humidity.textContent = `${forecast.currentConditions.humidity}%`;
        div.appendChild(humidity);

        weatherDiv.appendChild(div);
    }
    toggleCF();
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(form);
    /*
    currentConditions:
        temp: Shows current temperature
        feelslike: Shows temperature based on humidity
        icon: Reflects the weather through an icon
        humidity: Shows relative humidity
    days
        datetime: shows date
        temp: Shows the "current temperature"
        tempmin, tempmax: Shows minimum and maximum temperatures
    description: Overall description
    */
    const response = await getLocationWeather(formData.get('location'));
    console.log(response); 
    constructWeather(response);
});

toggleCFButton.addEventListener('click', ()=>{
    toggleCFButton.textContent = toggleCFButton.textContent === 'ºF' ? 'ºC' : 'ºF';
    toggleCF();
});
