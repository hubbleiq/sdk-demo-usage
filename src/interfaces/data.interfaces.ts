export interface ICompleteData {
  upload: number
  download: number
  ip: string
  jitter: number
  hops?: string
  latency: number
  retransmission: string
  packet_loss: number
}
export interface IUploadAndDownloadData {
  ClientToServerSpeed: number
  ServerToClientSpeed: number
  ip: string
  Jitter: number
  latency: number
  retransmission: string
  packet_loss: number
}
export interface IConnectionMsg {
  color: string
  header: string
  msg: string
}
