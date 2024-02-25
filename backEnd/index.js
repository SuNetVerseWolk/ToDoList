const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('node:path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../ToDoList/dist')));

const PORT = 3002;
const PATH = 'data.json';

const noteData = JSON.parse(fs.readFileSync(PATH));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../ToDoList/dist/index.html')));

app.get('/api', (req, res) => {
  fs.readFile(PATH, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading notes.json' });

      return;
    }

    res.json(JSON.parse(data));
  });
});

app.post('/setInfo', cors(), (req, res) => {
  const infoNote = {
      id: Date.now(),
      text: req.body.text
  }
  const newNoteData = [infoNote, ...noteData];

  fs.writeFile(PATH, JSON.stringify(newNoteData, null, 2), { encoding: 'utf-8' }, (error) => console.log(error));

  res.redirect('/api')
});

app.post('/setDeleted', (req, res) => {
  const noteIndex = req.body.itemID;
  noteData.splice(noteIndex, 1);

  fs.writeFile(PATH, JSON.stringify(noteData, null, 2), { encoding: 'utf-8' }, (error) => console.log(error));

  res.redirect('/api');
});

app.post('/setChanges', (req, res) => {
  const noteIndex = noteData[req.body.itemID];
  noteIndex.text = req.body.newText;

  fs.writeFile(PATH, JSON.stringify(noteData, null, 2), { encoding: 'utf-8' }, (error) => console.log(error));

  res.redirect('/api');
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));