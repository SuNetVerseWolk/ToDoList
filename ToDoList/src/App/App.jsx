import React, { useState, useEffect } from 'react'
import '../global/global.css'
import styles from "./app.module.css"
import { animate, motion } from 'framer-motion'
import axios from 'axios'
import Item from '../components/Item'

const App = () => {
  const [data, setData] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3002/api');
      const data = await res.json();
    
      setData(data);
    }

    fetchData();
  }, []);

  const postText = async () => {
    try {
      if (text !== '')
        await axios.post('http://localhost:3002/setInfo', {
            text
        });

      const res = await fetch('http://localhost:3002/api');
      const data = await res.json();

      setData(data);
      setText('');
    } catch(err) { console.log(err) }
  }

  return (
    <>
      <main>
        <motion.div whileHover={{boxShadow: 'inset #fc9e1a44 0 0 100px'}} id='mainImg' className={styles.mainImg}></motion.div>

        <div id='container'>
          <div className={styles.inputContainer}>
            <motion.input whileFocus={{borderColor: '#fc9e1a49'}} id='textInput' value={text} onChange={e => setText(e.target.value)} type="text" placeholder='Enter your note...' />

            <motion.button whileTap={{scale: 1.1}} onClick={() => {
              postText();

              animate('#mainImg', {
                translate: '-100%',
              });

              setTimeout(() => {
                    document.querySelector('main').style = `
                      display: flex;
                      justify-content: center;
                    `;
              }, 300);
            }}><img src="/png/add-button.png" alt="" /></motion.button>
          </div>

          {
            data.map((note, index) => (
              <Item key={note.id} note={note} setData={setData} ID={index}/>
            ))
          }
        </div>
      </main>
    </>
  )
}

export default App
