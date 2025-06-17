import type React from "react"
export interface User {
  name: string
  email: string
  avatar?: string
}

export interface Car {
  id: number
  name: string
  brand: string
  year: number
  price: number
  status: "available" | "rented" | "maintenance"
  image?: string
  features: string[]
  mileage: string
}

export interface Message {
  id: number
  sender: string
  message: string
  time: string
  avatar?: string
  isCustomer: boolean
}

export interface Conversation {
  id: number
  name: string
  lastMessage: string
  time: string
  unread: number
  avatar?: string
  status: "online" | "offline"
}

export interface Rental {
  id: number
  customer: string
  car: string
  date: string
  status: "Active" | "Completed" | "Pending"
  amount: string
}

export interface Stat {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ReactNode
}
