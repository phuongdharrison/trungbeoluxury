import React from 'react'
import './frontend.css'
export default function Layout({children}:{children:React.ReactNode}){return <html lang="vi"><head><link rel="stylesheet" href="/style.css"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet"/></head><body>{children}</body></html>}
