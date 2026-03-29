import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { Handler } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import FSharpMap from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpMap`2.js"
import { ofArray } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
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
      globalThis.location.href="/payment";
    })], [Doc.TextNode("Home")]), Doc.Element("a", [Attr.Create("style", "color:white; cursor:pointer"), Handler("click", () =>() => {
      globalThis.location.href="/payment";
    })], [Doc.TextNode("Payment")])]);
    this.selectedSpot=Var.Create_1("is not selected");
    this.plateNumber=Var.Create_1("");
    this.parkedSpots=Var.Create_1(new FSharpMap("New", []));
    this.parkingSpots=ofArray(["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"]);
  }
});
export default _c;
