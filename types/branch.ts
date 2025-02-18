export interface Branch {
    id: string
    city: string
    address: string
    phone: string
    email: string
    timings: string
    mapLink: string
    about?: string
    established?: string
    services: {
      packing: boolean
      loading: boolean
      unloading: boolean
      transportation: boolean
      unpacking: boolean
      insurance: boolean
      household?: string[]
      commercial?: string[]
    }
    areas?: string[]
    features?: string[]
    keywords?: string[]
  }
  
  