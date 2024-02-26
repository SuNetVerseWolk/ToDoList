import styles from './styleItem.module.css'
import React, { useRef, useState } from 'react'
import { animate, motion } from 'framer-motion'
import axios from 'axios'
import cPng from '/png/c.png'
import binPng from '/png/bin.png'
import floppyDiskPng from '/png/floppy-disk.png'

const Item = ({ ID, note, setData }) => {
    const [imgSrc, setImgSrc] = useState(cPng);
    const [textEditable, setTextEditable] = useState(false);
    const textAreaRef = useRef(null);

    const handleDelete = async (ID) => {
      try {
        await axios.post('https://todolist-t01a.onrender.com/setDeleted', { itemID: ID });
        
        const res = await fetch('https://todolist-t01a.onrender.com/api');
        const noteData = await res.json();
  
        setData(noteData);
      } catch(err) { console.log(err)}
    }

    const handleChanges = async (ID, text) => {
      try {
        await axios.post('https://todolist-t01a.onrender.com/setChanges', { itemID: ID, newText: text});
  
        const res = await fetch('https://todolist-t01a.onrender.com/api');
        const noteData = await res.json();
  
        setData(noteData);
      } catch(err) { console.log(err)}
    }

    const toggleImage = (ID) => {
      setImgSrc(prevSrc => prevSrc === cPng ? floppyDiskPng : cPng);
      setTextEditable(prevEditable => !prevEditable);

      if (textEditable) handleChanges(ID, textAreaRef.current.textContent);
    }

    return (
      <>
        <motion.div whileInView={{x: [-100, 0]}} whileHover={{
          background: 'none',
          color: '#fff',
          borderBottom: '#fc9e1a 10px solid'
        }} transition={{delay: ID * 0.1}} id={`item${ID}`} className={styles.Item}>
          <div id='textArea' contentEditable={textEditable} className={styles.textArea} ref={textAreaRef}>{note.text}</div>

          <div>
            <motion.button whileTap={{scale: 1.1}} onClick={() => {
              toggleImage(ID);
            }}><img className='imgC' src={imgSrc} alt="" /></motion.button>
            <motion.button whileTap={{scale: 1.1}} onClick={() => {
              animate(`#item${ID}`, {
                x: '-50px'
              });

              setTimeout(() => handleDelete(ID), 150);
            }} className={styles.delete}><img src={binPng} alt="" /></motion.button>
          </div>
        </motion.div>
      </>
    )
}

export default Item