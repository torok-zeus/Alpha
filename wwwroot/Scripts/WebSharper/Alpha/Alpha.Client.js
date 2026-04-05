import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import { Map } from "../WebSharper.UI/WebSharper.UI.View.js"
import { TryPick, OfArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.MapModule.js"
import { Some } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1.js"
import { toInt } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.js"
import { Parse } from "../WebSharper.StdLib/WebSharper.DateTimeHelpers.js"
import { StartImmediate, Delay, Bind, Zero } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { LoadParking, LeaveCar, ParkCar } from "./Alpha.Remoting.js"
import { ofSeq } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ArrayModule.js"
import { map, ofSeq as ofSeq_1 } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { Handler, Dynamic } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import { delay, map as map_1 } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.SeqModule.js"
import { New } from "./Alpha.ParkingRecordDto.js"
import { DateFormatter } from "../WebSharper.StdLib/WebSharper.JavaScript.Pervasives.DateTime.js"
import $StartupCode_Client from "./$StartupCode_Client.js"
export function PaymentMain(){
  const inputPlate=Var.Create_1("");
  const paymentInfo=Map((plate) => {
    const m=TryPick((_1, _2) => _2.Plate==plate?Some(_2):null, parkedSpots().Get());
    if(m!=null&&m.$==1){
      const record=m.$0;
      const minutes=toInt((Date.now()-Parse(record.StartTime))/6E4);
      return"Plate: "+String(record.Plate)+" | Spot: "+String(record.Spot)+" | Minutes: "+String(minutes)+" | Price: "+String(toInt(minutes/60*300))+" FT";
    }
    else return" No such var found.";
  }, inputPlate.View);
  StartImmediate(Delay(() => Bind(LoadParking(), (a) => {
    parkedSpots().Set(OfArray(ofSeq(map((r) =>[r.Spot, r], a))));
    return Zero();
  })), null);
  return Doc.Element("div", [], [MenuBar(), Doc.Element("h2", [], [Doc.TextNode("Payment by plate")]), Doc.Element("div", [], [Doc.TextNode("Plate: "), Doc.Input([Attr.Create("placeholder", "Enter plate")], inputPlate)]), Doc.Element("div", [Attr.Create("style", "margin-top: 15px")], [Doc.TextView(paymentInfo)]), Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px"), Handler("click", () =>() => {
    const plate=inputPlate.Get();
    const m=TryPick((_1, _2) => _2.Plate==plate?Some(_2):null, parkedSpots().Get());
    if(m!=null&&m.$==1){
      const record=m.$0;
      return StartImmediate(Delay(() => Bind(LeaveCar(record.Spot), () => {
        const cur=parkedSpots().Get();
        parkedSpots().Set(cur.Remove_1(record.Spot));
        alert("Payment successful!");
        globalThis.location.href="/";
        return Zero();
      })), null);
    }
    else return alert("Plate not found");
  })], [Doc.TextNode("Pay")]), Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px"), Handler("click", () =>() => {
    globalThis.location.href="/";
  })], [Doc.TextNode("Back")])]);
}
export function Main(){
  StartImmediate(Delay(() => Bind(LoadParking(), (a) => {
    const map_2=OfArray(ofSeq(map((r) =>[r.Spot, r], a)));
    parkedSpots().Set(map_2);
    return Zero();
  })), null);
  return Doc.Element("div", [], [MenuBar(), Doc.Element("h1", [], [Doc.TextNode("Parking registry")]), Doc.Element("div", [], ofSeq_1(delay(() => map_1(spotButton, parkingSpots())))), Doc.Element("h3", [], [Doc.TextView(Map((s) =>"The parking space of your choice: "+s, selectedSpot().View))]), Doc.Element("div", [], [Doc.TextNode("Plate: "), Doc.Input([Attr.Create("placeholder", "Text here your car plate"), Attr.Create("style", "margin:5px; padding:5px")], plateNumber())]), Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px"), Handler("click", () =>() => {
    const spot=selectedSpot().Get();
    const plate=plateNumber().Get();
    const current=parkedSpots().Get();
    return spot=="is not selected"?alert("First choose a parking space"):plate==""?alert("Enter your license plate"):current.ContainsKey(spot)?alert("This parking space is already occupied!"):StartImmediate(Delay(() => Bind(ParkCar(spot, plate), () => {
      const newRecord=New(spot, plate, DateFormatter(Date.now(), "o"));
      parkedSpots().Set(current.Add_1(spot, newRecord));
      plateNumber().Set("");
      selectedSpot().Set("is not selected");
      return Zero();
    })), null);
  })], [Doc.TextNode("Parking")])]);
}
export function spotButton(spot){
  return Doc.Element("button", [Dynamic("style", Map((map_2) => map_2.ContainsKey(spot)?"margin:5px; padding:10px; background:red; color:white":"margin:5px; padding:10px; background:green; color:white", parkedSpots().View)), Handler("click", () =>() => selectedSpot().Set(spot))], [Doc.Element("div", [], [Doc.TextNode(spot)]), Doc.Element("div", [], [Doc.TextView(Map((map_2) => {
    const m=map_2.TryFind(spot);
    return m==null?"":m.$0.Plate;
  }, parkedSpots().View))])]);
}
export function parkingSpots(){
  return $StartupCode_Client.parkingSpots;
}
export function parkedSpots(){
  return $StartupCode_Client.parkedSpots;
}
export function plateNumber(){
  return $StartupCode_Client.plateNumber;
}
export function selectedSpot(){
  return $StartupCode_Client.selectedSpot;
}
export function MenuBar(){
  return $StartupCode_Client.MenuBar;
}
