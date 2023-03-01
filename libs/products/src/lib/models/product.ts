import { Category } from "./category";

export class Product {
	id?: string;
	name?: string;
	description?: string;
	// richDescription?: string;
	image?: string;
	images?: string[];
	price?: number;
	category?: Category;
	isFeatured?: boolean;
	dateCreated?: string;
}