export interface INewProduct {
  title: string,
  photo: string,
  description: string,
  price: string,
  link: string,
  seller: string,
  category: string,
}
export default interface IProduct extends INewProduct {
  id: number;
}