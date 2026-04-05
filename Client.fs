namespace Alpha

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Html
open WebSharper.UI.Client
open WebSharper.UI.Notation

[<JavaScript>]
module Client =

    let MenuBar =
        div [
            attr.style "width:100%; padding:10px; background:#333; color:white; display:flex; gap:20px"
        ] [
            a [
                attr.style "color:white; cursor:pointer"
                on.click (fun _ _ -> JS.Window.Location.Href <- "/")
            ] [text "Parking Spaces"]

            a [
                attr.style "color:white; cursor:pointer"
                on.click (fun _ _ -> JS.Window.Location.Href <- "/payment")
            ] [ text "Payment"]
        ]
    let selectedSpot=Var.Create("is not selected")
    let plateNumber = Var.Create ""
    let parkedSpots = Var.Create<Map<string, ParkingRecordDto>>(Map.empty)

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

            MenuBar

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
                                  StartTime = System.DateTime.Now.ToString("o")
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
        ]

    let PaymentMain () =
        
        let inputPlate = Var.Create ""

        let paymentInfo =
            inputPlate.View.Map (fun plate ->
                let map = parkedSpots.Value
                match map |> Map.tryPick (fun _ r -> if r.Plate = plate then Some r else None) with
                | None ->
                    " No such var found."
                | Some record ->
                    let now = System.DateTime.Now
                    let start = System.DateTime.Parse(record.StartTime)
                    let diff = now - start
                    let minutes = int diff.TotalMinutes
                    let price = int ((float minutes / 60.0) * 300.0)

                    $"Plate: {record.Plate} | Spot: {record.Spot} | Minutes: {minutes} | Price: {price} FT"
                )
        async {
            let! data = Remoting.LoadParking()
            parkedSpots.Value <-
                data |> List.map (fun r -> r.Spot, r) |> Map.ofList
        }
        |> Async.StartImmediate

        div [] [

            MenuBar

            h2 [] [text ("Payment by plate")]

            div [] [
                text "Plate: "
                Doc.Input [ attr.placeholder "Enter plate"] inputPlate
            ]

            div [
                attr.style "margin-top: 15px"
            ] [
                textView paymentInfo
            ]
            button [
                attr.style "margin:10px; padding:10px"

                on.click (fun _ _ ->
                    let plate = inputPlate.Value
                    let map = parkedSpots.Value

                    match map |> Map.tryPick (fun _ r -> if r.Plate = plate then Some r else None) with
                    | None -> JS.Alert("Plate not found")
                    | Some record ->
                        async {
                            do! Remoting.LeaveCar record.Spot
                            let cur = parkedSpots.Value
                            parkedSpots.Value <- cur.Remove record.Spot
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
    
