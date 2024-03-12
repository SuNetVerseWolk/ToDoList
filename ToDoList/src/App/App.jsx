import React, { useState, useEffect } from 'react'
import '../global/global.css'
import styles from "./app.module.css"
import { animate, motion } from 'framer-motion'
import axios from 'axios'
import Item from '../components/Item'
import addBtnPng from '/png/add-button.png'
import Loading from '../components/loading'

const App = () => {
	const [data, setData] = useState([]);
	const [text, setText] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const abortcontroler = new AbortController();
			const signal = abortcontroler.signal;

			try {
				setLoading(true);

				await fetch(import.meta.env.VITE_DB + '/api')
				.then(res => res.json())
				.then(
					(result) => setData(result),
					(error) => console.log(error)
				);

			} catch (error) {
				alert("Sorry but something went wrong :(");

			} finally {
				setLoading(false);

			}
		}

		fetchData();
	}, []);

	const postText = async () => {
		try {
			if (text !== '') {
				const newNote = { text: text, id: crypto.randomUUID() };

				setData(prev => [newNote, ...prev]);
				setText('');

				await axios.post(import.meta.env.VITE_DB + '/setInfo', newNote);
			}
		} catch (err) { console.log(err) }
	}

	return (
		<>
			<main>
				<motion.div whileHover={{ boxShadow: 'inset #fc9e1a44 0 0 100px' }} id='mainImg' className={styles.mainImg}></motion.div>

				<div id='container'>
					<div className={styles.inputContainer}>
						<motion.input whileFocus={{ borderColor: '#fc9e1a49' }} id='textInput' value={text} onChange={e => setText(e.target.value)} type="text" placeholder='Enter your note...' />

						<motion.button whileTap={{ scale: 1.1 }} onClick={() => {
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
						}}><img src={addBtnPng} alt="" /></motion.button>
					</div>

					{
						isLoading && (
							<Loading />
						) || (
							data.map((note, index) => (
								<Item key={note.id} note={note} setData={setData} ID={index} />
							))
						)
					}
				</div>
			</main>
		</>
	)
}

export default App
