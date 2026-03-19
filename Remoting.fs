namespace Alpha

open WebSharper
open System.IO
open System.Text.Json

type ParkingRecord =
    {
        Spot : string
        Plate : string
    }
[<JavaScript>]
module Remoting =
    let file = "parking.json"
    [<Rpc>]
    let ParkCar spot plate =
        async {
            
            let record =
                {
                   Spot =spot
                   Plate = plate
                }
            let json = JsonSerializer.Serialize(record)
            
            File.AppendAllText(file, json + "\n")
        }

    [<Rpc>]
    let LoadParking () =
        async {
            if File.Exists(file) then
                let lines = File.ReadAllLines(file)

                return
                    lines
                    |> Array.map (fun l -> JsonSerializer.Deserialize<ParkingRecord>(l))
                    |> Array.toList
            else
                return []
        }
    [<Rpc>]
    let LeaveCar spot =
        async{
            if File.Exists(file) then
                let lines = File.ReadAllLines(file)
                let records =
                    lines
                    |> Array.map (fun l -> JsonSerializer.Deserialize<ParkingRecord>(l))
                    |> Array.toList

                let filtered = records |> List.filter (fun r -> r.Spot <>spot)
                let newLines= filtered |> List.map JsonSerializer.Serialize
                File.WriteAllLines(file, newLines)
        }