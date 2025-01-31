// Import Libraries
import MVC from "@/framework/pattern/facade/mvc";
import { Progress } from "@/framework/pattern/facade/progress";

// Declare class
class Navigate extends Progress {}

// Declare instance object
if (!MVC.controller.has("Navigate")) MVC.register(new Navigate());
export default MVC.controller.retrieve("Navigate");
