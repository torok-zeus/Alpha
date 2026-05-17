import { Replace } from "../WebSharper.StdLib/Microsoft.FSharp.Core.StringModule.js"
import { New } from "./Alpha.ParkingRecordDto.js"
import { DateFormatter } from "../WebSharper.StdLib/WebSharper.JavaScript.Pervasives.DateTime.js"
import AjaxRemotingProvider from "../WebSharper.StdLib/WebSharper.Remoting.AjaxRemotingProvider.js"
import { Bind, Return } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { DecodeList, Id } from "../WebSharper.Web/WebSharper.ClientSideJson.Provider.js"
export function getFileName(day, time, date){
  const safeTime=Replace(time, ":", "-");
  return"parking_"+String(day)+"_"+String(Replace(Replace(date, "/", "-"), ".", "-"))+"_"+String(safeTime)+".json";
}
export function toDto(p){
  return New(p.Spot, p.Plate, DateFormatter(p.StartTime, "o"));
}
export function CleanExpiredBookings(){
  return(new AjaxRemotingProvider()).Async("Remoting/CleanExpiredBookings", []);
}
export function LeaveCar(spot, day, time, date){
  return(new AjaxRemotingProvider()).Async("Remoting/LeaveCar", [spot, day, time, date]);
}
export function LoadParking(day, time, date){
  return Bind((new AjaxRemotingProvider()).Async("Remoting/LoadParking", [day, time, date]), (o) => Return(((DecodeList(Id()))())(o)));
}
export function ParkCar(spot, plate, day, time, date){
  return(new AjaxRemotingProvider()).Async("Remoting/ParkCar", [spot, plate, day, time, date]);
}
