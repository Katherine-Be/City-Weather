//  <-----load recent city tabs----->
document.addEventListener('load', updateTabs())
    
function updateTabs() {
    //  Retrieve the current list of cities from local storage
    if (localStorage.getItem('recentCities') === null) {
        localStorage.setItem('recentCities', JSON.stringify([]));
    }

    let recentCities = localStorage.getItem('recentCities');
    recentCities = recentCities ? JSON.parse(recentCities) : [];
    console.log(recentCities);

    //  Reveal tabs if used
    for (let i = 0; i < recentCities.length && i < 5; i++) {
        const cityTab = document.getElementById(`city${i}Name`);
        if (cityTab) {
            cityTab.classList.remove('d-none');
            cityTab.innerHTML = '';
            cityTab.innerHTML = recentCities[i];
            cityTab.style.textTransform = "capitalize"
            // Event listeners for the tabs
            cityTab.addEventListener('click', () => displayWeather(recentCities[i]));
        }
    }
};


//  <-----Search button----->
function searchCity(event) {

    event.preventDefault();

    let inputCity = document.getElementById('inputCity').value;
    console.log("City:", inputCity);

    // Retrieve the current list of cities from local storage
    var recentCities = localStorage.getItem('recentCities');
    recentCities = recentCities ? JSON.parse(recentCities) : [];

    //  Check if the city is already in the list
    if (recentCities.includes(inputCity)) {
        console.log('City already in list');
        displayWeather(inputCity);
        
        return;
    };

    //  Add the new city to the array
    recentCities.unshift(inputCity);

    //  Limit the array to 5 most recent cities
    if (recentCities.length > 5) {
        recentCities.pop();
    }

    //  Save the updated array back to local storage
    localStorage.setItem('recentCities', JSON.stringify(recentCities));

    //  Add new city to tab
    for (let i = 0; i < recentCities.length && i < 5; i++) {
        const cityTab = document.getElementById(`city${i}Name`);
        if (cityTab) {
            cityTab.classList.remove('d-none');
            cityTab.innerHTML = recentCities[i];
        }
    }

    //  All displayWeather for most recently added city
    displayWeather(inputCity);
    updateTabs();
};

//  <-----Fetch data and show weather----->
function displayWeather (cityName) {
    console.log("City:", cityName);

    //  Fetch lattitude and longitude from geocode API
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9834887fab856f4130bf2552c9da5625`)
        .then(response => {
                return response.json();
        })                 
        .then(data => {
            console.log(data);
            let longitude = data[0].lon;
            let lattitude = data[0].lat;
            console.log(longitude, lattitude)


            //  Fetch weather data from 5 day weather API----->
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=imperial&appid=9834887fab856f4130bf2552c9da5625`)
                .then(response => response.json())      
                .then(data => {
            console.log(data);
            let dayOne = data.list[0];
            let dayTwo = data.list[8];
            let dayThree = data.list[16];
            let dayFour = data.list[24];
            let dayFive = data.list[32];

            //  Useable fiveDayForecast object  //
            let fiveDayForecast = {
                firstDay: dayOne,
                secondDay: dayTwo,
                thirdDay: dayThree,
                fourthDay: dayFour,
                fifthDay: dayFive
             };

            console.log(fiveDayForecast);


        //  Display weather data
        Object.entries(fiveDayForecast).forEach(([day, weatherData], index) => {
            let dayNumber = index + 1;

            //  Weather icon
            let weatherIconElement = document.getElementById(`day${dayNumber}WeatherIcon`);
            weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

            //  Date      
            let timestamp = weatherData.dt;
            let date = new Date(timestamp * 1000);
            let numericDay = date.getDate();
            let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let month = monthList[date.getMonth()];
            let daysOfWeekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let dayOfWeek = daysOfWeekList[date.getDay()];
            let dateText = document.getElementById(`day${dayNumber}Date`);
            dateText.innerHTML = `${dayOfWeek}, ${month} ${numericDay}`;

            //  Temperature
            let temperatureText = document.getElementById(`day${dayNumber}Temps`);
            temperatureText.innerHTML = `Min: ${weatherData.main.temp_min}, Max: ${weatherData.main.temp_max}`;
            
            //  Humidity
            let humidityText = document.getElementById(`day${dayNumber}Humidity`);
            humidityText.innerHTML = `Humidity: ${weatherData.main.humidity}%`;

            //  Wind speed
            let windSpeedText = document.getElementById(`day${dayNumber}Wind`);
            windSpeedText.innerHTML = `Wind: ${weatherData.wind.speed} mph`;    
        });


        //  Reveal weather cards
        var dayCard = document.getElementsByClassName("card");
        for (var i = 0; i < dayCard.length; i++) {
            dayCard[i].classList.remove("d-none");   
        };
        });
    
   });

};
