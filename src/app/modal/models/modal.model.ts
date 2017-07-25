export interface modalData {
  title: string
  body: string
  buttons?: {
    view?: boolean
    viewData?: string
    dashboard?: boolean
    close?: boolean
  }
}