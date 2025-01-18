export class Item {
  private id: number;
  private title: string;
  private author: string;
  private price: number;
  private imageUrl: string;
  private discountPrice?: number;

  constructor(
    id: number,
    title: string,
    author: string,
    price: number,
    imageUrl: string,
    discountPrice?: number
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.imageUrl = imageUrl;
    this.discountPrice = discountPrice;
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getAuthor(): string {
    return this.author;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDiscountPrice(): number | undefined {
    return this.discountPrice;
  }

  public setDiscountPrice(n: number) {
    this.discountPrice = n;
  }

  public getImageUrl(): string {
    return this.imageUrl;
  }
}
