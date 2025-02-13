 <h1 align="center">Telegram Rental Bot 🏠</h1>

<div align="center">
  Designed to streamline property rentals in Dubai, offering an intuitive interface for both property seekers and listers.

  <br>
  <br>

  [![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
  [![Node.js](https://img.shields.io/badge/Node.js-green?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-lightgreen?style=flat-square&logo=supabase)](https://supabase.com/)
  [![Railway](https://img.shields.io/badge/Railway-Deployment-blueviolet?style=flat-square&logo=railway)](https://railway.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-gray?style=flat-square&logo=github)](https://github.com/LeoFreyre/bot-find-home-dubai)
</div>

## 🌟 Features

- **Advanced Property Search**
  - Filter by property type (Studio, 1BHK, Villa, etc.)
  - Set minimum and maximum price ranges
  - Search by location
  - Skip any filter for broader results

- **Property Listing Management**
  - Upload up to 10 photos per property
  - Detailed property descriptions
  - Contact information verification
  - Price and location validation

- **User-Friendly Interface**
  - Custom keyboards for easy navigation
  - Interactive buttons for property browsing
  - Step-by-step listing process
  - Clear property display with pagination

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/LeoFreyre/bot-find-home-dubai.git
cd bot-find-home-dubai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
```

4. Set up Supabase:
   - Create a new project in Supabase
   - Create a 'properties' table with the following schema:
     ```sql
     CREATE TABLE properties (
       id SERIAL PRIMARY KEY,
       description TEXT NOT NULL,
       price NUMERIC NOT NULL,
       type TEXT NOT NULL,
       location TEXT NOT NULL,
       contact_info TEXT NOT NULL,
       photos TEXT[] NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
       user_id BIGINT NOT NULL,
       verified_by_admin TEXT DEFAULT '-'
     );
     ```

## 🚀 Usage

1. Start the bot:
```bash
npm start
```

2. Add your bot on Telegram by searching for your bot's username

3. Start interacting with the bot using these commands:
   - `/start` - Initialize the bot
   - `🏡 Search Property` - Start property search
   - `📤 Upload Property` - List a new property
   - `🌐 Website` - Visit the website
   - `📞 Contact Agent` - Contact support

## 💻 Technology Stack

- **Node.js** - Backend runtime environment
- **Supabase** - Database and storage
- **Railway** - Deployment platform
- **Telegram Bot API** - Bot interface

## 📋 Property Types
The bot supports these property types:
- Studio
- Maid's Room
- Sharing
- 1BHK to 4BHK+
- Penthouse
- Duplex
- Loft
- Villa
- Warehouse

## 🎯 Demo

Try the bot here: [@FindHomeDXB_bot](https://t.me/Find_Home_DXB_Bot)

### 📱 Web Interface Screenshots

<p align="center">
  <img src="/screenshot1.png" alt="FindHomeDXB Property Listing" width="400"/>
  <br><br>
  <img src="/screenshot2.png" alt="FindHomeDXB Search Interface" width="400"/>
  <br><br>
  <img src="/screenshot3.png" alt="FindHomeDXB Search Interface" width="400"/>
</p>

## 📄 License

This project is licensed under the MIT License.
