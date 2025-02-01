import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/view/page'
import MVC from "@/framework/pattern/facade/mvc";
import "@/cont/startup";
import "@/cont/navigate";
import "@/model/service/api";
import "@/model/proxy/counter";

console.log( MVC.instance );
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
