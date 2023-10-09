'use client';

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Image from 'next/image';
import { useRef, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useChat } from 'ai/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Page() {
  const [status, setStatus] = useState<'init'|'listning'|'typing'|'result'>('init')
  const [thinking, setThinking] = useState('');
  const bioRef = useRef<null | HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStart = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'ja-JP',
    });
    setStatus('listning')
  };

  const handleEnd = () => {
    setInput(transcript);
    setThinking(transcript);
    SpeechRecognition.stopListening();
    resetTranscript();
    setStatus('typing')
  }

  const handleChange = (e: any) => {
    handleInputChange(e);
    setThinking(e.target.value);
  }
  
  const { input, setInput, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      body: {
        thinking 
      },
      onResponse() {
        scrollToBios();
      },
    });

  const onSubmit = (e: any) => {
    console.log('thinking',thinking);
    handleSubmit(e);
    setStatus('result')
  };

  const lastMessage = messages[messages.length - 1];
  const generatedBios = lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20 max-w-xl">
        <Image
          width={200}
          height={200}
          src={'/rubberduck.png'}
          alt={'rubberduck'}
        />
        {status === 'init' && (
          <>
            <div>
              <p>あなたのモヤモヤ悩んでいることを、とにかく話してみて！</p>
            </div>
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={handleStart}
            >
              考えごとを話してみる
            </button>
          </>
        )}
        {status === 'listning' && listening && (
          <>
            <p>{transcript || 'あなたが話し始めるのを待っています…'}</p>
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={handleEnd}
              >
              書きおこしを終わる
            </button>
          </>
        )}
        {status === 'typing' && (
          <>   
            <form className="w-full" onSubmit={onSubmit}>
              <div className="flex mt-10 items-center space-x-3">
                <p className="text-left font-medium">
                  この内容でOK？
                </p>
              </div>
              <textarea
                value={input}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={
                  '考えていることをテキストにかきおこしてみよう！'
                }
                />

              {!isLoading && (
                <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                type="submit"
                >
                  OK!
                </button>
              )}
              {isLoading && (
                <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled
                >
                  <span className="loading">
                    <span style={{ backgroundColor: 'white' }} />
                    <span style={{ backgroundColor: 'white' }} />
                    <span style={{ backgroundColor: 'white' }} />
                  </span>
                </button>
              )}
            </form>
          </>
        )}
        {status === 'result' && (
          <output className="space-y-10 my-10">
            {generatedBios ? (
              <>
                <div>
                  <h2
                    className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                    ref={bioRef}
                    >
                    あなたの考えを整理してみたよ！
                  </h2>
                </div>
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  {generatedBios}
                  {/* TODO: ここをマークダウンに対応させる */}
                </div>
              </>
            ) : <p>うーん…ちょっとまってね…</p>}
          </output>
        )}
      </main>
      <Footer />
    </div>
  );
}
