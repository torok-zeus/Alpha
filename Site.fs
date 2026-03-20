namespace Alpha

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Server
open WebSharper.UI.Html

type EndPoint =
    | [<EndPoint "/">] Home
    | [<EndPoint "/payment/{spot}"] Payment of string

module Site =

    let HomePage ctx =
        Content.Page(
           h1 [] [text ""]
           :: [client <@ Client.Main () @>]
        )

    let PaymentPage spot ctx =
        Content.Page(
            h1 [] [text ("Payment for parking spot:"+spot)]
            
            :: [client <@ Client.PaymentMain spot @>]
        )
   
    [<Website>]
    let Main =
        Sitlet.Sum [
           Sitelet.Content "/" Home HomePage
           Sitlet.Content "/payment/{spot}" (funt ctx spot -> PaymentPage spot ctx)
        ]