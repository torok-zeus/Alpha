import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import { map, ofSeq, ofArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import { range } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.js"
import { StartImmediate, Delay, Bind, Return, Zero } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { CleanExpiredBookings, LoadParking, ParkCar } from "./Alpha.Remoting.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { delay, map as map_1, collect, sumBy } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.SeqModule.js"
import { DateFormatter } from "../WebSharper.StdLib/WebSharper.JavaScript.Pervasives.DateTime.js"
import { Handler, Dynamic } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import { Parse } from "../WebSharper.StdLib/WebSharper.DateTimeHelpers.js"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2.js"
import { get } from "../WebSharper.StdLib/Microsoft.FSharp.Core.LanguagePrimitives.IntrinsicFunctions.js"
import { SplitChars } from "../WebSharper.StdLib/Microsoft.FSharp.Core.StringModule.js"
import { Map } from "../WebSharper.UI/WebSharper.UI.View.js"
import { tryFind, ofSeq as ofSeq_1 } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ArrayModule.js"
import { Some } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1.js"
import { OfArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.MapModule.js"
import { New } from "./Alpha.ParkingRecordDto.js"
import $StartupCode_Client from "./$StartupCode_Client.js"
export function ScheduleMain(){
  const selectedDate=Var.Create_1("");
  const today=Date.now();
  const availableDates=map((i) => today+i*864E5, ofSeq(range(0, 13)));
  StartImmediate(Delay(() => Bind(CleanExpiredBookings(), () => Return(null))), null);
  const showTimes=ofArray([["10:00", "Gyerekfilm", "\ud83e\uddf8"], ["13:00", "Vígjáték", "\ud83d\ude02"], ["16:00", "Romantikus", "\ud83d\udc95"], ["19:00", "Akciófilm", "\ud83d\udca5"], ["22:00", "Horror", "\ud83d\udc7b"]]);
  return Doc.Element("div", [Attr.Create("style", "background: #f5f5f5; min-height: 100vh; font-family: sans-serif;")], [MenuBar(), Doc.Element("div", [Attr.Create("style", "max-width: 900px; margin: 0 auto; padding: 30px;")], [Doc.Element("h2", [Attr.Create("style", "text-align: center; margin-bottom: 10px;")], [Doc.TextNode("\ud83c\udfac Select a Date")]), Doc.Element("p", [Attr.Create("style", "text-align: center; color: #888; margin-bottom: 20px;")], [Doc.TextNode("Available for the next 14 days")]), Doc.Element("div", [Attr.Create("style", "display: flex; flex-wrap: wrap; justify-content: center; margin-bottom: 30px;")], ofSeq(delay(() => map_1((date) => {
    let c;
    const dateStr=DateFormatter(date, "yyyy-MM-dd");
    const dayName=(c=(new Date(date)).getDay(),String(c));
    const m=(new Date(date)).getDay();
    const dayHu=m===0?"Vasárnap":m===1?"Hétf\u0151":m===2?"Kedd":m===3?"Szerda":m===4?"Csütörtök":m===5?"Péntek":m===6?"Szombat":dayName;
    return Doc.BindView((selected) => Doc.Element("button", [Attr.Create("style", selected==dateStr?"margin: 5px; padding: 10px 15px; background: #e67e22; color: white; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; font-weight: bold; text-align: center;":"margin: 5px; padding: 10px 15px; background: #333; color: white; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; text-align: center;"), Handler("click", () =>() => selectedDate.Set(dateStr))], [Doc.Element("div", [], [Doc.TextNode(dayHu)]), Doc.Element("div", [Attr.Create("style", "font-size: 11px; opacity: 0.8;")], [Doc.TextNode(DateFormatter(date, "MM. dd."))])]), selectedDate.View);
  }, availableDates)))), Doc.BindView((dateStr) => {
    let c;
    if(dateStr=="")return Doc.Element("div", [Attr.Create("style", "text-align: center; color: #aaa; font-size: 16px; padding: 40px;")], [Doc.TextNode("\ud83d\udc46 Select a date to see show times")]);
    else {
      const dt=Parse(dateStr);
      const m=(new Date(dt)).getDay();
      const dayHu=m===0?"Vasárnap":m===1?"Hétf\u0151":m===2?"Kedd":m===3?"Szerda":m===4?"Csütörtök":m===5?"Péntek":m===6?"Szombat":(c=(new Date(dt)).getDay(),String(c));
      return Doc.Element("div", [], [Doc.Element("h3", [Attr.Create("style", "text-align: center; margin-bottom: 20px;")], [Doc.TextNode("\ud83d\udcc5 "+dayHu+" - "+DateFormatter(dt, "yyyy. MM. dd."))]), Doc.Element("p", [Attr.Create("style", "text-align: center; color: #888; margin-bottom: 20px;")], [Doc.TextNode("Click a show time to choose your parking spot")]), Doc.Element("div", [Attr.Create("style", "display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;")], ofSeq(delay(() => collect((m_1) => {
        let c_1;
        const time=m_1[0];
        const dayName=(c_1=(new Date(Parse(dateStr))).getDay(),String(c_1));
        return[Doc.Element("button", [Attr.Create("style", "margin: 8px; padding: 20px 30px; background: #27ae60; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; font-weight: bold; width: 160px;"), Handler("click", () =>() => {
          globalThis.location.href="/parking?day="+dayName+"&time="+time+"&date="+dateStr;
        })], [Doc.Element("div", [], [Doc.TextNode("\ud83d\udd50 "+time)]), Doc.Element("div", [Attr.Create("style", "font-size: 14px; margin-top: 4px;")], [Doc.TextNode(m_1[2]+" "+m_1[1])]), Doc.Element("div", [Attr.Create("style", "font-size: 12px; opacity: 0.85; margin-top: 4px;")], [Doc.TextNode("Kattints a foglaláshoz")])])];
      }, showTimes))))]);
    }
  }, selectedDate.View)])]);
}
export function PaymentMain(){
  const cart=Var.Create_1(new FSharpMap("New", []));
  const url=globalThis.location.search;
  const currentSpot=url.indexOf("spot=")!=-1?get(SplitChars(url, ["="], 0), 1):"is not selected";
  const spotPrice=getPrice(currentSpot);
  const snacks=ofArray([["Popcorn", 1200, "\ud83c\udf7f"], ["Nachos", 1500, "\ud83e\uddc0"], ["Hot Dog", 1800, "\ud83c\udf2d"], ["Cola", 800, "\ud83e\udd64"], ["Water", 500, "\ud83d\udca7"], ["Beer", 1000, "\ud83c\udf7a"], ["Chocolate", 700, "\ud83c\udf6b"], ["Gummy Bears", 600, "\ud83c\udf6c"], ["Chips", 900, "\ud83e\udd68"]]);
  const totalPrice=Map((cartMap) => sumBy((_1) => {
    const m=cartMap.TryFind(_1[0]);
    return m==null?0:m.$0*_1[1];
  }, snacks)+spotPrice, cart.View);
  const snackCard=(name, price, emoji) => Doc.Element("div", [Attr.Create("style", "\r\n                    border: 1px solid #ddd;\r\n                    border-radius: 12px;\r\n                    padding: 20px;\r\n                    text-align: center;\r\n                    background: white;\r\n                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);\r\n                ")], [Doc.Element("div", [Attr.Create("style", "font-size: 40px; margin-bottom: 8px")], [Doc.TextNode(emoji)]), Doc.Element("div", [Attr.Create("style", "font-weight: bold; font-size: 16px; margin-bottom: 4px")], [Doc.TextNode(name)]), Doc.Element("div", [Attr.Create("style", "color: #888; margin-bottom: 12px")], [Doc.TextNode(String(price)+" Ft")]), Doc.Element("div", [Attr.Create("style", "display: flex; align-items: center; justify-content: center; gap: 10px")], [Doc.Element("button", [Attr.Create("style", "\r\n                            width: 30px; height: 30px;\r\n                            border-radius: 50%;\r\n                            border: none;\r\n                            background: #eee;\r\n                            font-size: 18px;\r\n                            cursor: pointer;\r\n                        "), Handler("click", () =>() => {
    const currentCart=cart.Get();
    const m=currentCart.TryFind(name);
    return m==null?null:m.$0>1?cart.Set(currentCart.Add_1(name, m.$0-1)):cart.Set(currentCart.Remove_1(name));
  })], [Doc.TextNode("\u2212")]), Doc.TextView(Map((map_2) => {
    const m=map_2.TryFind(name);
    return m==null?"0":String(m.$0);
  }, cart.View)), Doc.Element("button", [Attr.Create("style", "\r\n                            width: 30px; height: 30px;\r\n                            border-radius: 50%;\r\n                            border: none;\r\n                            background: #333;\r\n                            color: white;\r\n                            font-size: 18px;\r\n                            cursor: pointer;\r\n                        "), Handler("click", () =>() => {
    const currentCart=cart.Get();
    const o=currentCart.TryFind(name);
    let _1=o==null?0:o.$0;
    let _2=_1+1;
    let _3=currentCart.Add_1(name, _2);
    return cart.Set(_3);
  })], [Doc.TextNode("+")])])]);
  return Doc.Element("div", [Attr.Create("style", "background: #f5f5f5; min-height: 100vh; font-family: sans-serif")], [MenuBar(), Doc.Element("div", [Attr.Create("style", "max-width: 900px; margin: 0 auto; padding: 30px")], [Doc.Element("h2", [Attr.Create("style", "text-align: center; margin-bottom: 30px")], [Doc.TextNode("\ud83c\udfac Snack Selection")]), Doc.Element("div", [Attr.Create("style", "\r\n                         display: grid;\r\n                         grid-template-columns: repeat(3, 1fr);\r\n                         gap: 20px;\r\n                         margin-bottom: 30px;\r\n                     ")], ofSeq(delay(() => map_1((snack) => snackCard.apply(null, snack), snacks)))), Doc.Element("div", [Attr.Create("style", "\r\n                          background: white;\r\n                          border-radius: 12px;\r\n                          padding: 20px;\r\n                          box-shadow: 0 2px 8px rgba(0,0,0,0.08);\r\n                          display: flex;\r\n                          justify-content: space-between;\r\n                          align-items: center;\r\n                      ")], [Doc.Element("div", [Attr.Create("style", "font-size: 16px;")], [Doc.Element("div", [], [Doc.TextNode("\ud83c\udd7f\ufe0f Parking spot: "), Doc.TextNode(currentSpot)]), Doc.Element("div", [], [Doc.TextNode("\ud83c\udd7f\ufe0f Parking price: "), Doc.TextNode(String(spotPrice)+" Ft")]), Doc.Element("div", [], [Doc.TextNode("\ud83c\udf7f Snacks: "), Doc.TextView(Map((cartMap) => String(sumBy((_1) => {
    const m=cartMap.TryFind(_1[0]);
    return m==null?0:m.$0*_1[1];
  }, snacks))+" Ft", cart.View))]), Doc.Element("div", [Attr.Create("style", "font-size: 20px; font-weight: bold; margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px")], [Doc.TextNode("Total: "), Doc.TextView(Map((p) => String(p)+" Ft", totalPrice))])]), Doc.Element("button", [Attr.Create("style", "\r\n                              padding: 12px 30px;\r\n                              background: #333;\r\n                              color: white;\r\n                              border: none;\r\n                              border-radius: 8px;\r\n                              font-size: 16px;\r\n                              cursor: pointer;\r\n                          "), Handler("click", () =>() => {
    const total=spotPrice+sumBy((_1) => {
      const m=cart.Get().TryFind(_1[0]);
      return m==null?0:m.$0*_1[1];
    }, snacks);
    return total===0?alert("You have not selected anything!"):(alert("Order placed! Total: "+String(total)+" Ft\nThank you for your visit!"),cart.Set(new FSharpMap("New", [])),void(globalThis.location.href="/"));
  })], [Doc.TextNode("Place Order")])])])]);
}
export function Main(){
  let currentDay;
  let currentTime;
  let currentDate;
  const urlParams=globalThis.location.search;
  if(urlParams.indexOf("day=")!=-1){
    const o=tryFind((p) => p.indexOf("day=")!=-1, SplitChars(urlParams, ["&"], 0));
    const o_1=o==null?null:Some(get(SplitChars(o.$0, ["="], 0), 1));
    currentDay=o_1==null?"":o_1.$0;
  }
  else currentDay="";
  if(urlParams.indexOf("time=")!=-1){
    const o_2=tryFind((p) => p.indexOf("time=")!=-1, SplitChars(urlParams, ["&"], 0));
    const o_3=o_2==null?null:Some(get(SplitChars(o_2.$0, ["="], 0), 1));
    currentTime=o_3==null?"":o_3.$0;
  }
  else currentTime="";
  if(urlParams.indexOf("date=")!=-1){
    const o_4=tryFind((p) => p.indexOf("date=")!=-1, SplitChars(urlParams, ["&"], 0));
    const o_5=o_4==null?null:Some(get(SplitChars(o_4.$0, ["="], 0), 1));
    currentDate=o_5==null?"":o_5.$0;
  }
  else currentDate="";
  StartImmediate(Delay(() => Bind(LoadParking(currentDay, currentTime, currentDate), (a) => {
    const map_2=OfArray(ofSeq_1(map((r) =>[r.Spot, r], a)));
    parkedSpots().Set(map_2);
    return Zero();
  })), null);
  return Doc.Element("div", [], [MenuBar(), Doc.Element("div", [Attr.Create("style", "padding: 10px 20px;")], [Doc.Element("button", [Attr.Create("style", "padding: 8px 20px; background: #555; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;"), Handler("click", () =>() => {
    globalThis.location.href="/";
  })], [Doc.TextNode("\u2190 Back to Schedule")])]), Doc.Element("h1", [], [Doc.TextNode("Parking registry")]), Doc.Element("div", [Attr.Create("style", "\r\n                    width: 80%;\r\n                    margin: 30px auto 20px auto;\r\n                    height: 40px;\r\n                    background: black;\r\n                    border-radius: 4px;\r\n                    text-align: center;\r\n                    color: white;\r\n                    font-size: 18px;\r\n                    font-weight: bold;\r\n                    line-height: 40px;\r\n                    letter-spacing: 6px;\r\n                    border: 2px solid #ccc;\r\n                 ")], [Doc.TextNode("SCREEN")]), Doc.Element("div", [Attr.Create("style", "\r\n                     display:grid;\r\n                     grid-template-columns:repeat(10, 80px);\r\n                     gap:10px;\r\n                     justify-content:center;\r\n                     margin-top:30px;\r\n                 ")], ofSeq(delay(() => map_1(spotButton, parkingSpots())))), Doc.Element("h3", [], [Doc.TextView(Map((s) =>"The parking space of your choice: "+s, selectedSpot().View))]), Doc.Element("div", [], [Doc.TextNode("Plate: "), Doc.Input([Attr.Create("placeholder", "Text here your car plate"), Attr.Create("style", "margin:5px; padding:5px")], plateNumber())]), Doc.BindView((plate) => plate==""?Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px; background:#ccc; color:#666; border:none; cursor:not-allowed"), Attr.Create("disabled", "disabled")], [Doc.TextNode("Enter plate first")]):Doc.Element("button", [Attr.Create("style", "margin:10px; padding:10px; background:#e67e22; color:white; border:none; border-radius:8px; font-size:16px; cursor:pointer"), Handler("click", () =>() => {
    const spot=selectedSpot().Get();
    const plate_1=plateNumber().Get();
    const current=parkedSpots().Get();
    return spot=="is not selected"?alert("First choose a parking space"):current.ContainsKey(spot)?alert("This parking space is already occupied!"):StartImmediate(Delay(() => Bind(ParkCar(spot, plate_1, currentDay, currentTime, currentDate), () => {
      const newRecord=New(spot, plate_1, DateFormatter(Date.now(), "o"));
      parkedSpots().Set(current.Add_1(spot, newRecord));
      plateNumber().Set("");
      selectedSpot().Set("is not selected");
      globalThis.location.href="/payment?spot="+spot+"&day="+currentDay+"&time="+currentTime+"&date="+currentDate;
      return Zero();
    })), null);
  })], [Doc.TextNode("\ud83c\udf7f Snacks")]), plateNumber().View)]);
}
export function spotButton(spot){
  const price=getPrice(spot);
  return Doc.Element("button", [Dynamic("style", Map((map_2) => map_2.ContainsKey(spot)?"margin:5px; padding:10px; background:red; color:white":"margin:5px; padding:10px; background:green; color:white", parkedSpots().View)), Handler("click", () =>() => selectedSpot().Set(spot))], [Doc.Element("div", [], [Doc.TextNode(spot)]), Doc.Element("div", [], [Doc.TextView(Map((map_2) => {
    const m=map_2.TryFind(spot);
    return m==null?"":m.$0.Plate;
  }, parkedSpots().View))]), Doc.Element("div", [Attr.Create("style", "font-size: 10px; opacity: 0.85")], [Doc.TextNode(String(price)+" Ft")])]);
}
export function getPrice(spot){
  const o=rowPrices().TryFind(spot[0]);
  return o==null?0:o.$0;
}
export function rowPrices(){
  return $StartupCode_Client.rowPrices;
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
