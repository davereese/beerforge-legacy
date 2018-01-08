import { Badge } from "app/user-dashboard/models/badge.interface";

export interface modalData {
  title: string
  body: string
  badges?: Badge[]
  buttons?: {
    view?: boolean
    viewData?: string
    dashboard?: boolean
    close?: boolean
    closeData?: string
    yes?: boolean
    newBrew?: boolean
  }
}
