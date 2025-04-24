require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const bodyParser = require('body-parser');
// Re-deploy
// Constants
const MAX_PHOTOS = 10;
const WEBSITE_URL = 'https://bot-find-home-dubai.web.app/';
const AGENT_CONTACT = 'wa.me/+971557295662';
const PROPERTIES_PER_PAGE = 5;

const PROPERTY_TYPES = [
  'Studio',
  'Maid\'s Room',
  'Sharing',
  '1BHK',
  '2BHK',
  '3BHK',
  '4BHK or more',
  'Penthouse',
  'Duplex',
  'Loft',
  'Villa',
  'Warehouse'
];

// Initialize clients
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express();

// Middleware
app.use(bodyParser.json());

// Session storage with cleanup
const userSessions = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Track blocked chats to avoid sending messages to them
const blockedChats = new Set();

function cleanupSessions() {
  const now = Date.now();
  for (const [userId, session] of userSessions.entries()) {
    if (now - session.lastActive > SESSION_TIMEOUT) {
      userSessions.delete(userId);
    }
  }
}

setInterval(cleanupSessions, 15 * 60 * 1000); // Run cleanup every 15 minutes

// Function to check if user has a valid session
function hasValidSession(userId) {
  const session = userSessions.get(userId);
  return session && Date.now() - session.lastActive <= SESSION_TIMEOUT;
}

// Safe message sending function
async function safeSendMessage(chatId, text, extra = {}) {
  if (blockedChats.has(chatId)) {
    console.log(`Skipping message to blocked chat ${chatId}`);
    return null;
  }
  
  try {
    return await bot.telegram.sendMessage(chatId, text, extra);
  } catch (error) {
    if (error.description && 
        (error.description.includes('blocked') || 
         error.description.includes('kicked') || 
         error.description.includes('Forbidden'))) {
      blockedChats.add(chatId);
      console.log(`Adding chat ${chatId} to blocked list`);
    }
    console.error(`Error sending message to ${chatId}:`, error.description || error);
    return null;
  }
}

// Safe media sending function
async function safeSendMediaGroup(chatId, mediaGroup) {
  if (blockedChats.has(chatId)) {
    console.log(`Skipping media to blocked chat ${chatId}`);
    return null;
  }
  
  try {
    return await bot.telegram.sendMediaGroup(chatId, mediaGroup);
  } catch (error) {
    if (error.description && 
        (error.description.includes('blocked') || 
         error.description.includes('kicked') || 
         error.description.includes('Forbidden'))) {
      blockedChats.add(chatId);
      console.log(`Adding chat ${chatId} to blocked list`);
    }
    console.error(`Error sending media to ${chatId}:`, error.description || error);
    return null;
  }
}

// Keyboard layouts
const mainKeyboard = Markup.keyboard([
  ['🏡 Search Property', '📤 Upload Property'],
  ['🌐 Website', '📞 Contact Agent']
]).resize();

const propertyTypeKeyboard = Markup.keyboard([
  ['Studio', 'Maid\'s Room', 'Sharing'],
  ['1BHK', '2BHK', '3BHK'],
  ['4BHK or more', 'Penthouse'],
  ['Duplex', 'Loft', 'Villa'],
  ['Warehouse'],
  ['↩️ Back to Main Menu']
]).resize();

// Add new keyboard layouts for Any/Skip options
const anyTypeKeyboard = Markup.keyboard([
  ['Any'],
  ...PROPERTY_TYPES.reduce((acc, curr, i) => {
    if (i % 3 === 0) acc.push([]);
    acc[acc.length - 1].push(curr);
    return acc;
  }, []),
  ['↩️ Back to Main Menu']
]).resize();

const skipPriceKeyboard = Markup.keyboard([
  ['Skip'],
  ['↩️ Back to Main Menu']
]).resize();

const anyLocationKeyboard = Markup.keyboard([
  ['Any'],
  ['↩️ Back to Main Menu']
]).resize();

// Command handlers
bot.command('start', async (ctx) => {
  try {
    await safeSendMessage(ctx.chat.id, "Welcome to Dubai Property Bot! 🌆\nFind your perfect home or list your property with us.", mainKeyboard);
  } catch (error) {
    console.error('Error in start command:', error);
  }
});

bot.hears('🌐 Website', async (ctx) => {
  try {
    await safeSendMessage(ctx.chat.id, `Visit our website: ${WEBSITE_URL}`);
  } catch (error) {
    console.error('Error in website command:', error);
  }
});

bot.hears('📞 Contact Agent', async (ctx) => {
  try {
    await safeSendMessage(ctx.chat.id, `Contact our agent via WhatsApp: ${AGENT_CONTACT}`);
  } catch (error) {
    console.error('Error in contact agent command:', error);
  }
});

bot.hears('↩️ Back to Main Menu', async (ctx) => {
  try {
    await safeSendMessage(ctx.chat.id, 'Main Menu:', mainKeyboard);
  } catch (error) {
    console.error('Error in back to menu command:', error);
  }
});

// Property upload flow
bot.hears('📤 Upload Property', async (ctx) => {
  try {
    userSessions.set(ctx.from.id, {
      step: 'description',
      photos: [],
      lastActive: Date.now()
    });
    await safeSendMessage(ctx.chat.id, 'Please provide a detailed description of the property:');
  } catch (error) {
    console.error('Error in upload property command:', error);
  }
});

// Property search flow
bot.hears('🏡 Search Property', async (ctx) => {
  try {
    userSessions.set(ctx.from.id, {
      step: 'search_type',
      filters: {},
      propertyIndex: 0,
      lastActive: Date.now()
    });
    await safeSendMessage(ctx.chat.id, 'Select property type:', anyTypeKeyboard);
  } catch (error) {
    console.error('Error in search property command:', error);
  }
});

// Handler para 'done' en la subida de fotos
bot.hears('done', async (ctx) => {
  try {
    const session = userSessions.get(ctx.from.id);
    if (!session || session.step !== 'photos') return;

    if (session.photos.length === 0) {
      await safeSendMessage(ctx.chat.id, 'Please send at least one photo of the property.');
      return;
    }

    await saveProperty(ctx);
  } catch (error) {
    console.error('Error in done command:', error);
  }
});

// Message handler para textos
bot.on('text', async (ctx) => {
  try {
    const session = userSessions.get(ctx.from.id);
    
    // Verify if this is a valid session or a main menu command
    const mainMenuCommands = ['🏡 Search Property', '📤 Upload Property', '🌐 Website', '📞 Contact Agent', '↩️ Back to Main Menu'];
    if (!session && !mainMenuCommands.includes(ctx.message.text)) {
      return;
    }

    if (session) {
      session.lastActive = Date.now();
    }

    switch (session?.step) {
      case 'description':
        session.description = ctx.message.text;
        session.step = 'price';
        await safeSendMessage(ctx.chat.id, 'Enter the monthly price (AED):\nExample: 5000');
        break;

      case 'price':
        const price = parseFloat(ctx.message.text);
        if (isNaN(price) || price <= 0) {
          await safeSendMessage(ctx.chat.id, 'Please enter a valid price in AED.');
          return;
        }
        session.price = price;
        session.step = 'type';
        await safeSendMessage(ctx.chat.id, 'Select the property type:', propertyTypeKeyboard);
        break;

      case 'type':
        if (!PROPERTY_TYPES.includes(ctx.message.text)) {
          await safeSendMessage(ctx.chat.id, 'Please select a valid property type from the keyboard.');
          return;
        }
        session.type = ctx.message.text;
        session.step = 'location';
        await safeSendMessage(ctx.chat.id, 'Enter the location of the property:');
        break;

      case 'location':
        session.location = ctx.message.text;
        session.step = 'contact';
        await safeSendMessage(ctx.chat.id, 'Enter your contact phone number:\nExample: +971 XX XXX XXXX');
        break;

      case 'contact':
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(ctx.message.text)) {
          await safeSendMessage(ctx.chat.id, 'Please enter a valid phone number.');
          return;
        }
        session.contact_info = ctx.message.text;
        session.step = 'photos';
        await safeSendMessage(ctx.chat.id, `Please send up to ${MAX_PHOTOS} photos of the property.\nType 'done' when finished.`);
        break;

      case 'search_type':
        if (ctx.message.text === 'Any') {
          delete session.filters.type;
        } else if (PROPERTY_TYPES.includes(ctx.message.text)) {
          session.filters.type = ctx.message.text;
        } else {
          await safeSendMessage(ctx.chat.id, 'Please select a valid property type:', anyTypeKeyboard);
          return;
        }
        session.step = 'search_price_min';
        await safeSendMessage(ctx.chat.id, 'Enter minimum price in AED:', skipPriceKeyboard);
        break;

      case 'search_price_min':
        if (ctx.message.text === 'Skip') {
          delete session.filters.min_price;
        } else {
          const minPrice = parseFloat(ctx.message.text);
          if (isNaN(minPrice) || minPrice < 0) {
            await safeSendMessage(ctx.chat.id, 'Please enter a valid price or click Skip:', skipPriceKeyboard);
            return;
          }
          session.filters.min_price = minPrice;
        }
        session.step = 'search_price_max';
        await safeSendMessage(ctx.chat.id, 'Enter maximum price in AED:', skipPriceKeyboard);
        break;

      case 'search_price_max':
        if (ctx.message.text === 'Skip') {
          delete session.filters.max_price;
        } else {
          const maxPrice = parseFloat(ctx.message.text);
          if (isNaN(maxPrice) || maxPrice < 0) {
            await safeSendMessage(ctx.chat.id, 'Please enter a valid price or click Skip:', skipPriceKeyboard);
            return;
          }
          if (session.filters.min_price && maxPrice < session.filters.min_price) {
            await safeSendMessage(ctx.chat.id, 'Maximum price must be greater than minimum price');
            return;
          }
          session.filters.max_price = maxPrice;
        }
        session.step = 'search_location';
        await safeSendMessage(ctx.chat.id, 'Enter the location you\'re interested in:', anyLocationKeyboard);
        break;

      case 'search_location':
        if (ctx.message.text === 'Any') {
          delete session.filters.location;
        } else {
          session.filters.location = ctx.message.text;
        }
        session.step = 'searching';
        await searchProperties(ctx);
        break;
    }
  } catch (error) {
    console.error('Error in text handler:', error);
  }
});

// Photo handler
bot.on('photo', async (ctx) => {
  try {
    const session = userSessions.get(ctx.from.id);
    if (!session || session.step !== 'photos') return;

    session.lastActive = Date.now();

    const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    session.photos.push(photoId);

    if (session.photos.length >= MAX_PHOTOS) {
      await saveProperty(ctx);
    } else {
      await safeSendMessage(ctx.chat.id, `Photo ${session.photos.length}/${MAX_PHOTOS} received. Send more or type 'done'.`);
    }
  } catch (error) {
    console.error('Error handling photo:', error);
  }
});

// Save property function
async function saveProperty(ctx) {
  try {
    const session = userSessions.get(ctx.from.id);
    if (!session) return;

    const propertyData = {
      description: session.description,
      price: session.price,
      type: session.type,
      location: session.location,
      contact_info: session.contact_info,
      photos: session.photos,
      created_at: new Date().toISOString(),
      user_id: ctx.from.id,
      verified_by_admin: '-'  // Default value for admin verification
    };

    const { error } = await supabase.from('properties').insert([propertyData]);
    if (error) throw error;

    await safeSendMessage(ctx.chat.id, 'Property listed successfully! ✅\nReturn to main menu:', mainKeyboard);
    userSessions.delete(ctx.from.id);
  } catch (error) {
    console.error('Error saving property:', error);
    await safeSendMessage(ctx.chat.id, 'Error saving property. Please try again.');
  }
}

// Search properties function
async function searchProperties(ctx) {
  try {
    const session = userSessions.get(ctx.from.id);
    if (!session) return;

    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (session.filters.type) {
      query = query.eq('type', session.filters.type);
    }
    if (session.filters.location) {
      query = query.ilike('location', `%${session.filters.location}%`);
    }
    if (session.filters.min_price) {
      query = query.gte('price', session.filters.min_price);
    }
    if (session.filters.max_price) {
      query = query.lte('price', session.filters.max_price);
    }

    // Get all properties that match the criteria
    const { data: properties, error } = await query;

    if (error) throw error;

    if (!properties.length) {
      await safeSendMessage(ctx.chat.id, 'No properties found matching your criteria. Try adjusting your filters:', 
        Markup.inlineKeyboard([
          Markup.button.callback('🔄 New Search', 'new_search')
        ])
      );
      return;
    }

    // Show applied filters summary only for the first property
    if (session.propertyIndex === 0) {
      let filterSummary = '🔍 Search Results\n';
      if (session.filters.type) filterSummary += `\nType: ${session.filters.type}`;
      if (session.filters.location) filterSummary += `\nLocation: ${session.filters.location}`;
      if (session.filters.min_price) filterSummary += `\nMin Price: AED ${session.filters.min_price.toLocaleString()}`;
      if (session.filters.max_price) filterSummary += `\nMax Price: AED ${session.filters.max_price.toLocaleString()}`;
      await safeSendMessage(ctx.chat.id, filterSummary);
    }

    // Get current property
    const property = properties[session.propertyIndex];

    const caption = `
📝 ${property.description}
💰 AED ${property.price.toLocaleString()}/month
📍 ${property.location}
🏠 ${property.type}
Verified by admin: ${property.verified_by_admin}
Property ${session.propertyIndex + 1} of ${properties.length}
    `.trim();

    const mediaGroup = property.photos.map((photoId, index) => ({
      type: 'photo',
      media: photoId,
      caption: index === 0 ? caption : undefined,
    }));

    await safeSendMediaGroup(ctx.chat.id, mediaGroup);

    // Create buttons based on current position
    const buttons = [];
    buttons.push(Markup.button.callback('📞 Contact', `contact_${property.id}`));
    
    buttons.push(Markup.button.callback('🔄 New Search', 'new_search'));
    
    if (session.propertyIndex < properties.length - 1) {
      buttons.push(Markup.button.callback('👇 Next', 'next_property'));
    }

    await safeSendMessage(ctx.chat.id, 'Options:', 
      Markup.inlineKeyboard(buttons)
    );
  } catch (error) {
    console.error('Error searching properties:', error);
    await safeSendMessage(ctx.chat.id, 'Error searching properties. Please try again.');
  }
}

// Action handlers
bot.action(/^contact_(\d+)$/, async (ctx) => {
  try {
    const propertyId = ctx.match[1];
    const { data: property } = await supabase
      .from('properties')
      .select('contact_info')
      .eq('id', propertyId)
      .single();

    if (property) {
      await safeSendMessage(ctx.chat.id, `📞 Contact number: ${property.contact_info}`);
    }
    await ctx.answerCbQuery().catch(e => console.error('Error in answerCbQuery:', e));
  } catch (error) {
    console.error('Error showing contact:', error);
    try {
      await safeSendMessage(ctx.chat.id, 'Error loading contact information. Please try again.');
      await ctx.answerCbQuery().catch(e => console.error('Error in answerCbQuery:', e));
    } catch (replyError) {
      console.error('Error in contact action reply:', replyError);
    }
  }
});

bot.action('next_property', async (ctx) => {
  try {
    const session = userSessions.get(ctx.from.id);
    if (session) {
      session.propertyIndex++;
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (session.propertyIndex >= properties.length) {
        await safeSendMessage(ctx.chat.id, 'There are no more results to show according to your search criteria.');
      } else {
        await searchProperties(ctx);
      }
    }
    await ctx.answerCbQuery().catch(e => console.error('Error in answerCbQuery:', e));
  } catch (error) {
    console.error('Error in next_property action:', error);
  }
});

bot.action('new_search', async (ctx) => {
  try {
    userSessions.set(ctx.from.id, {
      step: 'search_type',
      filters: {},
      propertyIndex: 0,
      lastActive: Date.now()
    });
    await safeSendMessage(ctx.chat.id, 'Select property type:', anyTypeKeyboard);
    await ctx.answerCbQuery().catch(e => console.error('Error in answerCbQuery:', e));
  } catch (error) {
    console.error('Error in new_search action:', error);
  }
});

// Improved error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  
  // Only try to reply if the error is not related to permissions
  if (ctx && ctx.chat && (!err.description || 
      (!err.description.includes('blocked') && 
       !err.description.includes('kicked') && 
       !err.description.includes('Forbidden')))) {
    try {
      safeSendMessage(ctx.chat.id, 'An error occurred. Please try again later.')
        .catch(e => console.error('Could not send error message:', e));
    } catch (replyError) {
      console.error('Error while sending error reply:', replyError);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start bot and server
const port = process.env.PORT || 3000;

Promise.all([
  bot.launch(),
  new Promise((resolve) => app.listen(port, resolve))
])
.then(() => {
  console.log(`Bot and server running on port ${port}`);
})
.catch(error => {
  console.error('Startup error:', error);
  process.exit(1);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));