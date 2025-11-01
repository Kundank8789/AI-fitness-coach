import Head from 'next/head';
import Header from '../components/Header';
import ChatUI from '../components/ChatUI';

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI Fitness Coach</title>
      </Head>
      <main className="container">
        <Header />
        <section style={{marginTop:20}}>
          <h2>Generate Personalized Plan</h2>
          <ChatUI />
        </section>
      </main>
    </div>
  );
}
