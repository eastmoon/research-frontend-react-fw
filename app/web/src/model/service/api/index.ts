// Import Libraries
import MVC from "@/framework/pattern/facade/mvc";
import { Service } from "@/framework/pattern/proxy";

// Declare class
class APIService extends Service {}

// Declare instance object
if (!MVC.model.has("APIService")) MVC.register(new APIService());
export default MVC.model.retrieve("APIService");
