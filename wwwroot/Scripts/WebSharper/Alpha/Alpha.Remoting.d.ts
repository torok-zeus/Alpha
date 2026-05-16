import ParkingRecordDto from "./Alpha.ParkingRecordDto"
import AsyncBody from "../WebSharper.StdLib/WebSharper.Concurrency.AsyncBody`1"
import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
export function getFileName(day:string, time:string, date:string):string
export function toDto(p:{Spot:string,Plate:string,StartTime:number}):ParkingRecordDto
export function CleanExpiredBookings():((a:AsyncBody<void>) => void)
export function LeaveCar(spot:string, day:string, time:string, date:string):((a:AsyncBody<void>) => void)
export function LoadParking(day:string, time:string, date:string):((a:AsyncBody<FSharpList_T<ParkingRecordDto>>) => void)
export function ParkCar(spot:string, plate:string, day:string, time:string, date:string):((a:AsyncBody<void>) => void)
