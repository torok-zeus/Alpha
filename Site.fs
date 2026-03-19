namespace Alpha

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Server
open WebSharper.UI.Html

type EndPoint =
    | [<EndPoint "/">] Home

module Site =

    let HomePage ctx =
        Content.Page(
           h1 [] [text ""]
           :: [client <@ Client.Main () @>]
        )

   
    [<Website>]
    let Main =
      Sitelet.Content "/" Home HomePage