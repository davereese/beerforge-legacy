export interface User {
  id?: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  city?: string
  state?: string
  profilePic?: {
    id: string
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
