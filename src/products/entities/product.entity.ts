import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'Product ID',
    uniqueItems: true,
  })
  id: string;

  @Column('text', {
    unique: true,
  })
  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    example: 'Anim reprehenderit nulla in anim mollit minim irure commodo.',
    description: 'Product description',
    default: null,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - for SEO',
    uniqueItems: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  sizes: string[];

  @Column('text')
  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  @ApiProperty()
  tags: string[];

  // images
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  @ApiProperty()
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
