namespace Alpha

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Html
open WebSharper.UI.Client
open WebSharper.UI.Notation

[<JavaScript>]
module Client =

    let selectedSpot=Var.Create("is not selected")
    let plateNumber = Var.Create ""
    let parkedSpots = Var.Create<Map<string, ParkingRecord>>(Map.empty)

    let parkingSpots =
        ["A1";"A2";"A3";"A4";"A5";"B1";"B2";"B3";"B4";"B5"]

    let spotButton spot =
        button[
            attr.styleDyn(
                parkedSpots.View.Map (fun map ->
                    if map.ContainsKey spot then
                        "margin:5px; padding:10px; background:red; color:white"
                    else
                        "margin:5px; padding:10px; background:green; color:white"
                )
            )
            on.click (fun _ _ ->
                selectedSpot.Value <- spot
            )
        ] [
            div [] [
                text spot
            ]
            div [] [
                textView(
                    parkedSpots.View.Map(fun map ->
                        match map.TryFind spot with
                        | Some record -> record.Plate
                        | None -> ""
                    )
                )
            ]
        ]

    // fő UI
    let Main () =

        async{
            let! data = Remoting.LoadParking()

            let map =
                data
                |> List.map (fun r -> r.Spot, r)
                |> Map.ofList

            parkedSpots.Value <- map
        }
        |> Async.StartImmediate

        div [] [

            h1 [] [ text "Parking registry" ]

            div [] [
                for s in parkingSpots do
                    spotButton s
            ]

            h3 [] [
                textView (
                    selectedSpot.View.Map(fun s ->
                        "The parking space of your choice: " + s
                    )
                )
            ]

            div [] [
                text "Plate: "

                Doc.Input[
                    attr.placeholder "Text here your car plate"
                    attr.style "margin:5px; padding:5px"
                ] plateNumber
            ]

            button [
                attr.style "margin:10px; padding:10px"

                on.click (fun _ _ ->

                    let spot = selectedSpot.Value
                    let plate = plateNumber.Value
                    let current = parkedSpots.Value

                    if spot = "is not selected" then
                        JS.Alert("First choose a parking space")

                    elif plate = "" then
                        JS.Alert("Enter your license plate")

                    elif current.ContainsKey spot then
                        JS.Alert("This parking space is already occupied!")

                    else
                        async{
                            do! Remoting.ParkCar spot plate

                            let newRecord =
                                {
                                  Spot = spot
                                  Plate = plate
                                  StartTime = System.DateTime.Now
                                }

                            parkedSpots.Value <- current.Add(spot, newRecord)

                            plateNumber.Value <- ""
                            selectedSpot.Value <- "is not selected"
                        }
                        |> Async.StartImmediate
                )
            ] [
                text "Parking"
            ]

            button [
                attr.style "margin:10px; padding:10px"

                on.click (fun _ _ ->

                    let spot = selectedSpot.Value

                    if spot = "is not selected" then
                        JS.Alert("Select a parking space first")

                    else
                        async{
                            do! Remoting.LeaveCar spot

                            let current = parkedSpots.Value
                            parkedSpots.Value <- current.Remove spot

                            plateNumber.Value <- ""
                            selectedSpot.Value <- "is not selected"
                        }
                        |> Async.StartImmediate
                )
            ] [
                text "Leaving"
            ]

            button [
                attr.style "margin:10px; padding:10px"

                on.click (fun _ _ ->
                    let spot = selectedSpot.Value

                    if spot = "is not selected" then
                        JS.Alert("Select a parking space first")
                    else
                        JS.Window.Location.Href <- "/payment/" + spot
                )
            ] [
                text "Go to Payment"
            ]
        ]

    let PaymentMain (spot:string) =
        
        async {
            let! data = Remoting.LoadParking()

            let map =
                data
                |> List.map ( fun r -> r.Spot, r)
                |> Map.ofList

            parkedSpots.Value <- map
        }
        |> Async.StartImmediate

        let info =
            parkedSpots.View.Map (fun map ->
                match map.TryFind spot with
                | Some record ->
                    let now = System.DateTime.Now
                    let diff = now - record.StartTime
                    
                    let minutes = int diff.TotalMinutes
                    let price = (float minutes / 60.0) * 300.0

                    "Plate:" + record.Plate +
                    " | Start: " + record.StartTime.ToString("HH:mm") +
                    " | Now: " + now.ToString("HH:mm") +
                    " | Time: " + string minutes + " min" +
                    " | Price: " + string (int price) + "Ft"
                | None ->
                    "No data found"
            )
        div [] [
            h2 [] [text ("Payment - " + spot)]

            div [] [
                textView info
            ]
            button [
                attr.style "margin:10px; padding:10px"

                on.click (fun _ _ ->
                    async{
                        do! Remoting.LeaveCar spot

                        let current = parkedSpots.Value
                        parkedSpots.Value <- current.Remove spot

                        JS.Alert("Payment successful!")

                        JS.Window.Location.Href <- "/"
                    }
                    |> Async.StartImmediate
                )
            ] [
                text "Pay"
            ]

            

            button [
                attr.style "margin:10px; padding:10px"

                on.click ( fun _ _ ->
                    JS.Window.Location.Href <- "/"
                )
            ] [
                text "Back"
            ]
        ]
    
