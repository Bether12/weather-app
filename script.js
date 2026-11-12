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

function loading(){
    weatherDiv.innerHTML = '';
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-div';
    const h2 = document.createElement('h2');
    h2.textContent = 'Loading weather data...';
    loadingDiv.appendChild(h2);
    weatherDiv.appendChild(loadingDiv);
}

function toggleCF(){
    const temps = document.querySelectorAll('.temp');
    let to = toggleCFButton.textContent;
    for(let temp of temps){
        if(temp.textContent.includes(to)){
            continue;
        }else{
            let temperature;
            if(temp.classList.contains('feelslike')){
                temperature = parseFloat(temp.textContent.split(' ')[2]);
                if(to === 'ºF'){
                    temperature = (temperature*(9/5)) + 32;
                    temp.textContent = `Feels like: ${temperature.toFixed(1)} ºF`;
                }else{
                    temperature = (temperature - 32)*(5/9);
                    temp.textContent = `Feels like: ${temperature.toFixed(1)} ºC`;
                }
            }else{
                temperature = parseFloat(temp.textContent.split(' ')[1]);
                if(to === 'ºF'){
                    temperature = (temperature*(9/5)) + 32;
                    temp.textContent = `Temperature: ${temperature.toFixed(1)} ºF`;
                }else{
                    temperature = (temperature - 32)*(5/9);
                    temp.textContent = `Temperature: ${temperature.toFixed(1)} ºC`;
                }
            }
        }
    }
}

function selectWeatherIcon(term){
    if(term === 'snow'){
        return './assets/snowflake.svg';
    }else if(term === 'snow-showers-day' || term === 'snow-showers-night'){
        return './assets/rainy_snow.svg';
    }else if(term === 'thunder-rain' || term === 'thunder-showers-day' || term === 'thunder-showers-night'){
        return './assets/thunderstorm.svg';
    }else if(term === 'rain' || term === 'showers-day' || term === 'showers-night'){
        return './assets/rainy.svg';
    }else if(term === 'fog'){
        return './assets/foggy.svg';
    }else if(term === 'wind'){
        return './assets/air.svg';
    }else if(term === 'cloudy'){
        return './assets/cloud.svg';
    }else if(term === 'partly-cloudy-day'){
        return './assets/partly_cloudy_day.svg';
    }else if(term === 'partly-cloudy-night'){
        return './assets/partly_cloudy_night.svg';
    }else if(term === 'clear-day'){
        return './assets/clear_day.svg';
    }else if(term === 'clear-night'){
        return './assets/clear_night.svg';
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
    todayDiv.className = 'today';
    const title = document.createElement('p');
    title.textContent = "Today's weather";
    todayDiv.appendChild(title);
    const todayIcon = document.createElement('img');
    todayIcon.className = 'icon';
    todayIcon.src = selectWeatherIcon(forecast.currentConditions.icon);
    todayDiv.appendChild(todayIcon);
    const todayDescription = document.createElement('p');
    todayDescription.textContent = forecast.description;
    todayDiv.appendChild(todayDescription);
    const todayTemp = document.createElement('p');
    todayTemp.className = 'temp';
    todayTemp.textContent = `Temperature: ${forecast.currentConditions.temp} ºF`;
    todayDiv.appendChild(todayTemp);
    const todayFeelsLike = document.createElement('p');
    todayFeelsLike.className = 'temp';
    todayFeelsLike.classList.add('feelslike');
    todayFeelsLike.textContent = `Feels like: ${forecast.currentConditions.feelslike} ºF`;
    todayDiv.appendChild(todayFeelsLike);
    const todayHumidity = document.createElement('p');
    todayHumidity.textContent = `Relative humidity: ${forecast.currentConditions.humidity}%`;
    todayDiv.appendChild(todayHumidity);

    weatherDiv.appendChild(todayDiv);
    
    for(let i=1; i<6; i++){
        const div = document.createElement('div');
        const date = document.createElement('p');
        date.textContent = `${forecast.days[i].datetime}`;
        div.appendChild(date);
        const icon = document.createElement('img');
        icon.className = 'icon';
        icon.src = selectWeatherIcon(forecast.days[i].icon);
        div.appendChild(icon);
        const description = document.createElement('p');
        description.textContent = forecast.days[i].description;
        div.appendChild(description);
        const temp = document.createElement('p');
        temp.className = 'temp';
        temp.textContent = `Temperature: ${forecast.days[i].temp} ºF`;
        div.appendChild(temp);
        const feelsLike = document.createElement('p');
        feelsLike.className = 'temp';
        feelsLike.classList.add('feelslike');
        feelsLike.textContent = `Feels like: ${forecast.days[i].feelslike} ºF`;
        div.appendChild(feelsLike);
        const humidity = document.createElement('p');
        humidity.textContent = `Relative humidity: ${forecast.currentConditions.humidity}%`;
        div.appendChild(humidity);

        weatherDiv.appendChild(div);
    }
    toggleCF();
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    loading();
    const formData = new FormData(form);
    const response = await getLocationWeather(formData.get('location'));
    console.log(response); 
    constructWeather(response);
});

toggleCFButton.addEventListener('click', ()=>{
    toggleCFButton.textContent = toggleCFButton.textContent === 'ºF' ? 'ºC' : 'ºF';
    toggleCF();
});
