let forecastData = []; 
document.getElementById('searchBtn').addEventListener('click', async () => {
  const city = document.getElementById('city_input').value;
  forecastData = await fetchWeatherForecast(city); 
  paginateForecast(forecastData); 
});

document.addEventListener('DOMContentLoaded', function () {
  const apiKey = '0eb0a39c570cc1e4073dc6b135514846';//weatherapi key
  const cityInput = document.getElementById('city_input');
  const searchBtn = document.getElementById('searchBtn');
  const locationBtn = document.getElementById('locationBtn');
//fetching 5 day weather forecast
  function getWeatherForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const forecast = processForecastData(data);
        renderCharts(forecast);
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });
  }

  function processForecastData(data) {
    const dailyTemps = [];
    const weatherConditions = [];
    const dates = [];

    data.list.forEach(entry => {
      const date = new Date(entry.dt_txt).toLocaleDateString();
      const time = new Date(entry.dt_txt).getHours();

      if (time === 12) { 
        dailyTemps.push(entry.main.temp);
        weatherConditions.push(entry.weather[0].main);
        dates.push(date);
      }
    });

    return {
      temps: dailyTemps,
      conditions: weatherConditions,
      dates: dates
    };
  }
//chart.js logic
  function renderCharts(forecast) {
    const { temps, conditions, dates } = forecast;

    // Vertical Bar Chart 
    const tempBarChart = new Chart(document.getElementById('tempBarChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Temperature (°C)',
          data: temps,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        animation: {
          delay: 500,
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Doughnut Chart 
    const conditionCount = conditions.reduce((acc, condition) => {
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});

    const doughnutChart = new Chart(document.getElementById('weatherConditionChart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(conditionCount),
        datasets: [{
          data: Object.values(conditionCount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        animation: {
          delay: 500, 
        }
      }
    });

    // Line Chart 
    const lineChart = new Chart(document.getElementById('tempLineChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Temperature (°C)',
          data: temps,
          fill: false,
          borderColor: '#FF6384',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000, 
          easing: 'easeOutBounce',
          onComplete: function () {
            console.log('Animation complete!');
          },
          delay: function (context) {
            return context.dataIndex * 200; 
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
      getWeatherForecast(city);
    }
  });

  // Event listener for geolocation
  locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              const forecast = processForecastData(data);
              renderCharts(forecast);
            })
            .catch(error => console.error('Error fetching weather by location:', error));
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  });
});

// weather widget logic
document.addEventListener('DOMContentLoaded', function () {
  const apiKey = '0eb0a39c570cc1e4073dc6b135514846';
  const cityInput = document.getElementById('city_input');
  const searchBtn = document.getElementById('searchBtn');
  const locationBtn = document.getElementById('locationBtn');
  const weatherWidget = document.getElementById('weather-widget');

  const weatherBackgrounds = {
    Clear: 'sunny.jpg',
    Clouds: 'cloudy.jpeg',
    Rain: 'rainy.jpeg',
    Snow: 'snow.jpeg',
    Thunderstorm: 'storm.jpeg',
    Drizzle: 'drizzle.jpeg',
    Mist: 'mist.jpeg',
    Haze: 'haze.jpeg',
    Smoke: 'smoke.jpeg',
    Fog: 'fog.jpeg',
  };

  function updateWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          document.getElementById('temp').textContent = `${Math.round(data.main.temp)} °C`;
          document.getElementById('weather-desc').textContent = data.weather[0].description;
          document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
          document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
          document.getElementById('date').textContent = new Date().toLocaleDateString();
          document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;

          // weather icon
          const iconCode = data.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
          document.getElementById('weather-icon').src = iconUrl;

          // Change background based on weather condition
          const weatherCondition = data.weather[0].main;
          changeWidgetBackground(weatherCondition);
        } else {
          alert('City not found!');
        }
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
  // Function to change widget background based on weather condition
  function changeWidgetBackground(weatherCondition) {
    const backgroundImage = weatherBackgrounds[weatherCondition] || 'default.jpeg';
    console.log(`Weather condition: ${weatherCondition}, Background image: ${backgroundImage}`); // Debugging log
    weatherWidget.style.backgroundImage = `url('./images/${backgroundImage}')`;
    weatherWidget.style.backgroundSize = 'cover';
    weatherWidget.style.backgroundPosition = 'center';
  }

  // Event listener for search button
  searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
      updateWeatherData(city);
    }
  });

  // Event listener for location button 
  locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              updateWeatherData(data.name);
            })
            .catch(error => {
              console.error('Error fetching weather by location:', error);
            });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  });
});

// 5 day forecast logic
document.addEventListener('DOMContentLoaded', function () {
  const apiKey = '0eb0a39c570cc1e4073dc6b135514846'; 
  const cityInput = document.getElementById('city_input');
  const searchBtn = document.getElementById('searchBtn');
  const locationBtn = document.getElementById('locationBtn');
  const forecastTable = document.getElementById('forecast-table');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  let forecastData = []; 
  let currentPage = 0; 
  const entriesPerPage = 5; 

  async function fetchWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data.list; 
  }

  function displayForecast(data) {
    forecastTable.innerHTML = ''; 

    const startIndex = currentPage * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentEntries = data.slice(startIndex, endIndex);

    currentEntries.forEach(item => {
      const forecastItem = document.createElement('tr');
      const date = new Date(item.dt * 1000).toLocaleDateString(); 
      const temperature = item.main.temp;
      const weatherCondition = item.weather[0].description;
      const windSpeed = item.wind.speed;
      const humidity = item.main.humidity;

      forecastItem.innerHTML = `
                <td>${date}</td>
                <td>${temperature} °C</td>
                <td>${weatherCondition}</td>
                <td>${windSpeed} m/s</td>
                <td>${humidity} %</td>
            `;
      forecastTable.appendChild(forecastItem);
    });

    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = endIndex >= data.length;
  }

  searchBtn.addEventListener('click', async () => {
    const city = cityInput.value;
    if (city) {
      forecastData = await fetchWeatherForecast(city);
      currentPage = 0; 
      displayForecast(forecastData); 
    }
  });

  // Handle pagination
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      displayForecast(forecastData);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if ((currentPage + 1) * entriesPerPage < forecastData.length) {
      currentPage++;
      displayForecast(forecastData);
    }
  });

  locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          forecastData = data.list; 
          currentPage = 0; 
          displayForecast(forecastData); 
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  });

  const renderForecast = (forecastData) => {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    forecastData.forEach((day) => {
      const date = new Date(day.date).toLocaleDateString(); 
      if (!forecastContainer.querySelector(`[data-date="${date}"]`)) {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.setAttribute("data-date", date);
        forecastItem.innerHTML = `<p>${date}</p><p>${day.weather}</p>`;
        forecastContainer.appendChild(forecastItem);
      }
    });
  };

  // filter logic
  function applyFilter(selectedFilter) {
    let filteredData = forecastData;

    switch (selectedFilter) {
      case 'ascending':
        filteredData = filteredData.sort((a, b) => a.main.temp - b.main.temp);
        break;
      case 'descending':
        filteredData = filteredData.sort((a, b) => b.main.temp - a.main.temp);
        break;
      case 'rain':
        filteredData = filteredData.filter(item => item.weather[0].description.includes('rain'));
        break;
      case 'highest':
        const highestTempEntry = filteredData.reduce((prev, current) =>
          (prev.main.temp > current.main.temp) ? prev : current
        );
        filteredData = [highestTempEntry]; 
        break;
      default:
        break;
    }

    displayForecast(filteredData);
  }

  // Event listener for filter selection
  document.getElementById('filters').addEventListener('change', function () {
    const selectedFilter = this.value;
    applyFilter(selectedFilter);
  });

});

// gemini api logic
document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-query');
  const userInput = document.getElementById('user-query');
  const chatbotResponse = document.getElementById('chatbot-response');

  const GEMINI_API_KEY = 'AIzaSyApESpnq8TahLPA6IWn0ocuOcgeVILiER4'; 

  const WEATHER_API_KEY = '0eb0a39c570cc1e4073dc6b135514846'; 

  sendButton.addEventListener('click', () => {
    const question = userInput.value;
    if (question.trim() !== '') {
      handleQuery(question);
      userInput.value = '';
    } else {
      displayChatbotResponse('Please enter a question.');
    }
  });

  async function handleQuery(query) {
    query = query.toLowerCase();
    if (query.includes('will it rain') || query.includes('weather')) {
      const cityMatch = query.match(/in\s+([a-zA-Z\s]+)/);
      const city = cityMatch ? cityMatch[1].trim() : null; 

      if (city) {
        const weatherResponse = await getWeather(city);
        displayChatbotResponse(weatherResponse);
      } else {
        displayChatbotResponse('Please specify a city for the weather query.');
      }
    } else {
      askChatbot(query);
    }
  }
  async function getWeather(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        console.error(`Weather API Error: ${response.status} ${response.statusText}`);
        throw new Error('Weather data not found');
      }
      const data = await response.json();
      return `The weather in ${city} is ${data.weather[0].description}, temperature: ${data.main.temp}°C.`;
    } catch (error) {
      console.error('Fetch error:', error); 
      return `Sorry, I couldn't fetch the weather information. Please try again.`;
    }
  }

  async function askChatbot(question) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const requestBody = {
      contents: [{
        parts: [{
          text: question
        }]
      }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Error: ${response.status} - ${errData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Chatbot response:', data); 

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate && candidate.content && candidate.content.parts) {
          const responseText = candidate.content.parts[0].text;
          displayChatbotResponse(responseText);
        } else {
          displayChatbotResponse('No content in the chatbot response.');
        }
      } else {
        displayChatbotResponse('No response from the chatbot.');
      }
    } catch (error) {
      console.error('Chatbot fetch error:', error); 
      displayChatbotResponse(error.message || 'Failed to get a response from the chatbot.');
    }
  }

  function displayChatbotResponse(responseText) {
    chatbotResponse.textContent = responseText || 'No response from the chatbot.';
    chatbotResponse.scrollTop = chatbotResponse.scrollHeight; 
  }
});
