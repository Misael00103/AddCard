const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

const supabaseUrl = 'https://ezapuhzcecxfrulusemb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YXB1aHpjZWN4ZnJ1bHVzZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njc1MDUsImV4cCI6MjA3NjA0MzUwNX0.AxhTRCLsrwNmyyv5_R6BXVaOUR4YNgRCCtvKEhs3PC0';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.get('/cards', async (req, res) => {
  console.log(`📡 GET /cards - Status: 200 - Fetching all cards`);
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*');
    if (error) throw error;
    console.log(`✅ GET /cards - Returned ${data?.length || 0} cards`);
    res.status(200).json(data || []);
  } catch (error) {
    console.log(`❌ GET /cards - Status: 500 - Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.get('/cards/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`🔍 GET /cards/${id} - Looking for card ID: ${id}`);
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      console.log(`✅ GET /cards/${id} - Status: 200 - Card found`);
      res.status(200).json(data);
    } else {
      console.log(`❌ GET /cards/${id} - Status: 404 - Card not found`);
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    console.log(`❌ GET /cards/${id} - Status: 500 - Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.post('/cards', async (req, res) => {
  const { number, exp, name } = req.body;
  console.log(`➕ POST /cards - Status: 201 - New card:`);
  console.log(`   Número: ${number}`);
  console.log(`   Vencimiento: ${exp}`);
  console.log(`   Nombre: ${name}`);
  console.log(`   Full body: ${JSON.stringify(req.body, null, 2)}`);
  
  try {
    const { data, error } = await supabase
      .from('cards')
      .insert([{ number, exp, name }])
      .select() 
      .single();
    
    if (error) throw error;
    
    console.log(`✅ POST /cards - Status: 201 - Card created:`);
    console.log(`   ID: ${data.id}`);
    console.log(`   Full response: ${JSON.stringify(data, null, 2)}`);
    
    res.status(201).json(data);
  } catch (error) {
    console.log(`❌ POST /cards - Status: 500 - Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.put('/cards/:id', async (req, res) => {
  const id = req.params.id;
  const { number, exp, name } = req.body;
  console.log(`✏️ PUT /cards/${id} - Status: 200 - Updating card:`);
  console.log(`   Número: ${number}`);
  console.log(`   Vencimiento: ${exp}`);
  console.log(`   Nombre: ${name}`);
  
  try {
    const { data, error } = await supabase
      .from('cards')
      .update({ number, exp, name })
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      console.log(`✅ PUT /cards/${id} - Status: 200 - Card updated`);
      res.status(200).json(data);
    } else {
      console.log(`❌ PUT /cards/${id} - Status: 404 - Card not found`);
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    console.log(`❌ PUT /cards/${id} - Status: 500 - Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/cards/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`🗑️ DELETE /cards/${id} - Deleting card ID: ${id}`);

  try {
    const { data, error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)
      .select(); // <-- Esto es importante para obtener el registro eliminado

    if (error) {
      console.log(`❌ DELETE /cards/${id} - Status: 500 - Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      console.log(`❌ DELETE /cards/${id} - Status: 404 - Card not found`);
      return res.status(404).json({ message: 'Card not found' });
    }
    console.log(`✅ DELETE /cards/${id} - Status: 204 - Card deleted`);
    res.status(204).send();
  } catch (error) {
    console.log(`❌ DELETE /cards/${id} - Status: 500 - Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET    /cards           - List all cards (200)`);
  console.log(`   GET    /cards/:id       - Get card (200/404)`);
  console.log(`   POST   /cards           - Create card (201)`);
  console.log(`   PUT    /cards/:id       - Update card (200/404)`);
  console.log(`   DELETE /cards/:id       - Delete card (204/404)`);
});