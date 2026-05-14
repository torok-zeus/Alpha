import Doc from "../WebSharper.UI/WebSharper.UI.Doc"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2"
import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
import ParkingRecordDto from "./Alpha.ParkingRecordDto"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
export function ScheduleMain():Doc
export function PaymentMain():Doc
export function Main():Doc
export function spotButton(spot:string):Doc
export function getPrice(spot:string):number
export function rowPrices():FSharpMap<string, number>
export function parkingSpots():FSharpList_T<string>
export function parkedSpots():Var<FSharpMap<string, ParkingRecordDto>>
export function plateNumber():Var<string>
export function selectedSpot():Var<string>
export function MenuBar():Doc
