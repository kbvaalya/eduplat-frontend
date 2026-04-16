import React from 'react';
import './WelcomPage.css';
import imag from '../../../assets/Group 46903.svg'

function WelcomPage({onNavigate}){
    return(
        <div className='container'>
            <div>
                <div className='bigCm'></div>
                <img src={imag} alt='' className='img'></img>
                <div className="App">
                    <div className='text'>
                        <h1>Добро пожаловать!</h1>
                        <p>Начни свой путь к поступлению уже <br/>
                         сейчас!</p>
                    </div>
                    <div className='but'>
                        <button className='button1' onClick={() => onNavigate("register")}>Создать аккаунт</button>
                        <button className='button2' onClick={() => onNavigate("login")}>Войти</button>
                    </div>
                </div>
        </div>
        </div>
    );
}
export default WelcomPage;