import Doc from "../WebSharper.UI/WebSharper.UI.Doc"
import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
export function PaymentMain():Doc
export function Main():Doc
export function spotButton(spot:string):Doc
export function parkingSpots():FSharpList_T<string>
export function parkedSpots():Var<FSharpMap<string, {Spot:string,Plate:string,StartTime:number}>>
export function plateNumber():Var<string>
export function selectedSpot():Var<string>
export function MenuBar():Doc
