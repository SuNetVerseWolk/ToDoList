const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3002;
const PATH = 'data.json';

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
	const noteData = JSON.parse(fs.readFileSync(PATH));

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