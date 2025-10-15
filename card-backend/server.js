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
  const { data, error } = await supabase
    .from('cards')
    .select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

app.get('/cards/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.post('/cards', async (req, res) => {
  const { number, exp, name } = req.body;
  if (!number || !exp || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const { data, error } = await supabase
    .from('cards')
    .insert([{ number, exp, name }])
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

app.put('/cards/:id', async (req, res) => {
  const { number, exp, name } = req.body;
  const { data, error } = await supabase
    .from('cards')
    .update({ number, exp, name })
    .eq('id', req.params.id)
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.delete('/cards/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('cards')
    .delete()
    .eq('id', req.params.id)
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
