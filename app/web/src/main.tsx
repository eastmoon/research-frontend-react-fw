import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/view/page'
import MVC from "@/framework/pattern/facade/mvc";
import "@/cont/startup";
import "@/cont/navigate";

console.log( MVC.instance );
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
