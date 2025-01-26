"use client";

import React, { useState } from 'react';
import Button from '../components/ui/button';
import Input from '../components/ui/input';

const App: React.FC = () => {
    const [text, setText] = useState('');

  return (
    <div className='flex flex-col items-center gap-12 w-full'>
        <div className='flex flex-col items-center gap-5 mt-12'>
            <Button variant="default" size="large">
                Логин
            </Button>
            <Button variant="outline" size="long">
                Регистрация
            </Button>
        </div>

        <div className='flex flex-col gap-5'>
            <Input
            type="text"
            placeholder="Введите текст"
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="small"
            />
            <br />
            <Input
            type="password"
            placeholder="Введите пароль"
            size="medium"
            />
            <br />
            <Input
            type="email"
            placeholder="Введите email"
            size="large"
            disabled
            />
        </div>
    </div>
  );
};

export default App;
