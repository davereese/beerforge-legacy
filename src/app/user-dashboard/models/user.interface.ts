export interface User {
  id: string
  firstName: string
  lastName: string
  userName?: string
  profilePic: {
    defaultPicNumber: number
    blobUrl?: string
  }
  Badges?: {
    edges: [{
      node: {
        id: string
      }
    }]
  }
}