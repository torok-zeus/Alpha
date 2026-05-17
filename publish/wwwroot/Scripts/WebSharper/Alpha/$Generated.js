import { DecodeRecord, Id, DecodeDateTime } from "../WebSharper.Web/WebSharper.ClientSideJson.Provider.js"
let Decoder_ParkingRecord;
export function DecodeJson_ParkingRecord(){
  return Decoder_ParkingRecord?Decoder_ParkingRecord:Decoder_ParkingRecord=(DecodeRecord(void 0, [["Spot", Id(), 0], ["Plate", Id(), 0], ["StartTime", DecodeDateTime(), 0]]))();
}
