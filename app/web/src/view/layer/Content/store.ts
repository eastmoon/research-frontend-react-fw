// Import Libraries
import MVC from "@/framework/pattern/facade/mvc";
import { Mediator } from "@/framework/pattern/mediator";
import { create } from 'zustand';

// Declare instance object
if (!MVC.view.has("Content")) MVC.register(new Mediator("Content"));
let instance : Mediator = MVC.view.retrieve("Content");
export default instance;

//
export const useStore = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
}));
