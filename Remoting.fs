namespace Alpha

open WebSharper
open System.IO
open System.Text.Json

type ParkingRecord =
    {
        Spot : string
        Plate : string
        StartTime : System.DateTime
    }
[<JavaScript>]
type ParkingRecordDto =
    {
        Spot: string
        Plate: string
        StartTime: string
    }
[<JavaScript>]
module Remoting =
    let file = "parking.json"

    let toDto (p: ParkingRecord) : ParkingRecordDto =
        {
            Spot = p.Spot
            Plate = p.Plate
            StartTime = p.StartTime.ToString("o")
        }
    [<Rpc>]
    let ParkCar (spot: string) (plate: string) : Async<unit> =
        async {
            
           let records : ParkingRecord list=
               if File.Exists(file) then
                   File.ReadAllLines(file)
                   |> Array.map ( fun l -> JsonSerializer.Deserialize<ParkingRecord>(l))
                   |> Array.toList
               else []
           
           let filtered = records |> List.filter (fun r -> r.Spot <> spot)

           let newRecord : ParkingRecord =
               {
                   Spot = spot
                   Plate = plate
                   StartTime = System.DateTime.Now
               }
           let newList : ParkingRecord list= newRecord :: filtered
           let lines = newList |> List.map JsonSerializer.Serialize
           
           File.WriteAllLines(file, lines)
        }

    [<Rpc>]
    let LoadParking () : Async<ParkingRecordDto list> =
        async {
            if File.Exists(file) then
                let lines = File.ReadAllLines(file)

                return
                    lines
                    |> Array.map (fun l -> JsonSerializer.Deserialize<ParkingRecord>(l))
                    |> Array.map toDto
                    |> Array.toList
            else
                return ([] : ParkingRecordDto list)
        }
    [<Rpc>]
    let LeaveCar (spot: string) : Async<unit> =
        async{
            if File.Exists(file) then
                let lines = File.ReadAllLines(file)
                let records : ParkingRecord list =
                    lines
                    |> Array.map (fun l -> JsonSerializer.Deserialize<ParkingRecord>(l))
                    |> Array.toList

                let filtered = records |> List.filter (fun r -> r.Spot <>spot)
                let newLines= filtered |> List.map JsonSerializer.Serialize
                File.WriteAllLines(file, newLines)
        }