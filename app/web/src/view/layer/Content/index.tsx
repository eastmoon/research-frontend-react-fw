import './index.css'
import MVC from "@/framework/pattern/facade/mvc";
import ContentMediator, { useStore } from './store';
let intevalId : Number = 0;

function Content() {
  const { count, inc } = useStore()
  ContentMediator.attachEvent("main", "onfocus", inc);

  if (intevalId === 0) {
      intevalId = setInterval(() => {
          if ( (count % 2) === 0)
              ContentMediator.on("main", "onfocus");
          else
              MVC.on("Content", "main", "onfocus");
      }, 1000);
  }
  if ( count === 50 ) {
      clearInterval(intevalId);
  }

  return (
    <div className="content-layer-rule">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={inc}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default Content
