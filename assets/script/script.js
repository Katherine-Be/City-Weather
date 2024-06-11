
function geocodeCity () {
    console.log("fetchWeather function called");

    event.preventDefault();

    let inputCity = document.getElementById('inputCity').value;
    console.log("City:", inputCity);

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&limit=1&appid=9834887fab856f4130bf2552c9da5625`)
        .then(response => {
                return response.json();
        })                 
        .then(data => {
            console.log(data);
            let longitude = data[0].lon;
            let lattitude = data[0].lat;
    
            console.log(longitude, lattitude)

            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=imperial&appid=9834887fab856f4130bf2552c9da5625`)
                .then(response => response.json())      
                .then(data => {
        console.log(data);
        let dayOne = data.list[0];
        let dayTwo = data.list[8];
        let dayThree = data.list[16];
        let dayFour = data.list[24];
        let dayFive = data.list[32];

        // Corrected: Initialize fiveDayForecast as an object instead of pushing into an array
        let fiveDayForecast = {
            firstDay: dayOne,
            secondDay: dayTwo,
            thirdDay: dayThree,
            fourthDay: dayFour,
            fifthDay: dayFive
        };
        console.log(fiveDayForecast);

        var dayCard = document.getElementsByClassName("card");


        Object.entries(fiveDayForecast).forEach(([day, weatherData], index) => {
            // Constructing the day number (1 through 5)
            let dayNumber = index + 1;

            // Setting the weather icon
            let weatherIconElement = document.getElementById(`day${dayNumber}WeatherIcon`);
            weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

            // Setting the date      
            let timestamp = weatherData.dt;
            let date = new Date(timestamp * 1000); // Convert to milliseconds
            let numericDay = date.getDate();
            let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let month = monthList[date.getMonth()];
            let daysOfWeekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let dayOfWeek = daysOfWeekList[date.getDay()];
            let dateText = document.getElementById(`day${dayNumber}Date`);
            dateText.innerHTML = `${dayOfWeek}, ${month} ${numericDay}`;

            // Setting the temperature
            let temperatureText = document.getElementById(`day${dayNumber}Temps`);
            temperatureText.innerHTML = `Min: ${weatherData.main.temp_min}, Max: ${weatherData.main.temp_max}`;
            
            // Setting the humidity
            let humidityText = document.getElementById(`day${dayNumber}Humidity`);
            humidityText.innerHTML = `Humidity: ${weatherData.main.humidity}%`;

            // Setting the wind speed
            let windSpeedText = document.getElementById(`day${dayNumber}Wind`);
            windSpeedText.innerHTML = `Wind: ${weatherData.wind.speed} mph`;    
        });

        
        for (var i = 0; i < dayCard.length; i++) {
            dayCard[i].classList.remove("d-none");   
        };
        });
    
   });

}
//         showNewWeather();
//                     // .then(data => {
//                 //     console.log(data);


// function showNewWeather (fiveDayForecast) {
//             console.log(fiveDayForecast)
 
//             }



