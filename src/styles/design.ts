export interface BikeDesign {
  id?: string;
  userId?: string;
  bikeModel: string;
  colors: {
    body: string;
    wheels: string;
    seat: string;
    mirrors: string;
    frame: string;
  };
  createdAt?: string;
  updatedAt?: string;
  isPublic: boolean;
  likes?: number;
  name?: string;
  description?: string;
}

export interface SavedDesign extends BikeDesign {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}