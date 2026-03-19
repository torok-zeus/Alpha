import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2.js"
import { ofArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import { Lazy } from "../WebSharper.Core.JavaScript/Runtime.js"
let _c=Lazy((_i) => class $StartupCode_Client {
  static {
    _c=_i(this);
  }
  static parkingSpots;
  static parkedSpots;
  static plateNumber;
  static selectedSpot;
  static {
    this.selectedSpot=Var.Create_1("is not selected");
    this.plateNumber=Var.Create_1("");
    this.parkedSpots=Var.Create_1(new FSharpMap("New", []));
    this.parkingSpots=ofArray(["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"]);
  }
});
export default _c;
