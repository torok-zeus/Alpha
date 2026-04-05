import ParkingRecordDto from "./Alpha.ParkingRecordDto"
import AsyncBody from "../WebSharper.StdLib/WebSharper.Concurrency.AsyncBody`1"
import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
export function toDto(p:{Spot:string,Plate:string,StartTime:number}):ParkingRecordDto
export function file():string
export function LeaveCar(spot:string):((a:AsyncBody<void>) => void)
export function LoadParking():((a:AsyncBody<FSharpList_T<ParkingRecordDto>>) => void)
export function ParkCar(spot:string, plate:string):((a:AsyncBody<void>) => void)
