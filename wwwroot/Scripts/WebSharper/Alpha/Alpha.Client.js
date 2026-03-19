import { StartImmediate, Delay, Bind, Zero } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { LoadParking, ParkCar, LeaveCar } from "./Alpha.Remoting.js"
import { OfArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.MapModule.js"
import { ofSeq } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ArrayModule.js"
import { map, ofSeq as ofSeq_1 } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import { delay, map as map_1 } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.SeqModule.js"
import { Map } from "../WebSharper.UI/WebSharper.UI.View.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { Handler, Dynamic } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import $StartupCode_Client from "./$StartupCode_Client.js"
export function Main(){
  StartImmediate(Delay(() => Bind(LoadParking(), (a) => {
    const map_2=OfArray(ofSeq(map((r) =>[r.Spot, r.Plate], a)));
    parkedSpots().Set(map_2);
    return Zero();
  })), null);
  return Doc.Element("div", [], [Doc.Element("h1", [], [Doc.TextNode("Parking registry")]), Doc.Element("div", [], ofSeq_1(delay(() => map_1(spotButton, parkingSpots())))), Doc.Element("h3", [], [Doc.TextView(Map((s) =>"The parking space of your choice: "+s, selectedSpot().View))]), Doc.Element("div", [], [Doc.TextNode("Plate: "), Doc.Input([Attr.Create("placeholder", "Text here your car plate"), Attr.Create("style", "margin:5px; padding:5px")], plateNumber())]), Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px"), Handler("click", () =>() => {
    const spot=selectedSpot().Get();
    const plate=plateNumber().Get();
    const current=parkedSpots().Get();
    return spot=="is not selected"?alert("First choose a parking space"):plate==""?alert("Enter your license plate"):current.ContainsKey(spot)?alert("This parking space is already occupied!"):StartImmediate(Delay(() => Bind(ParkCar(spot, plate), () => {
      parkedSpots().Set(current.Add_1(spot, plate));
      plateNumber().Set("");
      selectedSpot().Set("is not selected");
      return Zero();
    })), null);
  })], [Doc.TextNode("Parking")]), Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px"), Handler("click", () =>() => {
    const spot=selectedSpot().Get();
    return spot=="is not selected"?alert("Select a parking space first"):StartImmediate(Delay(() => Bind(LeaveCar(spot), () => {
      const current=parkedSpots().Get();
      parkedSpots().Set(current.Remove_1(spot));
      plateNumber().Set("");
      selectedSpot().Set("is not selected");
      return Zero();
    })), null);
  })], [Doc.TextNode("Leaving")])]);
}
export function spotButton(spot){
  return Doc.Element("button", [Dynamic("style", Map((map_2) => map_2.ContainsKey(spot)?"margin:5px; padding:10px; background:red; color:white":"margin:5px; padding:10px; background:green; color:white", parkedSpots().View)), Handler("click", () =>() => selectedSpot().Set(spot))], [Doc.Element("div", [], [Doc.TextNode(spot)]), Doc.Element("div", [], [Doc.TextView(Map((map_2) => {
    const m=map_2.TryFind(spot);
    return m==null?"":m.$0;
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
