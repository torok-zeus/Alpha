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
    let toDto (p: ParkingRecord) : ParkingRecordDto =
        {
            Spot = p.Spot
            Plate = p.Plate
            StartTime = p.StartTime.ToString("o")
        }

    let getFileName (day: string) (time: string) (date: string)=
        let safeTime = time.Replace(":", "-")
        let safeDate = date.Replace("/", "-").Replace(".", "-")
        $"parking_{day}_{safeDate}_{safeTime}.json"

    [<Rpc>]
    let ParkCar (spot: string) (plate: string) (day: string) (time: string) (date: string) : Async<unit> =
        async {
           let file = getFileName day time date
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
    let LoadParking (day: string) (time: string) (date: string) : Async<ParkingRecordDto list> =
        async {
            let file = getFileName day time date
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
    let LeaveCar (spot: string) (day: string) (time: string) (date: string) : Async<unit> =
        async{
            let file = getFileName day time date
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
    [<Rpc>]
    let CleanExpiredBookings () : Async<unit> =
        async {
            let now = System.DateTime.Now
            let dataDir = "."
            let files = Directory.GetFiles(dataDir, "parking_*.json")
            for file in files do
                let name = Path.GetFileNameWithoutExtension(file)
                let parts = name.Split('_')
                if parts.Length >= 4 then
                    let datePart = parts.[2]
                    let timePart = parts.[3].Replace("-", ":")
                    match System.DateTime.TryParse(datePart + " " + timePart) with
                    | true, showTime ->
                        if showTime < now then
                            File.Delete(file)
                    | _ -> ()
        }