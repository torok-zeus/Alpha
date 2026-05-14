import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { Handler } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2.js"
import { collect, map, ofSeq, ofArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import { range } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.js"
import { charRange } from "../WebSharper.StdLib/WebSharper.Utils.js"
import { OfArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.MapModule.js"
import { ofSeq as ofSeq_1 } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ArrayModule.js"
import { Lazy } from "../WebSharper.Core.JavaScript/Runtime.js"
let _c=Lazy((_i) => class $StartupCode_Client {
  static {
    _c=_i(this);
  }
  static rowPrices;
  static parkingSpots;
  static parkedSpots;
  static plateNumber;
  static selectedSpot;
  static MenuBar;
  static {
    this.MenuBar=Doc.Element("div", [Attr.Create("style", "width:100%; padding:10px; background:#333; color:white; display:flex; gap:20px")], [Doc.Element("a", [Attr.Create("style", "color:white; cursor:pointer"), Handler("click", () =>() => {
      globalThis.location.href="/";
    })], [Doc.TextNode("Parking Spaces")]), Doc.Element("a", [Attr.Create("style", "color:white; cursor:pointer"), Handler("click", () =>() => {
      globalThis.location.href="/payment";
    })], [Doc.TextNode("Payment")])]);
    this.selectedSpot=Var.Create_1("is not selected");
    this.plateNumber=Var.Create_1("");
    this.parkedSpots=Var.Create_1(new FSharpMap("New", []));
    this.parkingSpots=collect((row) => map((col) => row+String(col), ofSeq(range(1, 10))), ofSeq(charRange("A", "J")));
    this.rowPrices=OfArray(ofSeq_1(ofArray([["A", 2000], ["B", 4000], ["C", 6000], ["D", 7000], ["E", 10000], ["F", 10000], ["G", 8000], ["H", 6000], ["I", 4000], ["J", 2000]])));
  }
});
export default _c;
