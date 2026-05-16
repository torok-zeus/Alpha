namespace Alpha

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Server
open WebSharper.UI.Html

type EndPoint =
    | [<EndPoint "/">] Schedule
    | [<EndPoint "/parking">] Home
    | [<EndPoint "/payment">] Payment

module Site =

    let HomePage ctx =
        Content.Page(
           h1 [] [text ""]
           :: [client <@ Client.Main () @>]
        )
     
    let SchedulePage ctx =
        Content.Page(
            h1 [] [text ""]
            :: [client <@ Client.ScheduleMain () @>]
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
               | Schedule -> SchedulePage ctx
               | Home -> HomePage ctx
               | Payment -> PaymentPage ctx
        ]
