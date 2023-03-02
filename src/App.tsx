import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { Editor, Image, Overlay } from './components';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className='App'>
            <div>
                <a href='https://vitejs.dev' target='_blank'>
                    <img src='/vite.svg' className='logo' alt='Vite logo' />
                </a>
                <a href='https://reactjs.org' target='_blank'>
                    <img src={reactLogo} className='logo react' alt='React logo' />
                </a>
            </div>
            <h1>react-crop</h1>
            <Editor style={{ width: 500, height: 500, border: '5px solid pink' }}>
                <Image
                    src='https://www.pngitem.com/pimgs/m/129-1292712_transparent-emotes-for-cute-emojis-for-discord-hd.png'
                    style={{ objectFit: 'contain' }}
                />
                <Overlay style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </Editor>
        </div>
    );
}

export default App;
