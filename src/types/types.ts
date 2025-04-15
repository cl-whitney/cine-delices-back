export interface User {
    id: number;
    first_name: string;
    last_name: string,
    password: string,
    email: string;
    role: 'admin' | 'member';
    status: boolean;
    created_at: Date;
    updated_at: Date

}

export interface recipe {
    id: number;
    title: string;
    image: string;
    description: string;
    instruction: string;
    duration: string;
    difficulty: 'Facile' | 'Moyen' | 'Difficile';
    cost: 'Petit budget' | 'Rapport qualité prix' | 'Couteux';
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
