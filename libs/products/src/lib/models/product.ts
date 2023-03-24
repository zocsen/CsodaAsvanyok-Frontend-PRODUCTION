import { Category } from "./category";
import { Mineral } from "./mineral";
import { Subcategory } from "./subcategory";

export class Product {
	id?: string;
	name?: string;
	description?: string;
	// richDescription?: string;
	image?: string;
	images?: string[];
	price?: number;
	category?: Category;
	mineral?: Mineral[];
	subcategory?: Subcategory[];
	isFeatured?: boolean;
	dateCreated?: string;
}