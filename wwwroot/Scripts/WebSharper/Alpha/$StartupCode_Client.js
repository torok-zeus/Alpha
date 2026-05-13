import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { Handler } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2.js"
import { collect, map, ofSeq } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import { range } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.js"
import { charRange } from "../WebSharper.StdLib/WebSharper.Utils.js"
import { Lazy } from "../WebSharper.Core.JavaScript/Runtime.js"
let _c=Lazy((_i) => class $StartupCode_Client {
  static {
    _c=_i(this);
  }
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
  }
});
export default _c;
