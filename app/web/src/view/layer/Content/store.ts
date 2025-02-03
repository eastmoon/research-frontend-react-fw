// Import Libraries
import MVC from "@/framework/pattern/facade/mvc";
import { Mediator } from "@/framework/pattern/mediator";
import { create } from 'zustand';

// Declare instance object
if (!MVC.view.has("Content")) MVC.register(new Mediator("Content"));
export default MVC.view.retrieve("Content");

//
export interface ContentStore {
  count: number
  inc: (state: any) => void
  dec: (state: any) => void
}

export const useStore = create<ContentStore>((set) => ({
  count: 1,
  inc: () => set((state : any) => ({ count: state.count + 1 })),
  dec: () => set((state : any) => ({ count: state.count - 1 })),
}));
