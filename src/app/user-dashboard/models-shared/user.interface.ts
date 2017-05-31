export interface User {
  firstName: string
  lastName: string
  userName?: string
  profilePic: {
    defaultPicNumber: number
    blobUrl?: string
  }
  Brews?: {
    edges: [{
      node: {
        id: string
        name: string
        createdAt: string
      }
    }]
  }
  Badges?: {
    edges: [{
      node: {
        id: string
      }
    }]
  }
}