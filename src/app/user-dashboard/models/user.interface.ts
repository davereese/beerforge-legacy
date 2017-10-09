export interface User {
  id: string
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
        batchNum: number
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