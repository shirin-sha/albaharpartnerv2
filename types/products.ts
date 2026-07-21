export interface Product {
  id: string | number;
  price: number;
  oldPrice?: number;
  title: string;
  imgSrc: string;

  // add other product properties if needed
}
