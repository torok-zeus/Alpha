import $StartupCode_Remoting from "./$StartupCode_Remoting.js"
import AjaxRemotingProvider from "../WebSharper.StdLib/WebSharper.Remoting.AjaxRemotingProvider.js"
import { Bind, Return } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { DecodeList } from "../WebSharper.Web/WebSharper.ClientSideJson.Provider.js"
import { DecodeJson_ParkingRecord } from "./$Generated.js"
export function file(){
  return $StartupCode_Remoting.file;
}
export function LeaveCar(spot){
  return(new AjaxRemotingProvider()).Async("Remoting/LeaveCar", [spot]);
}
export function LoadParking(){
  return Bind((new AjaxRemotingProvider()).Async("Remoting/LoadParking", []), (o) => Return(((DecodeList(DecodeJson_ParkingRecord))())(o)));
}
export function ParkCar(spot, plate){
  return(new AjaxRemotingProvider()).Async("Remoting/ParkCar", [spot, plate]);
}
