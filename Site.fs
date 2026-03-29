namespace Alpha

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Server
open WebSharper.UI.Html

type EndPoint =
    | [<EndPoint "/">] Home
    | [<EndPoint "/payment">] Payment

module Site =

    let HomePage ctx =
        Content.Page(
           h1 [] [text ""]
           :: [client <@ Client.Main () @>]
        )

    let PaymentPage ctx =
        Content.Page(
            h1 [] [text ""]
            :: [client <@ Client.PaymentMain () @>]
        )
   
    [<Website>]
    let Main =
        Sitelet.Sum [
           Sitelet.Infer <| fun ctx endpoint ->
               match endpoint with
               | Home -> HomePage ctx
               | Payment -> PaymentPage ctx
        ]