import { New } from "./Alpha.ParkingRecordDto.js"
import { DateFormatter } from "../WebSharper.StdLib/WebSharper.JavaScript.Pervasives.DateTime.js"
import $StartupCode_Remoting from "./$StartupCode_Remoting.js"
import AjaxRemotingProvider from "../WebSharper.StdLib/WebSharper.Remoting.AjaxRemotingProvider.js"
import { Bind, Return } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { DecodeList, Id } from "../WebSharper.Web/WebSharper.ClientSideJson.Provider.js"
export function toDto(p){
  return New(p.Spot, p.Plate, DateFormatter(p.StartTime, "o"));
}
export function file(){
  return $StartupCode_Remoting.file;
}
export function LeaveCar(spot){
  return(new AjaxRemotingProvider()).Async("Remoting/LeaveCar", [spot]);
}
export function LoadParking(){
  return Bind((new AjaxRemotingProvider()).Async("Remoting/LoadParking", []), (o) => Return(((DecodeList(Id()))())(o)));
}
export function ParkCar(spot, plate){
  return(new AjaxRemotingProvider()).Async("Remoting/ParkCar", [spot, plate]);
}
