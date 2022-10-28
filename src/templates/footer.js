import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: '12px',
      }}
    >
      © <a href="mailto:leo.wei.liu@gmail.com">Wei Liu</a> | <a href="/static/game.html">{year}</a>
    </div>
  )
}

export default Footer
