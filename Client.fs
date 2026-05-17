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
                on.click (fun _ _ -> JS.Window.Location.Href <- "/schedule")
            ] [ text "Schedule" ]
        ]
    let selectedSpot=Var.Create("is not selected")
    let plateNumber = Var.Create ""
    let parkedSpots = Var.Create<Map<string, ParkingRecordDto>>(Map.empty)

    let parkingSpots =
        [ 'A' .. 'J' ]
        |> List.collect (fun row ->
            [1 .. 10]
            |> List.map (fun col ->
                string row + string col
             )
        )
    let rowPrices =
        Map.ofList [
            'A', 2000
            'B', 4000
            'C', 6000
            'D', 7000
            'E', 10000
            'F', 10000
            'G', 8000
            'H', 6000
            'I', 4000
            'J', 2000
        ]

    let getPrice (spot: string) =
        let row = spot.[0]
        rowPrices |> Map.tryFind row |> Option.defaultValue 0

    let spotButton spot =
        let price = getPrice spot
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
            div [ attr.style "font-size: 10px; opacity: 0.85" ] [
                text (string price + " Ft")
            ]
        ]

    let Main () =
        let urlParams = JS.Window.Location.Search
        let currentDay =
            if urlParams.Contains("day=") then
                urlParams.Split('&')
                |> Array.tryFind (fun p -> p.Contains("day="))
                |> Option.map (fun p -> p.Split('=').[1])
                |> Option.defaultValue ""
            else ""
        let currentTime =
            if urlParams.Contains("time=") then
                urlParams.Split('&')
                |> Array.tryFind (fun p -> p.Contains("time="))
                |> Option.map (fun p -> p.Split('=').[1])
                |> Option.defaultValue ""
            else ""
        let currentDate =
            if urlParams.Contains("date=") then
                urlParams.Split('&')
                |> Array.tryFind (fun p -> p.Contains("date="))
                |> Option.map (fun p -> p.Split('=').[1])
                |> Option.defaultValue ""
            else ""
        async {
            let! data = Remoting.LoadParking currentDay currentTime currentDate
            let map =
                data
                |> List.map (fun r -> r.Spot, r)
                |> Map.ofList
            parkedSpots.Value <- map
        }
        |> Async.StartImmediate

        div [] [
            MenuBar
            div [ attr.style "display: flex; align-items: center; justify-content: center; padding: 10px 20px; position: relative;" ] [
                button [
                    attr.style "padding: 8px 20px; background: #555; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; position: absolute; left: 20px;"
                    on.click (fun _ _ ->
                        JS.Window.Location.Href <- "/"
                    )
                ] [ text "← Back to Schedule" ]
                h1 [ attr.style "margin: 0;" ] [ text "Parking registry" ]
            ]
            div [
                attr.style "
                    width: 80%;
                    margin: 30px auto 20px auto;
                    height: 40px;
                    background: black;
                    border-radius: 4px;
                    text-align: center;
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    line-height: 40px;
                    letter-spacing: 6px;
                    border: 2px solid #ccc;
                 "
            ] [ text "SCREEN" ]
            div [
                 attr.style "
                     display:grid;
                     grid-template-columns:repeat(10, 80px);
                     gap:10px;
                     justify-content:center;
                     margin-top:30px;
                 "
            ] [
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
            Doc.BindView (fun plate ->
                if plate = "" then
                    button [
                        attr.style "margin:10px; padding:10px; background:#ccc; color:#666; border:none; cursor:not-allowed"
                        attr.disabled "disabled"
                    ] [ text "Enter plate first" ]
                else
                    button [
                        attr.style "margin:10px; padding:10px; background:#e67e22; color:white; border:none; border-radius:8px; font-size:16px; cursor:pointer"
                        on.click (fun _ _ ->
                            let spot = selectedSpot.Value
                            let plate = plateNumber.Value
                            let current = parkedSpots.Value

                            if spot = "is not selected" then
                                JS.Alert("First choose a parking space")
                            elif current.ContainsKey spot then
                                JS.Alert("This parking space is already occupied!")
                            else
                                async {
                                    do! Remoting.ParkCar spot plate currentDay currentTime currentDate

                                    let newRecord =
                                        {
                                            Spot = spot
                                            Plate = plate
                                            StartTime = System.DateTime.Now.ToString("o")
                                        }

                                    parkedSpots.Value <- current.Add(spot, newRecord)
                                    plateNumber.Value <- ""
                                    selectedSpot.Value <- "is not selected"

                                    JS.Window.Location.Href <- "/payment?spot=" + spot + "&day=" + currentDay + "&time=" + currentTime + "&date=" + currentDate
                                }
                                |> Async.StartImmediate
                        )
                    ] [ text "🍿 Snacks" ]
            ) plateNumber.View
        ]

    let PaymentMain () =

        let cart = Var.Create<Map<string, int>>(Map.empty)
        let currentSpot =
            let url = JS.Window.Location.Search
            if url.Contains("spot=") then
                url.Split('=').[1]
            else
                "is not selected"
        let spotPrice = getPrice currentSpot
        let snacks = [
            ("Popcorn", 1200, "🍿")
            ("Nachos", 1500, "🧀")
            ("Hot Dog", 1800, "🌭")
            ("Cola", 800, "🥤")
            ("Water", 500, "💧")
            ("Beer", 1000, "🍺")
            ("Chocolate", 700, "🍫")
            ("Gummy Bears", 600, "🍬")
            ("Chips", 900, "🥨")
        ]
        let totalPrice =
            cart.View.Map(fun cartMap ->
                let snackTotal =
                    snacks
                    |> List.sumBy (fun (name, price, _) ->
                        match cartMap |> Map.tryFind name with
                        | Some qty -> qty * price
                        | None -> 0
                    )
                snackTotal + spotPrice
            )
        let snackCard (name, price, emoji) =
            div [
                attr.style "
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                "
            ] [
                div [ attr.style "font-size: 40px; margin-bottom: 8px" ] [ text emoji ]
                div [ attr.style "font-weight: bold; font-size: 16px; margin-bottom: 4px" ] [ text name ]
                div [ attr.style "color: #888; margin-bottom: 12px" ] [ text (string price + " Ft") ]

                div [ attr.style "display: flex; align-items: center; justify-content: center; gap: 10px" ] [
                    button [
                        attr.style "
                            width: 30px; height: 30px;
                            border-radius: 50%;
                            border: none;
                            background: #eee;
                            font-size: 18px;
                            cursor: pointer;
                        "
                        on.click (fun _ _ ->
                            let currentCart = cart.Value
                            match currentCart.TryFind name with
                            | Some qty when qty > 1 -> cart.Value <- currentCart.Add(name, qty - 1)
                            | Some _ -> cart.Value <- currentCart.Remove name
                            | None -> ()
                        )
                    ] [ text "−" ]
                    textView (
                        cart.View.Map(fun map ->
                            match map.TryFind name with
                            | Some qty -> string qty
                            | None -> "0"
                        )
                    )
                    button [
                        attr.style "
                            width: 30px; height: 30px;
                            border-radius: 50%;
                            border: none;
                            background: #333;
                            color: white;
                            font-size: 18px;
                            cursor: pointer;
                        "
                        on.click (fun _ _ ->
                            let currentCart = cart.Value
                            let currentQty = currentCart.TryFind name |> Option.defaultValue 0
                            cart.Value <- currentCart.Add(name, currentQty + 1)
                        )
                    ] [ text "+" ]
                ]
            ]
        div [ attr.style "background: #f5f5f5; min-height: 100vh; font-family: sans-serif" ] [

            MenuBar

            div [ attr.style "max-width: 900px; margin: 0 auto; padding: 30px" ] [

                 h2 [ attr.style "text-align: center; margin-bottom: 30px" ] [ text "🎬 Snack Selection" ]

                 div [
                     attr.style "
                         display: grid;
                         grid-template-columns: repeat(3, 1fr);
                         gap: 20px;
                         margin-bottom: 30px;
                     "
                 ] [
                     for snack in snacks do
                         snackCard snack
                 ]
                 div [
                      attr.style "
                          background: white;
                          border-radius: 12px;
                          padding: 20px;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                      "
                 ] [
                      div [ attr.style "font-size: 16px;" ] [
                          div [] [
                              text "🅿️ Parking spot: "
                              text currentSpot
                          ]
                          div [] [
                              text "🅿️ Parking price: "
                              text (string spotPrice + " Ft")
                          ]
                          div [] [
                              text "🍿 Snacks: "
                              textView (
                                  cart.View.Map(fun cartMap ->
                                      let snackTotal =
                                          snacks
                                          |> List.sumBy (fun (name, price, _) ->
                                              match cartMap |> Map.tryFind name with
                                              | Some qty -> qty * price
                                              | None -> 0
                                          )
                                      string snackTotal + " Ft"
                                  )
                               )
                          ]
                        
                          div [ attr.style "font-size: 20px; font-weight: bold; margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px" ] [
                              text "Total: "
                              textView (totalPrice.Map(fun p -> string p + " Ft"))
                          ]
                      ]

                      button [
                          attr.style "
                              padding: 12px 30px;
                              background: #333;
                              color: white;
                              border: none;
                              border-radius: 8px;
                              font-size: 16px;
                              cursor: pointer;
                          "
                          on.click (fun _ _ ->
                              let snackTotal =
                                  snacks
                                  |> List.sumBy (fun (name, price, _) ->
                                      match cart.Value.TryFind name with
                                      | Some qty -> qty * price
                                      | None -> 0
                                  )
                              let total = spotPrice + snackTotal

                              if total = 0 then
                                  JS.Alert("You have not selected anything!")
                              else
                                  JS.Alert($"Order placed! Total: {total} Ft\nThank you for your visit!")
                                  cart.Value <- Map.empty
                                  JS.Window.Location.Href <- "/"
                          ) 
                      ] [ text "Place Order" ]
                 ]
            ]
        ]    
    let ScheduleMain () =
        let selectedDate = Var.Create ""
        let today = System.DateTime.Now
        let maxDate = today.AddDays(14.0)
        let availableDates =
            [ 0 .. 13 ]
            |> List.map (fun i -> today.AddDays(float i))
        
        async {
            do! Remoting.CleanExpiredBookings()
        }
        |> Async.StartImmediate

        let showTimes = [
           "10:00", "Children's Film", "🧸"
           "13:00", "Comedy",          "😂"
           "16:00", "Romance",         "💕"
           "19:00", "Action",          "💥"
           "22:00", "Horror",          "👻"
        ]
        let dateButton (date: System.DateTime) =
            let dateStr = date.ToString("yyyy-MM-dd")
            let dt = System.DateTime.Parse(dateStr)
            let dayName =
                match dt.DayOfWeek with
                | System.DayOfWeek.Monday -> "Monday"
                | System.DayOfWeek.Tuesday -> "Tuesday"
                | System.DayOfWeek.Wednesday -> "Wednesday"
                | System.DayOfWeek.Thursday -> "Thursday"
                | System.DayOfWeek.Friday -> "Friday"
                | System.DayOfWeek.Saturday -> "Saturday"
                | System.DayOfWeek.Sunday -> "Sunday"
                | _ -> ""
            Doc.BindView (fun selected ->
                button [
                    attr.style (
                        if selected = dateStr then
                            "margin: 5px; padding: 10px 15px; background: #e67e22; color: white; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; font-weight: bold; text-align: center;"
                        else
                            "margin: 5px; padding: 10px 15px; background: #333; color: white; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; text-align: center;"
                    )
                    on.click (fun _ _ ->
                        selectedDate.Value <- dateStr
                    )
                ] [
                    div [] [ text dayName ]
                    div [ attr.style "font-size: 11px; opacity: 0.8;" ] [ text (date.ToString("MM. dd.")) ]
                ]
            ) selectedDate.View

        let timeButton (time: string) (genre: string) (emoji: string) (dateStr: string) =
            let dt = System.DateTime.Parse(dateStr)
            let dayName =
                match dt.DayOfWeek with
                | System.DayOfWeek.Monday -> "Monday"
                | System.DayOfWeek.Tuesday -> "Tuesday"
                | System.DayOfWeek.Wednesday -> "Wednesday"
                | System.DayOfWeek.Thursday -> "Thursday"
                | System.DayOfWeek.Friday -> "Friday"
                | System.DayOfWeek.Saturday -> "Saturday"
                | System.DayOfWeek.Sunday -> "Sunday"
                | _ -> ""
            let now = System.DateTime.Now
            let showDateTime = System.DateTime.Parse(dateStr + " " + time)
            let isPast = showDateTime < now
            if isPast then
                button [
                    attr.style "margin: 8px; padding: 20px 30px; background: #aaa; color: #eee; border: none; border-radius: 10px; font-size: 16px; cursor: not-allowed; font-weight: bold; width: 160px; opacity: 0.6;"
                    attr.disabled "disabled"
                ] [
                    div [] [ text ("🕐 " + time) ]
                    div [ attr.style "font-size: 14px; margin-top: 4px;" ] [ text (emoji + " " + genre) ]
                    div [ attr.style "font-size: 12px; opacity: 0.85; margin-top: 4px;" ] [ text "Already started" ]
                ]
            else
                button [
                    attr.style "margin: 8px; padding: 20px 30px; background: #27ae60; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; font-weight: bold; width: 160px;"
                    on.click (fun _ _ ->
                        JS.Window.Location.Href <- "/parking?day=" + dayName + "&time=" + time + "&date=" + dateStr
                    )
                ] [
                    div [] [ text ("🕐 " + time) ]
                    div [ attr.style "font-size: 14px; margin-top: 4px;" ] [ text (emoji + " " + genre) ]
                    div [ attr.style "font-size: 12px; opacity: 0.85; margin-top: 4px;" ] [ text "Click to book" ]
                ]

        div [ attr.style "background: #f5f5f5; min-height: 100vh; font-family: sans-serif;" ] [
            MenuBar
            div [ attr.style "max-width: 900px; margin: 0 auto; padding: 30px;" ] [
                h2 [ attr.style "text-align: center; margin-bottom: 10px;" ] [
                    text "🎬 Select a Date"
                ]
                p [ attr.style "text-align: center; color: #888; margin-bottom: 20px;" ] [
                    text "Available for the next 14 days"
                ]
                div [ attr.style "display: flex; flex-wrap: wrap; justify-content: center; margin-bottom: 30px;" ] [
                    for date in availableDates do
                        dateButton date
                ]
                Doc.BindView (fun dateStr ->
                    if dateStr = "" then
                        div [ attr.style "text-align: center; color: #aaa; font-size: 16px; padding: 40px;" ] [
                            text "👆 Select a date to see show times"
                        ]
                    else
                        let dt = System.DateTime.Parse(dateStr)
                        let dayName = dt.DayOfWeek.ToString()
                        div [] [
                            h3 [ attr.style "text-align: center; margin-bottom: 20px;" ] [
                                text ("📅 " + dayName + " - " + dt.ToString("yyyy. MM. dd."))
                            ]
                            p [ attr.style "text-align: center; color: #888; margin-bottom: 20px;" ] [
                                text "Click a show time to choose your parking spot"
                            ]
                            div [ attr.style "display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;" ] [
                                for (time, genre, emoji) in showTimes do
                                    timeButton time genre emoji dateStr
                            ]
                        ]
                ) selectedDate.View
            ]
        ]