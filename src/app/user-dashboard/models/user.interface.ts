export interface User {
  id?: string
  firstName?: string
  lastName?: string
  username?: string
  profilePic?: {
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
