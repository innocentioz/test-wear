import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export default function Card ({ id, name, price, description, imageUrl } : CardProps) {
    return (
        <div>
            <Link href={`/product/${id}`}>
                <Image src={imageUrl} alt={name} width={300} height={300} />
                <div>
                    <h2>{name}</h2>
                    <p>{description}</p>    
                    <p>{price} ₽</p>
                </div>
            </Link>
        </div>
    )
}
