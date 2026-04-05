import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
import ParkingRecordDto from "./Alpha.ParkingRecordDto"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc"
export default class $StartupCode_Client {
  static parkingSpots:FSharpList_T<string>;
  static parkedSpots:Var<FSharpMap<string, ParkingRecordDto>>;
  static plateNumber:Var<string>;
  static selectedSpot:Var<string>;
  static MenuBar:Doc;
}
