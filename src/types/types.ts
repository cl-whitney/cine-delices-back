export enum Role {
    Invalide = 0,
    Admin = 'admin',
    Member = 'member'
}

export enum Difficulty {
    Invalide = 0,
    Facile = 1,
    Moyen = 2,
    Difficile = 3
}

export enum Cost {
    PetitBudget = 1,
    RapportQualitePrix = 2,
    Couteux = 3
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: Role;
    status: boolean;
    created_at: Date;
    updated_at?: Date;
  }

export interface recipe {
    id: number;
    title: string;
    image: string;
    description: string;
    instruction: string;
    duration: string;
    difficulty: Difficulty;
    cost: Cost;
    user_id: number;
    status: boolean;
    created_at: Date;
    updated_at?: Date;
    categories?: Category[];
    ingredients?: Quantity[];
    media?: Media[];
}

export interface Category {
    id: number;
    name: string;
    recipe_id: number;
    status: boolean;
    created_at: Date;
    updated_at?: Date;
  }
  
export interface Ingredient {
    id: number;
    name: string;
    unity: string;
    status: boolean;
    created_at: Date;
    updated_at?: Date;
}
  
export interface Media {
    id: number;
    title: string;
    type: string;
    description?: string;
    label?: string;
    recipe_id: number;
    status: boolean;
    created_at: Date;
    updated_at?: Date;
}
  
export interface Quantity {
    id: number;
    recipe_id: number;
    ingredient_id: number;
    quantity: number;
    created_at: Date;
    updated_at?: Date;
    ingredient?: Ingredient;
}
