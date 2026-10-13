const body = document.querySelector('body');
const form = document.querySelector('form');
const weatherDiv = document.querySelector('.weather-info');

async function getLocationWeather(location){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=RBCBP8CB6FXM8NM4NRYEPQ6ZG`);
    return await response.json();
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const response = await getLocationWeather(formData.location); 
    weatherDiv.textContent = response;
});