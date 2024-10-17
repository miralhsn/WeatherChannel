# Weather Dashboard with Chatbot Integration using OpenWeather API

## Objective

This project implements a fully responsive weather dashboard with a chatbot integration using the **OpenWeather API** for weather data and **Gemini API** for chatbot functionality. It also includes data visualization with **Chart.js**.

## Features

- **Weather Information**: Provides current weather details based on the city selected by the user.
- **Background Changes**: The background of the weather widget changes dynamically based on the weather conditions.
- **Charts**: 
  - Vertical Bar Chart: Displays temperature trends for the next 5 days.
  - Doughnut Chart: Visualizes the distribution of weather conditions over the next 5 days.
  - Line Chart: Shows temperature changes over the next 5 days.
- **Chatbot Integration**: 
  - Gemini Chatbot API handles non-weather queries.
  - Weather-related queries are processed using OpenWeather API.
- **Table**: Displays a 5-day weather forecast with pagination for large datasets.
- **Error Handling**: Manages invalid inputs or API errors with user-friendly messages.
- **Responsive Design**: Ensures the dashboard adapts to various screen sizes.

## Technologies Used

- **HTML**: Structure of the dashboard and layout.
- **CSS**: Styling for the dashboard and responsive design.
- **JavaScript**: Implements API calls, data manipulation, and chatbot functionality.
- **OpenWeather API**: Fetches weather information.
- **Gemini API**: Chatbot integration for handling queries.
- **Chart.js**: Visualizes weather data in the form of various charts.

## Preview

### Dashboard Layout
![Weather Dashboard](/images/Dashboard.png) 

### Tables Layout
![Tables Page](/images/Tables.png) 

## Access the Weather Dashboard

You can access the live version of the weather dashboard [here](https://miralhsn.github.io/WeatherChannel/). 

## Setup and Usage

### 1. Clone the Repository:
```bash
git clone https://github.com/miralhsn/WeatherChannel.git
```
## 2. Open the Project:
Open `dashboard.html` in your web browser to launch the weather dashboard.

## 3. API Key Setup:

- **OpenWeather API**: Sign up and generate an API key from [OpenWeather](https://home.openweathermap.org/users/sign_up).
- **Gemini API**: Register for an API key from Gemini.
- Replace the placeholders in the code with your actual API keys.

### 4. Weather and Chatbot Integration:

Fetch weather data by entering a city name.
Chat with the chatbot for weather or non-weather-related queries.

## Contributions
Contributions are welcome! Fork the repository and submit a pull request with your improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
For any questions or suggestions, feel free to reach out to me at miralqureshi@gmail.com.