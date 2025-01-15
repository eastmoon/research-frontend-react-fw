/*
Container data structure.

Container is a object manage class, which could to register, remove, has, retrieve action.

author: jacky.chen
*/

// Declare interface
export interface IContainer<T> {
    register($name : string, $content : T) : boolean;
    remove($name : string) : boolean;
    retrieve($name: string) : T | null;
    has($name : string) : boolean;
    get size() : number;
    get keys() : string[];
}

// Declare class
export class Container<T> implements IContainer<T> {
    // Member variable
    protected contents : { [key : string] : T} = {};

    // Method
    // register content
    // @parame [name, object] :
    // @return : true, register success. false, register fail or parameter input wrong.
    register($name : string, $content : T ) : boolean {
        if (!this.has($name) && $content !== null && $content !== undefined) {
            this.contents[$name] = $content;
            return true;
        }
        return false;
    }

    // remove content
    // @parame [name] :
    // @return : true, remove success. false, remove fail or parameter input wrong.
    remove($name : string) : boolean {
      if (this.has($name)) {
          delete this.contents[$name]
          return true;
      }
      return false;
    }

    // retrieve
    // Take back content.
    // @parame [name] :
    // @return : Object, null is object not find in container.
    retrieve($name : string) : T | null {
      if (this.has($name)) {
          return this.contents[$name]
      }
      return null;
    }

    // has
    // Check content is exist in container, and return true, otherwise return false.
    // @parame [name] :
    // @return : treu is exist in container, false is not exist.
    has($name : string) : boolean {
        return (this.contents[$name] !== undefined && this.contents[$name] !== null)
    }

    // size
    // A number with how many content in container.
    // @return : content count.
    get size() : number {
        return Object.keys(this.contents).length;
    }

    // keys
    // An array with all key name which register in container.
    // @return : all content key name.
    get keys() : string[] {
        return Object.keys(this.contents);
    }
}
