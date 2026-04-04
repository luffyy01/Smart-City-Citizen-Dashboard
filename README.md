# 🏙️ SmartCity AI Citizen Dashboard

![SmartCity Dashboard Preview](https://via.placeholder.com/1200x600.png?text=SmartCity+Dashboard+Preview) 
*(Note to student: Replace the image link above with a real screenshot of your deployed project once it is live!)*

## 🚀 Overview
The **SmartCity Citizen Dashboard** is a real-time, responsive web application designed for municipal administration and citizen engagement. It serves as a centralized hub providing live, up-to-the-second telemetry data across four key civic verticals: Weather, Economy (Currency), Demographics (Featured Citizen), and Civic Education (City Facts). 

The flagship feature of this dashboard is the **Smart Assistant**, an integrated AI chatbot powered by Large Language Models (LLMs). The assistant uses a strict context-injection pattern, meaning it reads the live data currently displayed on the dashboard and answers citizen queries *exclusively* based on that telemetry, preventing AI hallucinations.

## ✨ Key Features
* **🌤️ Live Weather Telemetry:** Fetches real-time temperature, wind speed, and weather codes based on city coordinates.
* **💱 Economic Indicators:** Displays live currency exchange rates converting INR to USD, EUR, and GBP.
* **👤 Citizen Spotlight:** Generates dynamic, mock citizen profiles including names, locations, and contact details.
* **🏙️ Civic Trivia:** Provides a randomly generated "City Fact of the Day."
* **🤖 Context-Aware AI Assistant:** A floating chatbot that ingests the live API data and answers user questions contextually without relying on external internet searches or making up data.

## 🛠️ Technologies Used
* **Frontend Framework:** React.js (via Vite)
* **Styling:** Custom CSS (Glassmorphism, CSS Grid, Responsive Design)
* **APIs Integrated:**
  * [Open-Meteo API](https://api.open-meteo.com/) (Weather)
  * [ExchangeRate-API](https://open.er-api.com/) (Currency)
  * [RandomUser API](https://randomuser.me/) (Citizen Profiles)
  * [UselessFacts API](https://uselessfacts.jsph.pl/) (Trivia)
* **AI Provider:** Hugging Face Inference API / OpenRouter

## ⚙️ Local Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/luffyy01/Smart-City-Citizen-Dashboard
 
