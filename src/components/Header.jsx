import React from 'react';

export default function Header(){
  return (
    <div className="header">
      <div>
        <h1 style={{margin:0}}>Kundan's AI Fitness Coach</h1>
        <div style={{fontSize:13, color:'#334155'}}>Full Stack & AI Demo</div>
      </div>
      <div>
        <a href="https://www.linkedin.com/in/kundan-kumar-3907a3352" target="_blank" rel="noreferrer" style={{marginRight:12}}>LinkedIn</a>
        <a href="https://github.com/Kundank8789" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  )
}
