const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Conectamos con tu cuenta usando las llaves del .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

module.exports = supabase;
