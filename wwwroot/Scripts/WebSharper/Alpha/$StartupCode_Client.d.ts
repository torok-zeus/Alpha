import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
export default class $StartupCode_Client {
  static parkingSpots:FSharpList_T<string>;
  static parkedSpots:Var<FSharpMap<string, {Spot:string,Plate:string,StartTime:number}>>;
  static plateNumber:Var<string>;
  static selectedSpot:Var<string>;
}
