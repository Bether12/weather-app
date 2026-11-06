const body = document.querySelector('body');
const form = document.querySelector('form');
const weatherDiv = document.querySelector('.weather-info');

/**
 * 
 * @param {String} location 
 * @returns {Object}
 */
async function getLocationWeather(location){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=RBCBP8CB6FXM8NM4NRYEPQ6ZG`);
    return await response.json();
}

function constructWeather(forecast){
    const todayDiv = document.createElement('div');
    const title = document.createElement('p');
    title.textContent = "Today's weather";
    todayDiv.appendChild(title);
    const todayDescription = document.createElement('p');
    todayDescription.textContent = forecast.description;
    todayDiv.appendChild(todayDescription);
    const todayTemp = document.createElement('p');
    todayTemp.textContent = forecast.currentConditions.temp;
    todayDiv.appendChild(todayTemp);
    const todayFeelsLike = document.createElement('p');
    todayFeelsLike.textContent = forecast.currentConditions.feelslike;
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
        temp.textContent = forecast.days[i].temp;
        div.appendChild(temp);
        const feelsLike = document.createElement('p');
        feelsLike.textContent = forecast.days[i].feelslike;
        div.appendChild(feelsLike);
        const humidity = document.createElement('p');
        humidity.textContent = `${forecast.currentConditions.humidity}%`;
        div.appendChild(humidity);

        weatherDiv.appendChild(div);
    }
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
    const response = await getLocationWeather(formData.location);
    console.log(response); 
    constructWeather(response);
});
