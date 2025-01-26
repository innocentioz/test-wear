import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface PrismaError {
  code?: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { username, fullName, password } = body;

  if (!username || !fullName || !password) {
    return NextResponse.json({ message: "Все поля должны быть заполнены." }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        fullName,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Пользователь создан!", user }, { status: 201 });
  } catch (error) {
    const prismaError = error as PrismaError;

    if (prismaError.code === "P2002") {
      return NextResponse.json({ message: "Имя уже занято." }, { status: 400 });
    }
    return NextResponse.json({ message: "Что-то пошло не так" }, { status: 500 });
  }
}
